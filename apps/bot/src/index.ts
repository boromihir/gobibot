import {
  ApplicationCommandRegistries,
  RegisterBehavior,
  SapphireClient
} from '@sapphire/framework'
import { GatewayIntentBits } from 'discord.js'

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite
)

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  defaultCooldown: {
    delay: 10_000
  }
})

client.login(process.env.DISCORD_TOKEN)
