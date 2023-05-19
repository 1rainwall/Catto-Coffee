import { ChatInputCommand, Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("ping").setDescription("Pong!")
    );
  }

  public override chatInputRun(interaction: ChatInputCommand.Interaction) {
    return interaction.reply(`Pong! \n${this.container.client.ws.ping}ms`);
  }
}
