import { Command } from '@sapphire/framework'
import { ApplicationCommandType } from 'discord.js'

export class SpotifyCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options })
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerContextMenuCommand(builder =>
      builder.setName('Add to Spotify').setType(ApplicationCommandType.Message)
    )
  }

  public async contextMenuRun(
    interaction: Command.ContextMenuCommandInteraction
  ) {
    return interaction.reply('Add to Spotify')
  }
}
