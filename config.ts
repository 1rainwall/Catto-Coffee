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
  },
  emojis: {
    accept: "<:accepted:1083594549575823430>",
    denied: '<a:cattonope:1078929462290292756>',
    loading: '<a:cattoloading:999977120614850572>',
    warn: '<:cattowarn:1109936311399350433>',
  }
};