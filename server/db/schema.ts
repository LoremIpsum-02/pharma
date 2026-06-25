import {
  mysqlTable,
  serial,
  varchar,
  int,
  decimal,
  text,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Таблица товаров
export const products = mysqlTable("products", {
  id: varchar("Артикул", { length: 50 }).notNull(),
  article: varchar("Артикул", { length: 50 }).notNull(),
  name: varchar("Наименование товара", { length: 255 }).notNull(),
  unit: varchar("Единица измерения", { length: 50 }),
  price: decimal("Цена", { precision: 10, scale: 2 }),
  supplier: varchar("Поставщик", { length: 100 }),
  manufacturer: varchar("Производитель", { length: 100 }),
  category: varchar("Категория товара", { length: 100 }),
  discount: int("Действующая скидка").default(0),
  stock: int("Кол-во на складе").default(0),
  description: text("Описание товара"),
  photo: varchar("Фото", { length: 255 }),
});

// Таблица пунктов выдачи
export const pickupPoints = mysqlTable("pickup_points", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 255 }).notNull(),
});

// Таблица пользователей
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  login: varchar("login", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
});

// Таблица заказов
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  article: varchar("article", { length: 50 }).notNull(),
  orderDate: datetime("order_date"),
  deliveryDate: datetime("delivery_date"),
  pickupPointId: int("pickup_point_id"),
  clientName: varchar("client_name", { length: 255 }),
  pickupCode: varchar("pickup_code", { length: 50 }),
  status: varchar("status", { length: 50 }).default("Новый"),
  userId: int("user_id"),
  desiredDate: datetime("desired_date"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  review: text("review"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});
