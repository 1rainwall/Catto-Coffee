import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import Config from "../../config";

export class OwnerOnlyPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    // for Slash Commands
    return this.checkOwner(interaction.user.id);
  }
  
  private async checkOwner(userId: string) {
    return Config.Owner!.includes(userId)
      ? this.ok()
      : this.error({ message: "Solo el owner puede usar este comando!" });
  }
}

declare module '@sapphire/framework' {
    interface Preconditions {
      OwnerOnly: never;
    }
  }
  
  export default undefined;