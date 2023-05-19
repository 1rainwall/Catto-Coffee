import client from "../index";
import { Connect } from "../database/db";

export async function updateXP() {
  try {
    const connection = await Connect();
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
          const GuildID = guild.id;
          const UserIDs = voiceChannelMembers.map((vs) => vs.member?.id);
          const results = await connection.query(
            `SELECT * FROM \`usersxp\` WHERE userID IN(${UserIDs.join(
              ","
            )}) AND guildID = '${GuildID}'`
          );
        }
      })
    );
  } catch {}
}
