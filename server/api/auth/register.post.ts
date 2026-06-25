import { eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";
import { users } from "~~/server/db/schema";
import { hashPassword } from "~~/server/utils/auth";

const bodySchema = z.object({
  fullName: z.string().min(2, "ФИО должно содержать минимум 2 символа"),
  login: z
    .string()
    .min(6, "Логин должен содержать минимум 6 символов")
    .regex(/^[a-zA-Z0-9]+$/, "Логин может содержать только латиницу и цифры"),
  email: z.string().email("Некорректный email"),
  phone: z
    .string()
    .regex(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, "Формат телефона: 8(XXX)XXX-XX-XX"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readValidatedBody(event, bodySchema.parse);
  } catch (e) {
    // Если ошибка валидации Zod – сразу возвращаем её в нужном формате
    if (e.name === "ZodError") {
      throw createError({
        status: 400,
        data: { issues: e.issues },
      });
    }
    throw e;
  }

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  // Проверяем уникальность логина, email и телефона
  const existing = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.login, body.login),
        eq(users.email, body.email),
        eq(users.phone, body.phone),
      ),
    );

  const issues = [];

  if (existing.length) {
    // Проверяем каждое поле отдельно
    const loginTaken = existing.some((u) => u.login === body.login);
    const emailTaken = existing.some((u) => u.email === body.email);
    const phoneTaken = existing.some((u) => u.phone === body.phone);

    if (loginTaken) {
      issues.push({ path: ["login"], message: "Этот логин уже занят" });
    }
    if (emailTaken) {
      issues.push({ path: ["email"], message: "Этот email уже используется" });
    }
    if (phoneTaken) {
      issues.push({
        path: ["phone"],
        message: "Этот номер телефона уже зарегистрирован",
      });
    }

    throw createError({
      status: 400,
      data: { issues },
    });
  }

  // Хешируем пароль и создаём пользователя
  const hashed = await hashPassword(body.password);
  await db.insert(users).values({
    fullName: body.fullName,
    login: body.login,
    password: hashed,
    email: body.email,
    phone: body.phone,
    role: "user",
  });

  await connection.end();
  return { success: true };
});
