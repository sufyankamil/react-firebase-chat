/* eslint-disable no-undef */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import ChatList from './ChatList';

test('renders ChatList component', () => {
    render(<ChatList />);

    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    // Check if the add button is rendered
    const addButton = screen.getByAltText('plus');
    expect(addButton).toBeInTheDocument();

    // Check if the chat items are rendered
    const chatItems = screen.getAllByText('John Doe');
    expect(chatItems.length).toBeGreaterThan(0);
});

test('toggles add mode', () => {
    render(<ChatList />);

    // Check if the add button is rendered
    const addButton = screen.getByAltText('plus');
    expect(addButton).toBeInTheDocument();

    // Click the add button to toggle add mode
    fireEvent.click(addButton);

    expect(screen.getByAltText('plus')).toBeInTheDocument();

    // Check if the AddUser component is rendered
    expect(screen.getByText('Add User')).toBeInTheDocument();
});