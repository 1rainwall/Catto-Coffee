import { ChatInputCommand, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["SendMessages"],
      cooldownDelay: Time.Second * 10,
      cooldownLimit: 1,
      // preconditions: ['ModOnly']
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("ping").setDescription("Pong!"),{
        idHints: ["1109636996554575932"]
      }
    );
  }

  public override chatInputRun(interaction: ChatInputCommand.Interaction) {
    return interaction.reply(`Pong! \n${this.container.client.ws.ping}ms`);
  }
}
