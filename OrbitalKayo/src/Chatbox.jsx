import React, { useState } from 'react';
import { Box, Input, Button, VStack, HStack, Text, Avatar, Flex, useToast } from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';


const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const toast = useToast();
  
  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'You' }]);
      handleQuestion();
      setInput('');
    }
  };

  const handleQuestion = async () => {
    try {
      const response = await axios.post('https://kayo-66bo.onrender.com/askQuestion', {
        message: input,
      });
      const data = response.data;
      handleResponse(data);
      console.log('Response received:', data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error sending your message.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error sending message:', error);
    }
  };

  const handleResponse = (AItext) => {
    setMessages((prevMessages) => [...prevMessages, { text: AItext, sender: 'KAYO' }]);
  };

  return (
    <>

    <Flex direction="column" h="65vh" w="100%" p={4} bg="gray.900">
      <Box
        flex="1"
        w="100%"
        h="80%"
        overflowY="scroll"
        borderRadius="md"
        p={4}
        boxShadow="inner"
        bg="gray.800"
      >
        <VStack spacing={4} align="start">
          {messages.map((message, index) => (
            <HStack key={index} align="start" spacing={2} w="100%">
              <Avatar size="sm" name={message.sender} />
              <Box bg={message.sender === 'You' ? 'orange.300' : 'gray.700'} p={3} borderRadius="md" w="full">
                <Text fontSize="sm" fontWeight="bold" color={message.sender === 'You' ? 'black' : 'orange.300'}>
                  {message.sender}
                </Text>
                <Text fontSize="md" color={message.sender === 'You' ? 'black' : 'orange.300'}>{message.text}</Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
      <HStack w="100%" spacing={2} mt={4}>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          bg="gray.700"
          color="orange.300"
        />
        <Button onClick={handleSend} colorScheme="orange" rightIcon={<FaPaperPlane />}>
          Send
        </Button>
      </HStack>
    </Flex>
    </>
  );
};

export default Chatbox;
