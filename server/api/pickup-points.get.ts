import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { pickupPoints } from "~~/server/db/schema";

export default defineEventHandler(async () => {
  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);
  const result = await db.select().from(pickupPoints);
  await connection.end();
  return result;
});
