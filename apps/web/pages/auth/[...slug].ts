import crypto from 'crypto'
import nookies from 'nookies'
import { GetServerSideProps } from 'next'

import prisma from '@config/prisma'
import providers from '@config/constants/providers'

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug, code, state } = context.query

  // Check if slug is present else return 404
  if (slug) {
    // Retrieve provider config data from slug
    const provider = providers.find(obj => obj.id === slug[0])

    if (provider) {
      // Construct provider cookieKey from provider id
      const providerCookieKey = `${provider.id}State`

      // If URL is callback then perform oauth token retrieval
      // else initiate oauth flow
      if (slug[1] === 'callback') {
        const cookies = nookies.get(context)
        const cookieProviderState = cookies[providerCookieKey]

        // Compare state stored in cookie to state retrieved from callback URL
        // If they match, fetch tokens from oauth provider
        // If they don't match, it means state is not pure and return 404
        // @TODO: return better error screen here to show invalid access was initiated
        if (cookieProviderState === state) {
          // Fetch tokens from provider
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

          const providerTokenData = await tokenResponse.json()

          const tokenType = providerTokenData.token_type
          const accessToken = providerTokenData.access_token

          // Fetch user data using access token received in previous step
          const userInfoResponse = await fetch(provider.userinfo, {
            headers: {
              Authorization: `${tokenType} ${accessToken}`
            }
          })

          const providerUserData = await userInfoResponse.json()

          console.log('tokenData', providerTokenData)
          console.log('userData', providerUserData)

          // @TODO: Persist userId in cookies to make it easier to connect accounts from different providers
          const user = await prisma.user.create({ data: {} })

          nookies.set(context, 'gobibotUserId', user.id)

          // Persist token data and user data to database
          await prisma.account.create({
            data: {
              email: providerUserData.email,
              provider: provider.id,
              providerAccountId: providerUserData.id,
              user: {
                connect: {
                  id: user.id
                }
              },
              accessToken: providerTokenData.access_token,
              refreshToken: providerTokenData.refresh_token,
              tokenType: providerTokenData.token_type,
              expiresAt: providerTokenData.expires_in,
              scope: providerTokenData.scope
            }
          })

          return {
            props: {}
          }
        } else {
          return {
            notFound: true
          }
        }
      } else {
        // Generate state value
        const providerState = crypto.randomUUID()

        // Store state in httpOnly cookie
        nookies.set(context, providerCookieKey, providerState, {
          httpOnly: true,
          maxAge: 60,
          secure: process.env.NODE_ENV === 'production'
        })

        // Construct OAuth URL
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

        // Initial OAauth flow
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
  } else {
    return {
      notFound: true
    }
  }
}

export default function AuthHandler() {
  if (typeof window !== 'undefined') {
    if (window.opener && window.opener !== window && !window.menubar.visible) {
      window.close()
    }
  }

  return null
}
