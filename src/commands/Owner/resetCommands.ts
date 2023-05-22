import { ChatInputCommand, Command } from "@sapphire/framework";
import Config from "../../../config";

export class ResetCommandsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Resets the commands.",
      detailedDescription: "Resets the commands.",
      preconditions: ["OwnerOnly"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder.setName("reset").setDescription("Elimina los comandos del bot."),
      {
        idHints: [""],
      }
    );
  }

  public override async chatInputRun(
    interaction: ChatInputCommand.Interaction
  ) {
    await interaction.deferReply();
    await interaction.client.application?.commands.set([]);
    return interaction.editReply(`${Config.emojis.accept} \`|\` Comandos eliminados con éxito. A la espera de reinicio... ${Config.emojis.loading}`);
  }
}
