import { Command } from "@sapphire/framework";
import { Connect } from "../../database/db";

export class BanCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Banea a un usuario",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ban")
        .setDescription("Banea a un usuario")
        .addUserOption((option) =>
          option
            .setName("usuario")
            .setDescription("El usuario al que quieres banear")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("razon").setDescription("La razon del baneo")
        )
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
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

    interaction.guild!.members.ban(userID, {
      reason: `${razon}` || "No se ha especificado una razon",
    });

    return interaction.reply({
      content: `<@${userID}> - \`${userToBan.tag}\` - \`${userID}\` ha sido baneado. <:accepted:1083594549575823430>`,
    });
  }
}
