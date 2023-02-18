import { Button, Container, Heading, VStack } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa'

export default function Login() {
  const onClick = () => {
    const w = 600
    const h = 800
    const y = window.outerHeight / 2 - w / 2
    const x = window.outerWidth / 2 - h / 2
    const windowFeatures = `popup,width=${w},height=${h},top=${y},left=${x}`
    window.open('http://localhost:3000/auth/discord', '_blank', windowFeatures)
  }

  return (
    <Container mt="10rem" centerContent>
      <VStack spacing="2rem">
        <Heading size="lg">Login to GobiBot</Heading>
        <Button
          leftIcon={<FaDiscord />}
          onClick={onClick}
          colorScheme="discord"
        >
          Continue with Discord
        </Button>
      </VStack>
    </Container>
  )
}
