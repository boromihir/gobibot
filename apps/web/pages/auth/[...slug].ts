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

      // If slug is of length 1 then initiate oauth flow
      // else if slug[1] === 'callback' perform oauth token retrieval
      // else return 404
      if (slug.length === 1) {
        // Generate state value
        const providerState = crypto.randomUUID()

        // // Set httpOnly cookie containing generated state value
        nookies.set(context, providerCookieKey, providerState, {
          httpOnly: true,
          maxAge: 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
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
      } else if (slug.length === 2 && slug[1] === 'callback') {
        const cookies = nookies.get(context)
        const cookieProviderState = cookies[providerCookieKey]

        // Compare state stored in cookie to state retrieved from callback URL
        // If they match, fetch tokens from oauth provider
        // If they don't match, return 404
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

          // @TODO: check database for existing accounts
          // if account exists read entry
          // if account does not exist, create entry
          // set cookie

          const account = await prisma.account.findFirst({
            where: {
              providerAccountId: providerUserData.id
            },
            select: {
              userId: true
            }
          })

          // If account exists get userId from account
          // else create account and get userId
          let userId = ''

          if (account && account.userId) {
            userId = account.userId
          } else {
            const newUser = await prisma.user.create({ data: {} })
            const newAccount = await prisma.account.create({
              data: {
                email: providerUserData.email,
                provider: provider.id,
                providerAccountId: providerUserData.id,
                accessToken: providerTokenData.access_token,
                refreshToken: providerTokenData.refresh_token,
                tokenType: providerTokenData.token_type,
                expiresAt: providerTokenData.expires_in,
                scope: providerTokenData.scope,
                user: { connect: { id: newUser.id } }
              }
            })

            userId = newAccount.userId
          }

          // Set httpOnly cookie containing userId
          nookies.set(context, 'userId', userId, {
            httpOnly: true,
            maxAge: 604800, // 1 week in seconds
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          })

          return {
            redirect: {
              destination: '/account',
              permanent: false
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
  return null
}
