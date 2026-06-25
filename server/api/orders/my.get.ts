import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { orders, products, pickupPoints } from "~~/server/db/schema";
import { verifyToken } from "~~/server/utils/auth";
import { eq, leftJoin } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ status: 401, message: "Unauthorized" });
  }
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") {
    throw createError({ status: 401, message: "Unauthorized" });
  }

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl,
  });
  const db = drizzle(connection);

  const userOrders = await db
    .select({
      id: orders.id,
      article: orders.article,
      desiredDate: orders.desiredDate,
      paymentMethod: orders.paymentMethod,
      price: orders.price,
      status: orders.status,
      review: orders.review,
      productName: products.name,
      pickupAddress: pickupPoints.address,
    })
    .from(orders)
    .leftJoin(products, eq(orders.article, products.article))
    .leftJoin(pickupPoints, eq(orders.pickupPointId, pickupPoints.id))
    .where(eq(orders.userId, decoded.id))
    .orderBy(orders.createdAt);

  await connection.end();
  return userOrders;
});
