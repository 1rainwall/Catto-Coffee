import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";

export class ModOnly extends Precondition {
  private checkMemberPermissions(interaction: CommandInteraction) {
    return interaction.memberPermissions?.has('ModerateMembers');
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const hasPermissions = this.checkMemberPermissions(interaction);

    if (hasPermissions) {
      return this.ok();
    } else {
      return this.error({ message: "¡Solo los miembros con permisos de Moderar Miembros pueden usar este comando!" });
    }
  }
}