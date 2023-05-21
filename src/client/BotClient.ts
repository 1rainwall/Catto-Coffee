import "dotenv/config";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { ActivityType } from "discord.js";

export class BotClient extends SapphireClient {
  public constructor() {
    super({
      intents: [
        "GuildMembers",
        "GuildMessages",
        "Guilds",
        "GuildVoiceStates",
        "GuildBans",
        "GuildEmojisAndStickers",
        "GuildInvites",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "GuildWebhooks",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping",
        "GuildModeration",
        "GuildPresences",
        "GuildIntegrations",
      ],
      logger: {
        level: LogLevel.Debug,
      },
      loadMessageCommandListeners: true,
      presence: {
        status: "dnd",
        activities: [
          {
            name: "Under Development",
            type: ActivityType.Listening,
          },
        ],
      },
    });
  }

  public override login(token?: string) {
    return super.login(token ?? process.env.TOKEN);
  }
}
