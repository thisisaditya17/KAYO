import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from "./App";
import Chatbox from './Chatbox';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
const mock = new axiosMockAdapter(axios);
describe('ChatBox Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders Chatbox component', () => {
    render(<Chatbox />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  test('sends a message', async () => {
    render(<Chatbox />);
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(await screen.findByText('Hello')).toBeInTheDocument();
  });

  test('receives a response from the server', async () => {
    mock.onPost('http://localhost:5001/askQuestion').reply(200, 'Hi there!');

    render(<Chatbox />);
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => expect(screen.getByText('Hi there!')).toBeInTheDocument());
  });
});
