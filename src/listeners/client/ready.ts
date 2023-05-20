import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";
import connection from "../../database/db";
import { checkVoiceMembers } from "../../functions/checkVoice";
import { updateXP } from "../../modules/voiceLeveling";
import colors from "colors";

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, { ...options, once: true });
  }

  public async run(client: Client) {
    await checkVoiceMembers();
    setInterval(checkVoiceMembers, 100000);
    setInterval(updateXP, 100);
    connection.connect((err) => {
      if (err) {
        console.error(colors.red("Error al conectar a la base de datos:"), err);
        return;
      }
      this.container.logger.info(colors.bgMagenta("Conectado a la base de datos MySQL ✔️"));
    });

    const { tag, id } = client.user!;
    return this.container.logger.info(colors.bgCyan(`Bot iniciado como ${tag} (${id})`));
  }
}
