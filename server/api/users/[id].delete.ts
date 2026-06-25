import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from '~~/server/db/schema';
import { verifyToken } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token');
  if (!token) throw createError({ status: 401, message: 'Unauthorized' });
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string' || (decoded.role !== "admin" && decoded.role !== "Администратор")) {
    throw createError({ status: 403, message: 'Forbidden' });
  }

  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ status: 400, message: 'User ID required' });
  }

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  const existing = await db.select().from(users).where(eq(users.id, id));
  if (!existing.length) {
    await connection.end();
    throw createError({ status: 404, message: 'User not found' });
  }

  await db.delete(users).where(eq(users.id, id));

  await connection.end();
  return { success: true };
});