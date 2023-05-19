import  mysql  from "mysql2";

export async function Connect() {
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cattoclient",
  });
  return connection;
}