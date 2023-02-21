const providers = [
  {
    id: 'discord',
    name: 'Discord',
    authorization: 'https://discord.com/api/oauth2/authorize',
    token: 'https://discord.com/api/oauth2/token',
    userinfo: 'https://discord.com/api/users/@me',
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    redirectURI: process.env.DISCORD_REDIRECT_URI as string,
    scope: ['identify', 'email'].join(' ')
  },
  {
    id: 'spotify',
    name: 'Spotify',
    authorization: 'https://accounts.spotify.com/authorize',
    token: 'https://accounts.spotify.com/api/token',
    userinfo: 'https://api.spotify.com/v1/me',
    clientId: process.env.SPOTIFY_CLIENT_ID as string,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    redirectURI: process.env.SPOTIFY_REDIRECT_URI as string,
    scope: ['user-read-email'].join(' ')
  }
]

export default providers
