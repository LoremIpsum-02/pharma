import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";
import { orders } from "~~/server/db/schema";
import { verifyToken } from "~~/server/utils/auth";

const bodySchema = z.object({
  status: z.enum(["Новый", "В обработке", "Завершен", "Отменен"]),
});

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ status: 401, message: "Unauthorized" });
  }

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string" || (decoded.role !== "admin" && decoded.role !== "Администратор")) {
    throw createError({ status: 403, message: "Forbidden" });
  }

  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ status: 400, message: "Order ID required" });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  await db.update(orders).set({ status: body.status }).where(eq(orders.id, id));

  await connection.end();
  return { success: true };
});
