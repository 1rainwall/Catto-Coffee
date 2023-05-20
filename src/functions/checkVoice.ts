import client from "../index";
import connection from "../database/db";
import util from "util";
const query = util.promisify(connection.query).bind(connection);

export async function checkVoiceMembers() {
  try {
    client.guilds.cache.forEach(async (guild) => {
      const guildUsersIDs: string[] = [];
      const voiceChannelMembers = guild.voiceStates.cache.filter(
        (vs) => vs.channel && !vs.member?.user.bot
      );
      voiceChannelMembers.forEach((vs) => {
        if (vs.member?.id) {
          guildUsersIDs.push(vs.member.id);
        }
      });
      if (guildUsersIDs.length === 0) {
        return;
      }
      // Obtener los usuarios que ya están en la base de datos
      const guildId = guild.id;
      const existingRows = await query({
        sql: `SELECT userID FROM \`usersxp\` WHERE userID IN (${guildUsersIDs
          .map((id) => `'${id}'`)
          .join(",")}) AND guildID = ?`,
        values: [guildId],
      });
      const existingUserIDs: string[] = (existingRows as { userID: string }[]).map(
        (row) => row.userID
      );
      const newUserIDs = guildUsersIDs.filter(
        (id) => !existingUserIDs.includes(id)
      );
      // Insertar los usuarios que no están en la base de datos
      await Promise.all(
        newUserIDs.map(async (userID) => {
          await query({
            sql: `INSERT IGNORE INTO \`usersxp\` (userID, guildID) VALUES (?, ?)`,
            values: [userID, guildId],
          });
          await query({
            sql: `INSERT IGNORE INTO \`userconfigs\` (userID) VALUES (?)`,
            values: [userID],
          });
        })
      );
    });
  } catch (err) {
    console.error(
      `Error al obtener los miembros de los canales de voz: ${err}`
    );
  }
}