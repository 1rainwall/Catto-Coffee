import { Subcommand } from "@sapphire/plugin-subcommands";
import { ChatInputCommand, Command } from "@sapphire/framework";
import util from "util";
import connection from "../../database/db";
const query = util.promisify(connection.query).bind(connection);

export class TempVoiceCommands extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "tempvoice",
      description: "Comandos de voz temporales",
      subcommands: [
        {
          name: "setup",
          chatInputRun: "chatInputSetup",
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
          name: "name",
          chatInputRun: "chatInputName",
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
      ],
    });
  }

  registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("voice")
        .setDescription("Comandos de voz temporales")
        .addSubcommand((command) =>
          command
            .setName("setup")
            .setDescription(
              "Configura el canal de voz y la categoria temporales"
            )
        )
        .addSubcommand((Command) =>
          Command.setName("claim").setDescription(
            "Reclama un canal de voz temporal libre."
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
            .setDescription("Limita el numero de usuarios en tu canal de voz.")
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
          Command.setName("name").setDescription(
            "Cambia el nombre de tu canal de voz."
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
            .setDescription("Rechaza a un usuario de unirse a tu canal de voz.")
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
          Command.setName("bitrate")
            .setDescription("Cambia el bitrate de tu canal de voz.")
            .addIntegerOption((option) =>
              option
                .setName("bitrate")
                .setDescription(
                  "El bitrate que quieres poner en tu canal de voz."
                )
            )
        )
        ,{
            idHints: ['1109636999004041279']
        }
    );
  }
}