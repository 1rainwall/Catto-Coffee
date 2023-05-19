export default {
  // Bot config
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
  guild: process.env.GUILD,
  // Database config
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
};
