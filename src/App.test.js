import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from "./App";


describe('App Component', () => {
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
    expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();

  });
});
