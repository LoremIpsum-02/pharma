import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";
import { users } from "~~/server/db/schema";
import { hashPassword, verifyToken } from "~~/server/utils/auth";

const bodySchema = z.object({
  fullName: z.string().min(2),
  login: z.string().min(6),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  // Проверка админа
  const token = getCookie(event, "token");
  if (!token) throw createError({ status: 401, message: "Unauthorized" });
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string" || decoded.role !== "admin") {
    throw createError({ status: 403, message: "Forbidden" });
  }

  const body = await readValidatedBody(event, bodySchema.parse);

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  // Проверяем уникальность логина
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.login, body.login));
  if (existing.length) {
    await connection.end();
    throw createError({ status: 400, message: "Логин уже занят" });
  }

  const hashed = await hashPassword(body.password);
  await db.insert(users).values({
    fullName: body.fullName,
    login: body.login,
    password: hashed,
    email: body.email,
    phone: body.phone,
    role: body.role,
  });

  await connection.end();
  return { success: true };
});
