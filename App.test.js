import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from "./App";
import Chatbox from './Chatbox';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
const mock = new axiosMockAdapter(axios);
describe('App Component', () => {
  beforeEach(() => {
    mock.reset(); // Reset the mock adapter before each test
  });
  test('renders the heading', () => {
    render(<App />);
    expect(screen.getByText(/KAYO - Know-It-All Yield Optimizer/i)).toBeInTheDocument();
  });

  test('renders the upload button', () => {
    render(<App />);
    expect(screen.getByText(/click to upload a file/i)).toBeInTheDocument();
  });

  test('opens and closes the feedback modal', () => {
    render(<App />);

    // Open the modal
    fireEvent.click(screen.getByText(/Give Feedback/i));

    fireEvent.click(screen.getByRole('button', {
      name: /cancel/i
    }))
    expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();
  });

  test('mode selection updates state', () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const select = screen.getByRole('combobox', {
      name: /select mode/i
    });
    
    fireEvent.click(screen.getByText(/School Work/i));
    expect(screen.getByText(/School Work/i)).toBeInTheDocument();
  });

  test('file upload updates state', () => {
    const { getByLabelText } = render(<App />);
    const fileInput = getByLabelText('Upload File');
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0]).toBe(file);
  });

  test("form submission doesn't work without file", async () => {
    const { getByText } = render(<App />);
    const uploadButton = getByText('Upload');

    fireEvent.click(uploadButton);

    //Nothing changes
    expect(screen.getByText(/KAYO - Know-It-All Yield Optimizer/i)).toBeInTheDocument();
})
  test('form submission without mode shows warning', async () => {
  const { getByText, getByLabelText } = render(<App />);
  const fileInput = getByLabelText('Upload File');
  const uploadButton = getByText('Upload');
  const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

  fireEvent.change(fileInput, { target: { files: [file] } });
  fireEvent.click(uploadButton);
  });

  test('feedback submission works', async () => {
    const { getByText, getByLabelText, getByRole } = render(<App />);
    const feedbackButton = getByText('Give Feedback');

    fireEvent.click(feedbackButton);

    const feedbackInput = getByLabelText('Feedback');
    const submitButton = screen.getByRole('button', {name: /submit/i});
    fireEvent.change(feedbackInput, { target: { value: 'Great app!' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/KAYO - Know-It-All Yield Optimizer/i)).toBeInTheDocument();
  });
});
