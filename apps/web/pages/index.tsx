import Head from 'next/head'
import { Container, Heading, HStack } from '@chakra-ui/react'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>GobiBot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cabbage.ico" />
      </Head>
      <Container mt="8rem" centerContent>
        <HStack>
          <Image
            src="/cabbage.png"
            alt="GobiBot"
            width={48}
            height={48}
            priority
          />
          <Heading size="2xl">GobiBot</Heading>
        </HStack>
      </Container>
    </>
  )
}
