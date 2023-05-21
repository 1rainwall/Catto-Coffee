import { Command } from "@sapphire/framework";
import { userMention } from "discord.js";

export class GreedCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("greet")
        .setDescription("Saluda a un usuario")
        .addUserOption((option) =>
          option
            .setName("usuario")
            .setDescription("El usuario al que quieres saludar")
            .setRequired(true)
        ),{
          idHints: ["1109636995111731311"]
        }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const usertogreed = interaction.options.getUser("usuario", true);
    const usertogreedMention = userMention(usertogreed.id);
    const InteractionUserMention = userMention(interaction.user.id);

    return interaction.reply({
      content: `Hola ${usertogreedMention}, te esta saludando ${InteractionUserMention}!`,
      allowedMentions: {
        users: [usertogreed.id, interaction.user.id],
      },
    });
  }
}
