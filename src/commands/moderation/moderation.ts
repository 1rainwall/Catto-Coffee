import { Subcommand } from "@sapphire/plugin-subcommands";
import { Connect } from "../../database/db";
import Config from "../../../config";
import { ChatInputCommand } from "@sapphire/framework";

export class ModerationCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "mod",
      description: "Comandos de moderacion",
      subcommands: [
        {
          name: "ban",
          chatInputRun: "chatInputBan",
        },
        {
          name: "unban",
          chatInputRun: "chatInputUnban",
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("mod")
        .setDescription("Comandos de moderacion")
        .addSubcommand((command) =>
          command
            .setName("ban")
            .setDescription("Banea a un usuario")
            .addUserOption((option) =>
              option
                .setName("usuario")
                .setDescription("El usuario al que quieres banear")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("unban")
            .setDescription("Desbanea a un usuario")
            .addUserOption((option) =>
              option
                .setName("usuario")
                .setDescription("El usuario al que quieres desbanear")
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputBan(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const connection = await Connect();
    const userToBan = interaction.options.getUser("usuario", true);
    const razon = interaction.options.getString("razon") || "No especificada";
    const userID = userToBan.id;

    connection.query("INSERT INTO Moderation SET ?", {
      GuildID: interaction.guild?.id,
      UserID: userID,
      ModeratorID: interaction.user.id,
      Reason: razon,
      Type: "ban",
    });

    await interaction.guild!.members.ban(userID, {
      reason: `${razon}` || "No se ha especificado una razon.",
    });

    return interaction.reply({
      content: `<@${userID}> - \`${userToBan.tag}\` - \`${userID}\` ha sido baneado. <:accepted:1083594549575823430>`,
    });
  }

  public async chatInputUnban(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const connection = await Connect();
    const userToBan = interaction.options.getUser("usuario", true);
    const razon = interaction.options.getString("razon") || "No especificada";
    const userID = userToBan.id;

    connection.query("INSERT INTO Moderation SET ?", {
      GuildID: interaction.guild?.id,
      UserID: userID,
      ModeratorID: interaction.user.id,
      Reason: razon,
      Type: "Unban",
    });

    await interaction.guild!.members.unban(userID);

    return interaction.reply({
      content: `<@${userID}> - \`${userToBan.tag}\` - \`${userID}\` ha sido desbaneado. <:accepted:1083594549575823430>`,
    });
  }
}
