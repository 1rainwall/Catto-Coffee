import { Subcommand } from "@sapphire/plugin-subcommands";
import { ChatInputCommand } from "@sapphire/framework";
import util from "util";
import { Time } from "@sapphire/time-utilities";
import { PermissionFlagsBits } from "discord.js";
import { setTimeout } from "timers/promises";
import connection from "../../database/db";
import Config from "../../../config";
const query = util.promisify(connection.query).bind(connection);

export class TempVoiceCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      cooldownDelay: Time.Second * 5,
      name: "tempvoice",
      description: "Comandos de voz temporales",
      subcommands: [
        {
          name: "setup",
          chatInputRun: "chatInputSetup",
        },
        {
          name: "name",
          chatInputRun: "chatInputChangeName",
        },
        {
          name: "claim",
          chatInputRun: "chatInputClaim",
        },
        {
          name: "ghost",
          chatInputRun: "chatInputGhost",
        },
        {
          name: "unghost",
          chatInputRun: "chatInputUnghost",
        },
        {
          name: "limit",
          chatInputRun: "chatInputLimit",
        },
        {
          name: "lock",
          chatInputRun: "chatInputLock",
        },
        {
          name: "unlock",
          chatInputRun: "chatInputUnlock",
        },
        {
          name: "permit",
          chatInputRun: "chatInputPermit",
        },
        {
          name: "reject",
          chatInputRun: "chatInputReject",
        },
        {
          name: "transfer",
          chatInputRun: "chatInputTransfer",
        },
        {
          name: "invite",
          chatInputRun: "chatInputInvite",
        },
        {
          name: "bitrate",
          chatInputRun: "chatInputBitrate",
        },
        {
          name: "reset",
          chatInputRun: "chatInputReset",
        },
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("voice")
          .setDescription("Comandos de voz temporales")
          .addSubcommand((Command) =>
            Command.setName("claim").setDescription(
              "Reclama un canal de voz temporal libre."
            )
          )
          .addSubcommand((Command) =>
            Command.setName("name")
              .setDescription("Cambia el nombre de tu canal de voz.")
              .addStringOption((option) =>
                option
                  .setName("nombre")
                  .setDescription(
                    "El nombre que quieres poner en tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("ghost").setDescription(
              "Oculta tu canal de voz temporal."
            )
          )
          .addSubcommand((Command) =>
            Command.setName("unghost").setDescription(
              "Habilita la visibilidad de tu canal de voz."
            )
          )
          .addSubcommand((Command) =>
            Command.setName("limit")
              .setDescription(
                "Limita el numero de usuarios en tu canal de voz."
              )
              .addIntegerOption((option) =>
                option
                  .setName("limite")
                  .setDescription("El limite de usuarios en tu canal de voz.")
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("lock").setDescription("Bloquea tu canal de voz.")
          )
          .addSubcommand((Command) =>
            Command.setName("unlock").setDescription(
              "Desbloquea tu canal de voz."
            )
          )
          .addSubcommand((Command) =>
            Command.setName("permit")
              .setDescription("Permite a un usuario unirse a tu canal de voz.")
              .addUserOption((option) =>
                option
                  .setName("usuario")
                  .setDescription(
                    "El usuario al que quieres permitir unirse a tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("reject")
              .setDescription(
                "Rechaza a un usuario de unirse a tu canal de voz."
              )
              .addUserOption((option) =>
                option
                  .setName("usuario")
                  .setDescription(
                    "El usuario al que quieres rechazar de unirse a tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("transfer")
              .setDescription(
                "Transfiere la propiedad de tu canal de voz a otro usuario."
              )
              .addUserOption((option) =>
                option
                  .setName("usuario")
                  .setDescription(
                    "El usuario al que quieres transferir la propiedad de tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("invite")
              .setDescription("Invita a un usuario a tu canal de voz.")
              .addUserOption((option) =>
                option
                  .setName("usuario")
                  .setDescription(
                    "El usuario al que quieres invitar a tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("setup").setDescription(
              "Configura el canal y la categoria para los TempVoices."
            )
          )
          .addSubcommand((Command) =>
            Command.setName("bitrate")
              .setDescription("Cambia el bitrate de tu canal de voz.")
              .addIntegerOption((option) =>
                option
                  .setName("bitrate")
                  .setDescription(
                    "El bitrate que quieres poner en tu canal de voz."
                  )
                  .setRequired(true)
              )
          )
          .addSubcommand((Command) =>
            Command.setName("reset").setDescription(
              "Resetea todos los permisos de tu canal de voz."
            )
          ),
      {
        idHints: ["1109636999004041279"],
      }
    );
  }

  public async chatInputClaim(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    if (Results.length > 1) {
      let ChannelOwner = Results[0].ChannelOwner;
      if (ChannelOwner === UserID) {
        return interaction.reply({
          content: `${Config.emojis.warn} Ya eres el dueño de este canal de voz.`,
          ephemeral: true,
        });
      }
      const MembersInVoiceChannel = VoiceChannel.members;
      if (MembersInVoiceChannel.has(ChannelOwner)) {
        return interaction.reply({
          content: `${Config.emojis.denied} El dueño de este canal aún está en el canal de voz.`,
          ephemeral: true,
        });
      }
    }

    await query({
      sql: `UPDATE TempVoices SET ChannelOwner = ? WHERE ChannelID = ?`,
      values: [UserID, VoiceChannel.id],
    });

    await interaction.reply({
      content: `${Config.emojis.accept} Has reclamado el canal de voz temporal.`,
    });
  }

  public async chatInputGhost(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(
      VoiceChannel.guild.roles.everyone.id
    );

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ...UserPermissions,
          ViewChannel: false,
        }
      );
    } else {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ViewChannel: false,
        }
      );
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha ocultado el canal de voz éxitosamente.`,
    });
  }

  public async chatInputUnghost(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(
      VoiceChannel.guild.roles.everyone.id
    );

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ...UserPermissions,
          ViewChannel: true,
        }
      );
    } else {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ViewChannel: true,
        }
      );
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha establecido la visibilidad del canal para todos.`,
    });
  }

  public async chatInputLimit(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const VoiceChannelLimit = interaction.options.getInteger("limite", true);
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    if (VoiceChannelLimit > 99) {
      return interaction.reply({
        content: `${Config.emojis.denied} El limite de usuarios no puede ser mayor a 99.`,
        ephemeral: true,
      });
    } else {
      await VoiceChannel.setUserLimit(VoiceChannelLimit);
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha establecido el limite de usuarios a \`${VoiceChannelLimit}\` éxitosamente.`,
    });
  }

  public async chatInputLock(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(
      VoiceChannel.guild.roles.everyone.id
    );

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ...UserPermissions,
          Connect: false,
        }
      );
    } else {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          Connect: false,
        }
      );
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha cerrado el canal para todos.`,
    });
  }

  public async chatInputUnlock(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(
      VoiceChannel.guild.roles.everyone.id
    );

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          ...UserPermissions,
          Connect: true,
        }
      );
    } else {
      await VoiceChannel.permissionOverwrites.edit(
        VoiceChannel.guild.roles.everyone.id,
        {
          Connect: true,
        }
      );
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha cerrado el canal para todos.`,
    });
  }

  public async chatInputPermit(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const TargetUser = interaction.options.getUser("usuario", true);
    const TargetUserID = TargetUser?.id;
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (TargetUserID === UserID) {
      return interaction.reply({
        content: `${Config.emojis.warn} No puedes habilitar el acceso al canal a ti mismo.`,
        ephemeral: true,
      });
    }

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(TargetUserID);

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
        ...UserPermissions,
        Connect: true,
      });
    } else {
      await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
        Connect: true,
      });
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha permitido el acceso a \`${TargetUser.tag}\`.`,
    });
  }

  public async chatInputReject(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const TargetUser = interaction.options.getUser("usuario", true);
    const TargetUserID = TargetUser?.id;
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (TargetUserID === UserID) {
      return interaction.reply({
        content: `${Config.emojis.warn} No puedes denegarte el acceso a ti mismo.`,
        ephemeral: true,
      });
    }

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(TargetUserID);

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
        ...UserPermissions,
        Connect: false,
      });
    } else {
      await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
        Connect: false,
      });
    }

    await interaction.reply({
      content: `${Config.emojis.accept} Se le ha denegado el acceso a \`${TargetUser.tag}\`.`,
    });
  }

  public async chatInputTransfer(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const TargetUser = interaction.options.getUser("usuario", true);
    const TargetUserID = TargetUser?.id;
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    await query({
      sql: `UPDATE TempVoices SET ChannelOwner = ? WHERE ChannelID = ?`,
      values: [TargetUserID, VoiceChannel.id],
    });

    await interaction.reply({
      content: `${Config.emojis.accept} Se ha transferido la propiedad del canal a \`<@${ChannelOwner}>\`.`,
    });
  }

  public async chatInputInvite(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const TargetUser = interaction.options.getUser("usuario", true);
    const TargetUserID = TargetUser?.id;
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    const ChannelPermissions = VoiceChannel.permissionOverwrites.cache;
    const UserPermissions = ChannelPermissions.get(TargetUserID);

    if (UserPermissions) {
      await VoiceChannel.permissionOverwrites.edit(TargetUserID, {
        ...UserPermissions,
        Connect: true,
      });
    }
    await TargetUser.send({
      content: `Has sido invitado al canal de voz \`${VoiceChannel.name}\`(${VoiceChannel.url}) en el servidor \`${interaction.guild?.name}\`.`,
    });
    await interaction
      .reply({
        content: `${Config.emojis.accept} Se le ha enviado la invitación a \`${TargetUser.tag}\` éxitosamente.`,
      })
      .catch(() => {});
  }

  public async chatInputBitrate(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    function ConvertBitrateToMillions(bitrate: number) {
      return bitrate * 1000;
    }
    const Bitrate = interaction.options.getInteger("bitrate", true);
    const BitrateEnMiles = ConvertBitrateToMillions(Bitrate);
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    if (Bitrate < 8 || Bitrate > 96) {
      return interaction.reply({
        content: `${Config.emojis.denied} El bitrate debe ser entre 8 y 96.`,
        ephemeral: true,
      });
    }

    await VoiceChannel.setBitrate(BitrateEnMiles);
    await interaction.reply({
      content: `${Config.emojis.accept} El bitrate del canal de voz se ha cambiado a \`${Bitrate}kbps\`.`,
    });
  }
  public async chatInputSetup(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    async function setupVoiceChannel() {
      if (!interaction.memberPermissions?.has("ManageGuild")) {
        return interaction.reply({
          content:
            "No tienes permisos para ejecutar este comando. Necesitas el permiso `Manage Server`.",
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: `Configurando el canal y la categoria para los canales de voz temporales...${Config.emojis.loading}`,
      });

      const Guild = interaction.guild!;
      const CategoryName = `Crea Tu Canal`;

      const Category = await Guild.channels.create({
        name: CategoryName,
        type: 4,
      });

      const ChannelName = `Únete para Crear`;
      const Channel = await Guild.channels.create({
        name: ChannelName,
        parent: Category.id,
        type: 2,
        permissionOverwrites: [
          {
            id: Guild.roles.everyone.id,
            allow: PermissionFlagsBits.Connect,
          },
        ],
      });

      await query({
        sql: `INSERT INTO TempVoiceChannelSetup (GuildID, DefaultTempVoicesCategory, DefaultTempVoiceChannelCreate) VALUES (? ,? , ?)`,
        values: [Guild.id, Category.id, Channel.id],
      });

      await setTimeout(3000);

      await interaction.editReply({
        content: `Se ha configurado el canal y la categoria para los canales de voz temporales correctamente. <#${Channel.id}>.:ok_hand:`,
      });
    }

    await setupVoiceChannel();
  }

  public async chatInputChangeName(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const NewChannelName = interaction.options.getString("nombre", true);
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    if (NewChannelName.length > 60) {
      return interaction.reply({
        content: `${Config.emojis.denied} El nombre del canal no puede ser mayor a 60 caracteres.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    async function ChangeChannelName() {
      await VoiceChannel?.setName(NewChannelName);

      await interaction
        .reply({
          content: `${Config.emojis.accept} El nombre del canal de voz se ha cambiado a \`${NewChannelName}\`.`,
        })
        .catch(() => {
          return interaction.reply({
            content: `${Config.emojis.denied} No se pudo cambiar el nombre del canal de voz. Recuerda que el nombre debe respetar las [Directivas de la Comunidad](https://discord.com/guidelines) y los [Términos de Servicio](https://discord.com/terms). `,
            ephemeral: true,
          });
        });
    }
    await ChangeChannelName();
  }

  public async chatInputReset(
    interaction: Subcommand.ChatInputCommandInteraction
  ) {
    const UserID = interaction.user.id;
    const Member = interaction.guild?.members.cache.get(UserID);
    const VoiceChannel = Member?.voice.channel;

    if (!VoiceChannel) {
      return interaction.reply({
        content: `${Config.emojis.denied} Necesitas estar en un canal de voz para usar este comando.`,
        ephemeral: true,
      });
    }

    const Results = (await query({
      sql: `SELECT ChannelOwner, ChannelID FROM TempVoices WHERE ChannelID = ?`,
      values: [VoiceChannel.id],
    })) as { ChannelOwner: string; ChannelID: string }[];

    if (Results.length < 1) {
      return interaction.reply({
        content: `${Config.emojis.denied} Este canal de voz no es un canal de voz temporal.`,
        ephemeral: true,
      });
    }

    const ChannelOwner = Results[0].ChannelOwner;
    if (UserID !== ChannelOwner) {
      return interaction.reply({
        content: `${Config.emojis.denied} No eres el dueño de este canal de voz. el dueño es <@${ChannelOwner}>.`,
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `${Config.emojis.loading} Restableciendo todos los permisos del canal de voz...`,
    });

    await VoiceChannel.permissionOverwrites.set([
      {
        id: VoiceChannel.guild.roles.everyone.id,
        allow: PermissionFlagsBits.Connect,
      },
    ]);

    await setTimeout(3000);

    await interaction.editReply({
      content: `${Config.emojis.accept} Se han restablecido todos los permisos del canal de voz.`,
    });
  }
}
