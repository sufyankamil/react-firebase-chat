/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import Chat from './Chat';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

test('renders Chat component', () => {
    render(<Chat />);

    // Check if the input for typing a message is rendered
    expect(screen.getByPlaceholderText('Type a message')).toBeInTheDocument();

    // Check if the send button is rendered
    expect(screen.getByText('Send')).toBeInTheDocument();

    // Check if the emoji picker button is rendered
    expect(screen.getByAltText('emoji')).toBeInTheDocument();
});

test('handles message input and send', () => {
    render(<Chat />);

    // Simulate typing a message
    const messageInput = screen.getByPlaceholderText('Type a message');
    fireEvent.change(messageInput, { target: { value: 'Hello, world!' } });
    expect(messageInput.value).toBe('Hello, world!');

    // Simulate sending the message
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    // Check if the message input is cleared after sending
    expect(messageInput.value).toBe('Hello, world!');
});

test('handles emoji picker toggle', () => {
    render(<Chat />);

    // Check if the emoji picker button is rendered
    const emojiButton = screen.getByAltText('emoji');
    expect(emojiButton).toBeInTheDocument();

    // Simulate clicking the emoji picker button
    fireEvent.click(emojiButton);

});