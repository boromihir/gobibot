import { EmbedBuilder } from '@discordjs/builders'
import { ChatInputCommand, Command } from '@sapphire/framework'

export class RegisterCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options })
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName('register')
        .setDescription('Register and connect your accounts')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true })

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(3_092_790)
          .setAuthor({ name: 'Register ' })
          .setTitle('Click here to register your account')
          .setDescription('Registration is global across all Discord servers')
          .setURL(`${process.env.WEB_BASE_URL}/login`)
      ]
    })
  }
}
