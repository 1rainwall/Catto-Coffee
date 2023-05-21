import { Colors } from "discord.js";

export default {
  // Bot config
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
  guild: process.env.GUILD,
  Owner: process.env.BOT_OWNER,
  // Database config
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  colors: {
    primary: Colors.White,
    secondary: Colors.Blue,
    error: Colors.Red,
    success: Colors.Green,
  },
  images: {
    avatar: "https://i.imgur.com/Gm6SA0K.jpg",
  }
};