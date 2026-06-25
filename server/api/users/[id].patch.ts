import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";
import { users } from "~~/server/db/schema";
import { verifyToken } from "~~/server/utils/auth";

const bodySchema = z.object({
  fullName: z.string().min(2).optional(),
  login: z.string().min(6).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export default defineEventHandler(async (event) => {
  // Проверка админа
  const token = getCookie(event, "token");
  if (!token) throw createError({ status: 401, message: "Unauthorized" });
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string" || (decoded.role !== "admin" && decoded.role !== "Администратор")) {
    throw createError({ status: 403, message: "Forbidden" });
  }

  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ status: 400, message: "User ID required" });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  const existing = await db.select().from(users).where(eq(users.id, id));
  if (!existing.length) {
    await connection.end();
    throw createError({ status: 404, message: "User not found" });
  }

  if (body.login) {
    const duplicate = await db
      .select()
      .from(users)
      .where(eq(users.login, body.login))
      .where((users) =>
        eq(users.id, id) ? undefined : eq(users.login, body.login),
      );
    
    const conflict = await db
      .select()
      .from(users)
      .where(eq(users.login, body.login))
      .where((users) =>
        eq(users.id, id) ? undefined : eq(users.login, body.login),
      );
    
    const sameLoginUser = await db
      .select()
      .from(users)
      .where(eq(users.login, body.login))
      .where((users) =>
        eq(users.id, id) ? undefined : eq(users.login, body.login),
      );
    
    const allWithLogin = await db
      .select()
      .from(users)
      .where(eq(users.login, body.login));
    if (allWithLogin.some((u) => u.id !== id)) {
      await connection.end();
      throw createError({
        status: 400,
        message: "Логин уже занят другим пользователем",
      });
    }
  }

  const updateData: any = {};
  if (body.fullName) updateData.fullName = body.fullName;
  if (body.login) updateData.login = body.login;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.role) updateData.role = body.role;

  await db.update(users).set(updateData).where(eq(users.id, id));

  await connection.end();
  return { success: true };
});
