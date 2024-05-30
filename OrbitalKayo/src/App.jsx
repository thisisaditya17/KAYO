import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Container, Center, Heading, Flex, Stack,Button, Input} from '@chakra-ui/react'
import axios from 'axios'
function App() {
  
  const [count, setCount] = useState(0)
  const [file, setFile] = useState(null);
  const [data, setData] = useState('')
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data.processed_content);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
<>
<Center width={'100vw'} height={'100vh'}>
  <Flex alignItems={'center'} >
    <Stack>
    <Heading>KAYO - AI for the future</Heading>
    <Heading>Know it All Yield Optimizer</Heading>
      <Input type='text' placeholder="Enter Prompt here" size='lg'></Input>
      <Input onChange={handleFileChange} type='file' size='sm'></Input>
      <Button onClick={handleSubmit}>Upload</Button>
      <Heading>processed content: {data}</Heading>
    </Stack>
    </Flex>
    </Center>
   </>
  )
}

export default App
