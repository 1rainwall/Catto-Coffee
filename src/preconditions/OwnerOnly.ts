import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import Config from "../../config";

export class OwnerOnlyPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }
  
  private async checkOwner(userId: string) {
    return Config.Owner!.includes(userId)
      ? this.ok()
      : this.error({ message: "¡Solo los dueños del bot pueden usar este comando!" });
  }
}
