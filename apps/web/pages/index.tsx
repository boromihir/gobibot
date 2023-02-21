import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Container, Heading, HStack, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Head>
        <title>GobiBot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cabbage.ico" />
      </Head>
      <Container mt="8rem" centerContent>
        <VStack spacing="5rem">
          <HStack>
            <Image
              src="/cabbage.png"
              alt="cabbage"
              width={48}
              height={48}
              priority
            />
            <Heading size="2xl">GobiBot</Heading>
          </HStack>
          <Link href="/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        </VStack>
      </Container>
    </>
  )
}
