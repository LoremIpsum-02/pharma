import { eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";
import { users } from "~~/server/db/schema";
import { comparePassword, signToken, hashPassword } from "~~/server/utils/auth";

const bodySchema = z.object({
  loginOrEmail: z.string().min(3, "Введите логин или email"),
  password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  const user = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.login, body.loginOrEmail),
        eq(users.email, body.loginOrEmail),
      ),
    );

  if (!user.length) {
    await connection.end();
    throw createError({
      status: 401,
      message: "Неверный логин/email или пароль",
    });
  }

  let valid = false;

  try {
    valid = await comparePassword(body.password, user[0].password);
  } catch (e) {
    //
  }

  if (!valid) {
    valid = body.password === user[0].password;
    if (valid) {
      const hashed = await hashPassword(body.password);
      await db
        .update(users)
        .set({ password: hashed })
        .where(eq(users.id, user[0].id));
    }
  }

  if (!valid) {
    await connection.end();
    throw createError({
      status: 401,
      message: "Неверный логин/email или пароль",
    });
  }

  const token = signToken({ id: user[0].id, role: user[0].role });
  setCookie(event, "token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  await connection.end();
  return {
    success: true,
    user: {
      id: user[0].id,
      fullName: user[0].fullName,
      role: user[0].role,
      email: user[0].email,
      phone: user[0].phone,
    },
  };
});
