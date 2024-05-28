import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Container, Center, Heading, Flex, Stack, Input} from '@chakra-ui/react'

function App() {
  const [count, setCount] = useState(0)

  return (
<>
<Center width={'100vw'} height={'100vh'}>
  <Flex alignItems={'center'} >
    <Stack>
    <Heading>KAYO - AI for the future</Heading>
    <Heading>Know it All Yield Optimizer</Heading>
      <Input type='text' placeholder="Enter Prompt here" size='lg'></Input>
      <Input type='file' size='sm'></Input>
    </Stack>
    </Flex>
    </Center>
   </>
  )
}

export default App
