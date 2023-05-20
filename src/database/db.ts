// import mysql, { Pool, PoolConnection } from "mysql2/promise";
import config from "../../config";

// let pool: Pool;

// export async function Connect(): Promise<PoolConnection> {
//   if (!pool) {
//     pool = mysql.createPool({
//       host: database.database.host,
//       user: database.database.user,
//       password: database.database.password,
//       database: database.database.database,
//       connectionLimit: 10
//     });
//   }
//   const connection = await pool.getConnection();
//   return connection;
// }

import * as mysql from "mysql2";

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

export default connection
