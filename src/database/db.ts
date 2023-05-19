import mysql, { Pool, PoolConnection } from "mysql2/promise";
import database from "../../config";

let pool: Pool;

export async function Connect(): Promise<PoolConnection> {
  if (!pool) {
    pool = mysql.createPool({
      host: database.database.host,
      user: database.database.user,
      password: database.database.password,
      database: database.database.database,
    });
  }
  
  const connection = await pool.getConnection();
  return connection;
}
