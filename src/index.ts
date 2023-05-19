import { BotClient } from './client/BotClient';

const client = new BotClient();
client.login(process.env.TOKEN)