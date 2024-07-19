import { useState } from 'react';
import { Text, FormLabel, FormControl, Box, Container, Center, Heading, Flex, Stack, Button, Input, HStack, Icon, VStack, useToast } from '@chakra-ui/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';
import Chatbox from './Chatbox';

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected.',
        description: 'Please select a file to upload.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploaded(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'File uploaded successfully.',
        description: response.data.message || 'Your file has been uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log('File uploaded successfully:', response);
    } catch (error) {
      toast({
        title: 'Error uploading file.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <Heading marginTop="10px" backgroundColor="black" textAlign="center" color="white" padding="20px">
        KAYO - Know it All Yield Optimizer
      </Heading>
      {uploaded ? (
        <>
          <Chatbox />
          <Center marginTop="20px">
            <Button size="lg" onClick={() => setUploaded(false)}>
              Upload New File
            </Button>
          </Center>
        </>
      ) : (
        <Center width="100vw" height="100vh" backgroundColor="gray.100">
          <Flex alignItems="center">
            <Stack spacing={8} padding={8} backgroundColor="white" boxShadow="lg" borderRadius="md">
              <Heading size="2xl" textAlign="center" color="teal.500">
                Meet Kayo
              </Heading>
              <Container centerContent>
                <Box borderWidth="2px" borderRadius="lg" overflow="hidden" padding={4} textAlign="center" borderColor="gray.200">
                  <FormControl>
                    <FormLabel htmlFor="file-upload" cursor="pointer">
                      <VStack spacing={4}>
                        <Icon as={FaCloudUploadAlt} w={12} h={12} color="gray.500" />
                        <Text fontSize="lg" color="gray.500">
                          {fileName ? `File: ${fileName}` : 'Click to upload a file'}
                        </Text>
                      </VStack>
                    </FormLabel>
                    <Input id="file-upload" type="file" hidden onChange={handleFileChange} />
                  </FormControl>
                </Box>
              </Container>
              <Button colorScheme="teal" size="lg" onClick={handleSubmit} isDisabled={!file}>
                {fileName ? 'Upload Selected File' : 'Upload'}
              </Button>
            </Stack>
          </Flex>
        </Center>
      )}
    </>
  );
}

export default App;
