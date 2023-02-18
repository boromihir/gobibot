import { EmbedBuilder } from '@discordjs/builders'
import { ChatInputCommand, Command } from '@sapphire/framework'

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options })
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(builder =>
      builder.setName('ping').setDescription('Ping bot to see if it is alive')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true })

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(3_092_790)
          .setTitle('Pong')
          .setDescription(`Heartbeat: ${this.container.client.ws.ping} ms`)
      ]
    })
  }
}
