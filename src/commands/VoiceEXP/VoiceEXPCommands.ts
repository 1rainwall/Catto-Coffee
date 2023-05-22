import { Subcommand } from "@sapphire/plugin-subcommands";
import connection from "../../database/db";
import Config from "../../../config";
import { ChatInputCommand } from "@sapphire/framework";
import { EmbedBuilder, Role, User } from "discord.js";
import util from "util";
import Canvacord from "canvacord";
const query = util.promisify(connection.query).bind(connection);

export class VoiceEXPCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "xp",
      description: "Comandos de experiencia",
      subcommands: [
        { name: "info", chatInputRun: "xpInfo" },
        {
          name: "voice",
          type: "group",
          entries: [
            { name: "rank", chatInputRun: "chatInputRank" },
            { name: "ladderboard", chatInputRun: "chatInputLadderboard" },
            { name: "rewards", chatInputRun: "chatInputRewards" },
          ],
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("xp")
        .setDescription("Informacion sobre la experiencia.") // Needed even though base command isn't displayed to end user
        .addSubcommand((command) =>
          command
            .setName("info")
            .setDescription(
              "Información sobre el sistema de experiencia del bot."
            )
        )
        .addSubcommandGroup((group) =>
          group
            .setName("voice")
            .setDescription("Experiencia en voice.") // Also needed even though the group isn't displayed to end user
            .addSubcommand((command) =>
              command
                .setName("rank")
                .setDescription(
                  "Verificar tu rango y nivel dentro del servidor en canales de voz."
                )
                .addUserOption((option) =>
                  option
                    .setName("user")
                    .setDescription("Usuario al que quieres ver su rango.")
                    .setRequired(false)
                )
            )
            .addSubcommand((command) =>
              command
                .setName("ladderboard")
                .setDescription(
                  "Verificar la lista de usuarios con más experiencia en el serivodr."
                )
            )
            .addSubcommand((command) =>
              command
                .setName("rewards")
                .setDescription(
                  "Ver las recompensas por nivel de este servidor."
                )
            )
        ),{
            idHints: [""]
        }
    );
  }

  public async xpInfo(interaction: Subcommand.ChatInputCommandInteraction) {
    const embed = new EmbedBuilder();
    embed.setTitle("Información sobre el sistema de experiencia.");
    embed.setDescription(
      "El sistema de experiencia es un sistema que te permite ganar experiencia en canales de voz y subir de nivel, actualmente solamente está disponible el sistema a través de canales de voz, pero pronto estará el de texto <:Catto_Cookie:1000808773885112431>. Cada nivel te da recompensas que puedes ver con el comando `/xp voice rewards`. Para ver tu nivel y experiencia actual, puedes usar el comando `/xp voice rank`. y para ver la lista de los usuarios con más experiencia en el servidor, puedes usar el comando `/xp voice ladderboard`."
    );
    embed.setColor(Config.colors.primary);

    return interaction.reply({ embeds: [embed] });
  }

  public async chatInputRank(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const User = interaction.options.getUser("user") || interaction.user;
    const GuildID = interaction.guild?.id;

    await interaction.deferReply().catch(() => {});

    const Results = (await query({
      sql: `SELECT * FROM usersxp WHERE userID = ? AND guildID = ?`,
      values: [User.id, GuildID],
    })) as string[];

    if (Results.length === 0) {
      return interaction.editReply({
        content: "No se ha encontrado experiencia registrada.",
      });
    }

    const CompleteList = (await query({
      sql: `SELECT userID, xp, nivel, xpTotal FROM usersxp WHERE guildID = ? ORDER BY xpTotal desc`,
      values: [GuildID],
    })) as { userID: string; xp: number; nivel: number; xpTotal: number }[];

    CompleteList.sort(
      (x: { xpTotal: number }, y: { xpTotal: number }) => y.xpTotal - x.xpTotal
    ).reverse();
    let Rango = 0;
    for (Rango = 1; Rango < CompleteList.length; Rango++) {
      if (CompleteList[Rango - 1].userID === User.id) break;
    }
    if (CompleteList[Rango - 1].userID !== User.id) {
      return interaction.editReply({
        content: "No se ha encontrado experiencia registrada.",
      });
    }

    let Experience = CompleteList[Rango - 1].xp;
    let Level = CompleteList[Rango - 1].nivel;

    const RankCard = new Canvacord.Rank()
      .setUsername(User.username)
      .setDiscriminator(User.discriminator)
      .setCustomStatusColor("#FFFFFF")
      .setAvatar(User.displayAvatarURL())
      .setLevel(Level)
      .setRank(Rango)
      .setCurrentXP(Experience)
      .setRequiredXP(Math.floor((1250 * 1.0335 ** Level - 650) / 20) * 20)
      .setProgressBar(`${Config.colors.primary}`, "COLOR");

    try {
      RankCard.build().then(async (buffer) => {
        return interaction.editReply({
          files: [{ attachment: buffer, name: "RankCard.png" }],
        });
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        content: "Ha ocurrido un error al generar la tarjeta.",
      });
    }
  }

  public async chatInputLadderboard(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    function convertNumber(num: number) {
      // Convertir a números.
      if (num > 999999) {
        return `${Math.round(num / 100000) / 10}M`;
      } else if (num > 999) {
        return `${Math.round(num / 100) / 10}K`;
      } else {
        return `${num}`;
      }
    }

    await interaction.deferReply().catch(() => {});

    const GuildID = interaction.guild?.id;
    const Results = (await query({
      sql: `SELECT * FROM usersxp WHERE guildID = ? ORDER BY xpTotal desc`,
      values: [GuildID],
    })) as { userID: string; xp: number; nivel: number; xpTotal: number }[];

    Results.sort(function (a, b) {
      if (a.xpTotal > b.xpTotal) return -1;
      if (a.xpTotal < b.xpTotal) return 1;
      return 0;
    });

    const List = Results.map((User, i) => {
      const TotalXP = convertNumber(User.xpTotal);
      const UserTag = `<@${User.userID}>`;
      return `**\`${i + 1}.\` ${UserTag}**\nNivel: **${
        User.nivel
      }** ➜  XP: **${TotalXP}\n**`;
    });

    const GuildName = interaction.guild?.name;
    const Embed = new EmbedBuilder()
      .setColor("#313338")
      .setDescription(
        List.length == 0
          ? "\nParece ser que nadie en este servidor tiene XP."
          : `${
              List.length < 10
                ? `**Top ${List.length} Usuarios con más XP**`
                : "**Top 10 Usuarios con más XP**"
            }` +
              "\n\n" +
              List.join("\n")
      )
      .setFooter({ text: `${GuildName}` })
      .setTimestamp();

    return interaction.editReply({ embeds: [Embed] });
  }

  public async chatInputRewards(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const GuildID = interaction.guild?.id;
    const GuildName = interaction.guild?.name;
    const Results = (await query({
      sql: `SELECT * FROM roles WHERE guildID = ?`,
      values: [GuildID],
    })) as { roleID: string; nivel: number; guildID: string }[];

    if (Results.length === 0)
      return interaction
        .reply({ content: "No hay roles registrados." })
        .catch(() => {});

    const Roles = Results.map((role, i) => {
      const RoleTag = `<@&${role.roleID}>`;
      return `**Nivel:** **${role.nivel}**\n**Rol:** **${RoleTag}**\n`;
    });

    const Embed = new EmbedBuilder()
      .setColor(Config.colors.primary)
      .setTitle(
        `Recompensas de \n${GuildName}\nEn VoiceChannels <:Catto_Cookie:1000808773885112431>`
      )
      .addFields({ name: "Roles:", value: Roles.join("\n"), inline: true });

    return interaction.reply({ embeds: [Embed] }).catch(() => {});
  }
}
