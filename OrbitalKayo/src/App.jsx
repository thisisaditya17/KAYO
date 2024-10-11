import React, { useState } from 'react'
import {
  Text, FormLabel, FormControl, Box, Center, Heading, Flex, Stack, Button,
  Input, VStack, Select, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure, IconButton, Divider, Image, Progress,
  HStack, RadioGroup, Radio
} from '@chakra-ui/react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { AiOutlineUpload } from 'react-icons/ai'
import axios from 'axios'
import Chatbox from './Chatbox'
import emailjs from '@emailjs/browser'

const App = () => {
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [mode, setMode] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState('5') // Default rating value
  const [email, setEmail] = useState('')
  const [isLoading, setLoading] = useState(false)

  const feedbackSubmit = (event) => {
    event.preventDefault()

    const templateParams = {
      feedback: feedback,
      rating: rating,
      email: email,
    }

    emailjs.send(
      'service_biojftn',    // Replace with your EmailJS service ID
      'template_9bpo5wc',   // Replace with your EmailJS template ID
      templateParams,
      'OZAd35iWOpMHYUYx_'        // Replace with your EmailJS user ID
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text)
        toast({
          title: 'Feedback submitted successfully!',
          description: "Thank you for your feedback.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onClose() // Close the modal after submitting the form
      }, (err) => {
        console.log('FAILED...', err)
        toast({
          title: 'Failed to submit feedback.',
          description: "Please try again later.",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const handleModeChange = (e) => {
    setMode(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: 'No file selected.',
        description: 'Please select a file to upload.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (!mode) {
      toast({
        title: 'No mode selected.',
        description: 'Please select a mode before uploading.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', mode)
    setLoading(true)
    try {
      const response = await axios.post('https://kayo-backend.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast({
        title: 'File uploaded successfully.',
        description: response.data.message || 'Your file has been uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      console.log('File uploaded successfully:', response)
      setUploaded(true)
    } catch (error) {
      toast({
        title: 'Error uploading file.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box bg="gray.900" color="orange.400" py={6}>
        <Heading as="h1" textAlign="center" fontSize="4xl">
          KAYO - Know-It-All Yield Optimizer
        </Heading>
        <Center mt={4}>
          <Image src="/favicon.ico" alt="KAYO Logo" boxSize="150px" />
        </Center>
      </Box>
      {uploaded ? (
        <Box bg="gray.900" py={10} minH="78vh">
          <Chatbox />
          <Center mt={10}>
            <Button size="lg" colorScheme="orange" onClick={() => setUploaded(false)}>
              Upload New File
            </Button>
          </Center>
        </Box>
      ) : (
        <Center w="100vw" h="78vh" bg="gray.900" py={10}>
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
                <option style={{ backgroundColor: 'gray.800' }} value="general">General</option>
                <option style={{ backgroundColor: 'gray.800' }} value="school">School Work</option>
                <option style={{ backgroundColor: 'gray.800' }} value="legal">Legal Advice</option>
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
            {isLoading && 
              <Progress size="lg" colorScheme="orange" isIndeterminate width="100%" mt={4} />
            }
            <Button mt={4} colorScheme="orange" onClick={onOpen}>Give Feedback</Button>
          </Flex>
        </Center>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Feedback</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={feedbackSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel htmlFor="feedback">Feedback</FormLabel>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback"
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="rating">Rating</FormLabel>
                <RadioGroup id="rating" onChange={setRating} value={rating}>
                  <HStack spacing={4}>
                    <Radio value="1">1</Radio>
                    <Radio value="2">2</Radio>
                    <Radio value="3">3</Radio>
                    <Radio value="4">4</Radio>
                    <Radio value="5">5</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="email">Email (optional)</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="orange" mr={3} type="submit">
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default App
