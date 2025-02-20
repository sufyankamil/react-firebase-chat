/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import Detail from './Detail';

test('renders Detail component', () => {
    render(<Detail />);

    // Check if the user image is rendered
    expect(screen.getByAltText('avatar')).toBeInTheDocument();

    // Check if the user name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check if the user description is rendered
    expect(screen.getByText(/Lorem, ipsum dolor sit amet/i)).toBeInTheDocument();

    // Check if the settings options are rendered
    expect(screen.getByText('Open Settings')).toBeInTheDocument();
    expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
    expect(screen.getByText('Chat Settings')).toBeInTheDocument();
    expect(screen.getByText('Shared Images')).toBeInTheDocument();

    // Check if the shared image is rendered
    expect(screen.getByText('Image 1')).toBeInTheDocument();

    // Check if the buttons are rendered
    expect(screen.getByText('Block User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
});