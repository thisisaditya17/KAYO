import { useState } from 'react';
import { Text, FormLabel, FormControl, Box, Container, Center, Heading, Flex, Stack, Button, Input, VStack, Select, useToast, IconButton, Divider } from '@chakra-ui/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import axios from 'axios';
import Chatbox from './Chatbox';

const App = () => {
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState('');
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
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
    if (!mode) {
      toast({
        title: 'No mode selected.',
        description: 'Please select a mode before uploading.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploaded(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

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
      <Box bg="black" color="orange.400" py={6}>
        <Heading as="h1" textAlign="center" fontSize="4xl">
          KAYO - Know-It-All Yield Optimizer
        </Heading>
      </Box>
      {uploaded ? (
        <>
          <Chatbox />
          <Center mt={10}>
            <Button size="lg" colorScheme="orange" onClick={() => setUploaded(false)}>
              Upload New File
            </Button>
          </Center>
        </>
      ) : (
        <Center w="100vw" h="100vh" bg="gray.900">
          <Flex direction="column" alignItems="center" w="full" maxW="xl" p={6} bg="gray.800" boxShadow="2xl" borderRadius="lg">
            <Heading as="h2" size="xl" color="orange.400" textAlign="center" mb={6}>
              Meet Kayo
            </Heading>
            <Divider mb={6} borderColor="orange.400" />
            <FormControl>
              <FormLabel htmlFor="file-upload" cursor="pointer" textAlign="center" color="orange.400">
                <VStack spacing={4}>
                  <IconButton
                    icon={<AiOutlineUpload />}
                    size="lg"
                    colorScheme="orange"
                    aria-label="Upload File"
                    isRound
                  />
                  <Text fontSize="lg" color="orange.400">
                    {fileName ? `File: ${fileName}` : 'Click to upload a file'}
                  </Text>
                </VStack>
              </FormLabel>
              <Input id="file-upload" type="file" hidden onChange={handleFileChange} />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel color="orange.400">Select Mode</FormLabel>
              <Select placeholder="Select mode" onChange={handleModeChange} value={mode} bg="gray.700" color="orange.400">
                <option style={{ backgroundColor: 'gray.800' }} value="finance">Finance</option>
                <option style={{ backgroundColor: 'gray.800' }} value="school_work">School Work</option>
                <option style={{ backgroundColor: 'gray.800' }} value="legal">Legal</option>
                <option style={{ backgroundColor: 'gray.800' }} value="custom">Custom</option>
              </Select>
            </FormControl>
            <Button
              mt={6}
              colorScheme="orange"
              size="lg"
              onClick={handleSubmit}
              isDisabled={!file || !mode}
              leftIcon={<FaCloudUploadAlt />}
            >
              {fileName ? 'Upload Selected File' : 'Upload'}
            </Button>
          </Flex>
        </Center>
      )}
    </>
  );
};

export default App;
