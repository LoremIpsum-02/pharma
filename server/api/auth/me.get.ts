import { verifyToken } from "~~/server/utils/auth";
import { users } from "~~/server/db/schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ status: 401, message: "Unauthorized" });
  }

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") {
    throw createError({ status: 401, message: "Invalid token" });
  }

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  const user = await db.select().from(users).where(eq(users.id, decoded.id));
  await connection.end();

  if (!user.length) {
    throw createError({ status: 401, message: "User not found" });
  }

  return {
    id: user[0].id,
    fullName: user[0].fullName,
    role: user[0].role,
    email: user[0].email,
    phone: user[0].phone,
  };
});
