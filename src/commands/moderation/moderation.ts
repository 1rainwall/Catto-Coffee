import { Subcommand } from "@sapphire/plugin-subcommands";
import connection from "../../database/db";
import { ChatInputCommand } from "@sapphire/framework";
import util from "util";
const query = util.promisify(connection.query).bind(connection);

export class ModerationCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      preconditions: ['ModOnly'],
      requiredClientPermissions: ["BanMembers"],
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
        ),
        {
          idHints: ['']
        }
    );
  }

  public async chatInputBan(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const userToBan = interaction.options.getUser("usuario", true);
    const razon = interaction.options.getString("razon") || "No especificada";
    const userID = userToBan.id;

    await query({
      sql: "INSERT INTO Moderation (GuildID, UserID, ModeratorID, Reason, Type) VALUES (?, ?, ?, ?, 'Ban')",
      values:[interaction.guild?.id, userID, interaction.user.id, razon]});

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
    const userToBan = interaction.options.getUser("usuario", true);
    const razon = interaction.options.getString("razon") || "No especificada";
    const userID = userToBan.id;

    await query({
      sql: "INSERT INTO Moderation (GuildID, UserID, ModeratorID, Reason, Type) VALUES (?, ?, ?, ?, 'Unban')",
      values:[interaction.guild?.id, userID, interaction.user.id, razon]});

    await interaction.guild!.members.unban(userID);

    return interaction.reply({
      content: `<@${userID}> - \`${userToBan.tag}\` - \`${userID}\` ha sido desbaneado. <:accepted:1083594549575823430>`,
    });
  }
}
