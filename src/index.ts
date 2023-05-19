import { BotClient } from "./client/BotClient";

const client = new BotClient();
export default client;
client.login(process.env.TOKEN);