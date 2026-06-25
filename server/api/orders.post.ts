import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { orders } from "~~/server/db/schema";
import { verifyToken } from "~~/server/utils/auth";
import { z } from "zod";

const bodySchema = z.object({
  article: z.string().min(1),
  desiredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата должна быть в формате ГГГГ-ММ-ДД"),
  paymentMethod: z.string().min(1),
  price: z.number().positive(),
  pickupPointId: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ status: 401, message: "Unauthorized" });
  }
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") {
    throw createError({ status: 401, message: "Unauthorized" });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  await db.insert(orders).values({
    article: body.article,
    userId: decoded.id,
    desiredDate: new Date(body.desiredDate),
    paymentMethod: body.paymentMethod,
    price: body.price,
    pickupPointId: body.pickupPointId,
    status: "Новый",
  });

  await connection.end();
  return { success: true };
});
