import { createPool } from "mysql2/promise";

export async function Connect() {
  const connection = await createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cattoclient",
  });

  if (connection) console.log("DB is connected");
  else console.log("DB is not connected");
  return connection;
}
