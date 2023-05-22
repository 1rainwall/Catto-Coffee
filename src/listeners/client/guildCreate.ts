import { Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { checkVoiceMembers } from "../../functions/checkVoice";

export class GuildCreateListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
    });
  }
  public async run(guild: Guild) {
    await checkVoiceMembers();
    this.container.logger.info(`El bot se ha unido a ${guild.name}(${guild.id})`);
  }
}