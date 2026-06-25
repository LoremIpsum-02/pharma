import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { users } from '~~/server/db/schema'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token) throw createError({ status: 401, message: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded || typeof decoded === 'string' || (decoded.role !== "admin" && decoded.role !== "Администратор")) {
    throw createError({ status: 403, message: 'Forbidden' })
  }

  const connection = await mysql.createConnection({
    uri: useRuntimeConfig().databaseUrl
  })
  const db = drizzle(connection)
  const allUsers = await db.select().from(users)
  await connection.end()
  return allUsers
})
