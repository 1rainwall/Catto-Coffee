import { Events, Listener, type ChatInputCommandDeniedPayload, type UserError } from '@sapphire/framework';

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
  public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    // ...
    return interaction.reply({ content: error.message, ephemeral: true });
  }
}