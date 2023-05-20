import { Listener } from "@sapphire/framework";
import { VoiceState } from "discord.js";
import connection from "../../database/db";
import util from "util";

// Utilizar promisify para convertir la función de consulta en una promesa
const query = util.promisify(connection.query).bind(connection);

const addXpIntervals = new Map();

export class VoiceStateUpdateListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: false,
    });
  }

  public async run(newState: VoiceState) {
    const member = newState.member;

    if (!member || member.user.bot) return;

    try {
      const rows = (await query({
        sql: `SELECT * FROM usersxp WHERE userID = ?`,
        values: [member.id],
      })) as string;

      if (!rows || rows.length === 0) {
        // Si no hay filas en la consulta, insertar un nuevo registro
        await query({
          sql: `INSERT IGNORE INTO \`usersxp\` (userID, guildID) VALUES (?, ?)`,
          values: [member.id, member.guild.id],
        });
      }
    } catch (error) {
      console.error("Error ejecutando la consulta.", error);
    }

    if (!member.voice.channel) {
      clearInterval(addXpIntervals.get(member.id));
      addXpIntervals.delete(member.id);
    }
  }
}
