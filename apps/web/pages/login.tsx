import Head from 'next/head'
import Link from 'next/link'
import nookies from 'nookies'
import { Button, Container, Heading, VStack } from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = nookies.get(context)
  const userId = cookies['userId']

  if (userId) {
    return {
      redirect: {
        destination: '/account',
        permanent: false
      }
    }
  } else {
    return {
      props: {}
    }
  }
}

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - GobiBot</title>
      </Head>
      <Container mt="10rem" centerContent>
        <VStack spacing="2rem">
          <Heading size="lg">Login to GobiBot</Heading>
          <Link href="/auth/discord">
            <Button
              leftIcon={<SiDiscord />}
              backgroundColor="#5865F2"
              _hover={{ bg: '#4752C4' }}
              color="#FFFFFF"
            >
              Continue with Discord
            </Button>
          </Link>
        </VStack>
      </Container>
    </>
  )
}
