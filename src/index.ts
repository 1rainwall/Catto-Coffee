import { BotClient } from "./client/BotClient";

const client = new BotClient();
export default client;
client.login(process.env.TOKEN);

declare module '@sapphire/framework' {
    interface Preconditions {
      OwnerOnly: never;
      ModOnly: never;
    }
  }
