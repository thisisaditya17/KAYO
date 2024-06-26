// src/components/Chatbox.js
import React, { useState } from 'react';
import { Box, Input, Button, VStack, HStack, Text, Avatar } from '@chakra-ui/react';
import axios from 'axios'

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'You' }]);
      setInput('');
      handleQuestion();
    }
  };

  const handleQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:5000/askQuestion', {
        stringData: input
      });
      const data = response.data
      console.log(data)
      handleResponse(data);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const handleResponse = (AItext) => {
    setMessages((prevMessages) => [...prevMessages, { text: AItext, sender: 'You' }]);
  }
  return (
      <>
        <Box
          w="100%"
          h="90%"
          overflowY="scroll"
          borderRadius="md"
          p={4}
          boxShadow="inner"
        >
          {messages.map((message, index) => (
            <HStack key={index} align="start" spacing={2}>
              <Avatar size="sm" name={message.sender} />
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  {message.sender}
                </Text>
                <Text fontSize="md">{message.text}</Text>
              </Box>
            </HStack>
          ))}
        </Box>
        <HStack w="100%" spacing={2}>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSend} color={'white'}>
            Send
          </Button>
        </HStack>
      </>
  );
};

export default Chatbox;
