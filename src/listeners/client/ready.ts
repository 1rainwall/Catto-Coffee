import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, { ...options, once: true });
  }

  public run(client: Client) {
    const { tag, id } = client.user!;
    return this.container.logger.info(`Bot iniciado como ${tag} (${id})`);
  }
}
