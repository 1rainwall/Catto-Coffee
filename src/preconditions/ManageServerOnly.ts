import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";

export class ManageServerPrecondition extends Precondition {
  private checkMemberPermissions(interaction: CommandInteraction) {
    return interaction.memberPermissions?.has('ManageGuild');
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const hasPermissions = this.checkMemberPermissions(interaction);

    if (hasPermissions) {
      return this.ok();
    } else {
      return this.error({ message: "¡Solo los miembros con permisos el permiso de `Manage Server` pueden usar este comando!" });
    }
  }
}