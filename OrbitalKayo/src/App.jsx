import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Text, FormLabel,FormControl,Box,Container, Center, Heading, Flex, Stack,Button, Input} from '@chakra-ui/react'
import { FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios'
import Chatbox from './Chatbox';
function App() {
  
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("")
  const [data, setData] = useState('')
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = async (e) => {
    setUploaded(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    
<>
<Heading marginTop={"10px"} backgroundColor={'black'}>KAYO - AI for the future - Know it All Yield Optimizer</Heading>
{uploaded && (
  <>
  <Chatbox />
  <Button size='lg' onClick={()=>setUploaded(false)}>New File?</Button>
  </>  
)}
{!uploaded && (
  

<Center width={'100vw'} height={'100vh'}>
  <Flex alignItems={'center'} >
    <Stack>
      <Heading my={"30px"} size='4xl'>Meet Kayo</Heading>

      <Container>
      <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      textAlign="center"
    >
      <FormControl>
        <FormLabel htmlFor="file-upload" cursor="pointer">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            
            borderWidth="2px"
            borderStyle="dashed"
            borderRadius="md"
            p={4}
            cursor="pointer"
            _hover={{ bg: '.200' }}
          >
            <FaCloudUploadAlt size="24px" />
            <Text ml={2}>Click to upload a file</Text>
          </Box>
        </FormLabel>
        <Input
          id="file-upload"
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </FormControl>
      
    </Box>
      </Container>
      <Button onClick={handleSubmit}>Upload</Button>
      </Stack>
    </Flex>
    </Center>
    )}
   </>
  )
}

export default App
