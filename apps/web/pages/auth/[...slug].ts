import { GetServerSideProps } from 'next'
import crypto from 'crypto'
import nookies from 'nookies'

interface ProviderConfig {
  readonly id: string
  readonly name: string
  readonly authorization: string
  readonly token: string
  readonly userinfo: string
  readonly clientId: string
  readonly clientSecret: string
  readonly redirectURI: string
  readonly scope: string
}

const providers: ProviderConfig[] = [
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

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug, code, state } = context.query

  if (slug) {
    const provider = providers.find(obj => obj.id === slug[0])
    const providerCookieKey = `${provider?.id}State`

    if (provider) {
      if (slug[1] === 'callback') {
        const cookies = nookies.get(context)
        const cookieProviderState = cookies[providerCookieKey]

        if (cookieProviderState === state) {
          const tokenResponse = await fetch(provider.token, {
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              client_id: provider.clientId,
              client_secret: provider.clientSecret,
              grant_type: 'authorization_code',
              code: code as string,
              redirect_uri: provider.redirectURI
            })
          })

          const tokenData = await tokenResponse.json()

          const tokenType = tokenData.token_type
          const accessToken = tokenData.access_token

          const userInfoResponse = await fetch(provider.userinfo, {
            headers: {
              Authorization: `${tokenType} ${accessToken}`
            }
          })

          const userData = await userInfoResponse.json()

          console.log('tokenData', tokenData)
          console.log('userData', userData)

          return {
            props: {}
          }
        } else {
          return {
            notFound: true
          }
        }
      } else {
        const providerState = crypto.randomUUID()

        nookies.set(context, providerCookieKey, providerState, {
          httpOnly: true,
          maxAge: 60,
          secure: process.env.NODE_ENV === 'production'
        })

        const destinationURL = new URL(provider.authorization)
        destinationURL.searchParams.set('response_type', 'code')
        destinationURL.searchParams.set('state', providerState)
        destinationURL.searchParams.set(
          'client_id',
          provider?.clientId as string
        )
        destinationURL.searchParams.set('scope', provider.scope)
        destinationURL.searchParams.set(
          'redirect_uri',
          provider?.redirectURI as string
        )

        return {
          redirect: {
            permanent: false,
            destination: destinationURL.href
          }
        }
      }
    } else {
      return {
        notFound: true
      }
    }
  }

  return {
    props: {}
  }
}

export default function AuthHandler() {
  return `AuthHandler`
}
