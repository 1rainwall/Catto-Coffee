import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";
import { Connect } from "../../database/db";

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, { ...options, once: true });
  }

  public async run(client: Client) {
    await Connect();
    this.container.logger.info(`Conectado a la base de datos. ✔️`);
    const { tag, id } = client.user!;
    return this.container.logger.info(`Bot iniciado como ${tag} (${id})`);
  }
}
