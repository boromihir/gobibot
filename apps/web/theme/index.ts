import { extendTheme } from '@chakra-ui/react'

import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily
  }
})

export default theme
