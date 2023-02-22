import Head from 'next/head'
import Link from 'next/link'
import nookies from 'nookies'
import { Button, Container, VStack, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = nookies.get(context)
  const userId = cookies['userId']

  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  } else {
    return {
      props: {
        userId: userId
      }
    }
  }
}

interface AccountProps {
  userId: string
}

export default function Account({ userId }: AccountProps) {
  return (
    <>
      <Head>
        <title>My Account - GobiBot</title>
      </Head>
      <Container mt="10rem" centerContent>
        <VStack spacing="2rem">
          <Text>Logged in as {userId}</Text>
          <Link href="/logout">
            <Button colorScheme="teal">Logout</Button>
          </Link>
        </VStack>
      </Container>
    </>
  )
}
