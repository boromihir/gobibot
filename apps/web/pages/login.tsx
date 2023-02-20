import { Button, Container, Heading, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import { SiDiscord } from 'react-icons/si'

export default function Login() {
  const onClick = () => {
    const w = 800
    const h = 800
    const y = (window.outerHeight - h) / 2
    const x = (window.outerWidth - w) / 2
    const windowFeatures = `popup,width=${w},height=${h},top=${y},left=${x}`
    window.open('/auth/discord', '_blank', windowFeatures)
  }

  return (
    <>
      <Head>
        <title>Login - GobiBot</title>
      </Head>
      <Container mt="10rem" centerContent>
        <VStack spacing="2rem">
          <Heading size="lg">Login to GobiBot</Heading>
          <Button
            leftIcon={<SiDiscord />}
            onClick={onClick}
            backgroundColor="#5865F2"
            _hover={{ bg: '#4752C4' }}
            color="#FFFFFF"
          >
            Continue with Discord
          </Button>
        </VStack>
      </Container>
    </>
  )
}
