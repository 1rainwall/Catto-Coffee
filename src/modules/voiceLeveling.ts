import client from "../index";
import connection from "../database/db";
import util from "util";
import { VoiceState } from "discord.js";

const query = util.promisify(connection.query).bind(connection);

interface XPRow {
  userID: string;
  xp: number;
  xpTotal: number;
  nivel: number;
  id: number;
  // Otras propiedades si existen
}

export async function updateXP() {
  try {
    const guildsWithMembers = await Promise.all(
      client.guilds.cache.map(async (guild) => {
        const voiceChannelMembers = guild.voiceStates.cache.filter(
          (vs) =>
            vs.channel &&
            !vs.member?.user.bot &&
            !vs.member?.voice.selfMute &&
            !vs.member?.voice.selfDeaf &&
            !vs.member?.voice.serverDeaf &&
            !vs.member?.voice.serverMute
        );

        if (voiceChannelMembers.size) {
          const guildId = guild.id;
          const userIds = voiceChannelMembers.map((vs) => vs.member?.id);
          const xpRows: XPRow[] = (await query({
            sql: `SELECT * FROM \`usersxp\` WHERE userID IN (${userIds
              .map((id) => `'${id}'`)
              .join(", ")}) AND guildID = '${guildId}'`,
          })) as XPRow[];
          if (xpRows.length === 0) return;
          const xpMap = new Map(xpRows.map((row) => [row.userID, row]));
          const newUserIDs = userIds.filter((id) => !xpMap.has(id!));
          const usersWithNewLevel: VoiceState[] = [];
          voiceChannelMembers.forEach((voiceState) => {
            const member = voiceState.member;
            if (!member) return;
            const xpRow = xpMap.get(member.id);
            const randInt = Math.floor(Math.random() * 6) + 2;
            if (xpRow) {
              xpRow.xp += randInt;
              xpRow.xpTotal += randInt;
              let xpHastaNivel = Math.floor(1250 * 1.0335 ** xpRow.nivel - 650);
              while (xpRow.xp >= xpHastaNivel) {
                xpRow.xp -= xpHastaNivel;
                xpRow.nivel++;
                xpHastaNivel = Math.floor(1250 * 1.0335 ** xpRow.nivel - 650);
                usersWithNewLevel.push(voiceState);
              }
            }
          });
          if (newUserIDs.length) {
            await Promise.all(
              newUserIDs.map(async (userID) => {
                if (userID) {
                  const xpRow: XPRow = {
                    userID,
                    xp: 0,
                    xpTotal: 0,
                    nivel: 0,
                    id: 0,
                  };
                  xpMap.set(userID, xpRow);
                }
              })
            );
          }
          if (usersWithNewLevel.length) {
            await Promise.all(
              usersWithNewLevel.map(async (member) => {
                const xpRow = xpMap.get(member.id);
                if (xpRow) {
                  // Lógica adicional para los usuarios que subieron de nivel
                }
              })
            );
          }
          const sqlValues = userIds
            .map((userID) => {
              const xpRow = xpMap.get(userID!);
              if (userID && xpRow) {
                return `('${guildId}', '${userID}', ${xpRow.xp || 0}, ${
                  xpRow.xpTotal || 0
                }, ${xpRow.nivel || 0})`;
              } else {
                return null;
              }
            })
            .filter((value) => value !== null)
            .join(", ");

          await query({
            sql: `INSERT INTO usersxp (guildID, userID, xp, xpTotal, nivel) VALUES ${sqlValues} ON DUPLICATE KEY UPDATE xp=VALUES(xp), xpTotal=VALUES(xpTotal), nivel=VALUES(nivel)`,
          });
        }
      })
    );

    const sqlQueries = guildsWithMembers.filter(Boolean); // Eliminar los valores falsos
    if (sqlQueries.length) {
      await query({
        sql: sqlQueries.join("; "),
      });
    }
  } catch (error) {
    console.error(error);
  }
}