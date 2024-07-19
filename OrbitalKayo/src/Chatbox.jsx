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
      const response = await axios.post('http://localhost:5001/askQuestion', {
        message: input
      });
      const data = response.data;
      handleResponse(data);
      console.log('Response received:', data);
    } catch (error) {
      toast({
        title: 'Error',
        description: "There was an error sending your message.",
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
    <Flex direction="column" h="100%" w="100%" p={4}>
      <Box
        flex="1"
        w="100%"
        h="80%"
        overflowY="scroll"
        borderRadius="md"
        p={4}
        boxShadow="inner"
        bg="gray.50"
      >
        <VStack spacing={4} align="start">
          {messages.map((message, index) => (
            <HStack key={index} align="start" spacing={2} w="100%">
              <Avatar size="sm" name={message.sender} />
              <Box bg={message.sender === 'You' ? 'teal.100' : 'gray.100'} p={3} borderRadius="md" w="full">
                <Text fontSize="sm" fontWeight="bold" color={message.sender === 'You' ? 'teal.800' : 'gray.800'}>
                  {message.sender}
                </Text>
                <Text fontSize="md" color={message.sender === 'You' ? 'teal.800' : 'gray.800'}>{message.text}</Text>
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
        />
        <Button onClick={handleSend} colorScheme="teal" rightIcon={<FaPaperPlane />}>
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default Chatbox;
