/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

// Mock HTMLFormElement.prototype.requestSubmit
HTMLFormElement.prototype.requestSubmit = jest.fn();

test('renders Login component', () => {
    render(<Login />);

    // Check if the welcome message is rendered
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();

    // Check if the sign-in form elements are rendered
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password login')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();

    // Check if the create account message is rendered
    expect(screen.getByText('Create, Account!')).toBeInTheDocument();

    // Check if the sign-up form elements are rendered
    expect(screen.getByText('Upload an Image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Signup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
});

test('handles avatar upload', () => {
    render(<Login />);

    // Check if the default avatar image is rendered
    const avatarImage = screen.getByAltText('');
    expect(avatarImage).toBeInTheDocument();

    // Simulate avatar upload
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload an Image');
    fireEvent.change(input, { target: { files: [file] } });

    // Check if the avatar image is updated
    expect(avatarImage.src).toContain('mocked-url');
});

test('handles login form submission', () => {
    render(<Login />);

    // Simulate form submission
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password login');
    const signInButton = screen.getByText('Sign In');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

});

test('handles sign-up form submission', () => {
    render(<Login />);

    // Simulate form submission
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email Signup');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signUpButton = screen.getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signUpButton);

});