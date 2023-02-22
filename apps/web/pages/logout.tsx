import Head from 'next/head'
import nookies from 'nookies'
import { Container, Text, VStack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async context => {
  nookies.destroy(context, 'userId', { path: '/' })

  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
}

export default function Logout() {
  return (
    <>
      <Head>
        <title>Logout - GobiBot</title>
      </Head>
      <Container mt="10rem" centerContent>
        <VStack spacing="2rem">
          <Text>You have been logged out. Redirecting...</Text>
        </VStack>
      </Container>
    </>
  )
}
