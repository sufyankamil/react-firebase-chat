import React, { useState, useEffect } from 'react';
import './login.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
    const [showSignup, setShowSignup] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 840);
    const [isTooSmall, setIsTooSmall] = useState(window.innerWidth < 295);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 840);
            setIsTooSmall(window.innerWidth < 295);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleView = () => setShowSignup(!showSignup);

    if (isTooSmall) {
        return (
            <div className='small-screen-warning' style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: 'red' }}>
                Please increase your device width for a better experience.
            </div>
        );
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fromData = new FormData(e.target);
        const { Username, Email, Password } = Object.fromEntries(fromData);

        try {
            const response = await createUserWithEmailAndPassword(auth, Email, Password);
            await setDoc(doc(db, 'users', response.user.uid), {
                username: Username,
                email: Email,
                id: response.user.uid,
                blocked: [],
            });
            await setDoc(doc(db, 'userchats', response.user.uid), { chats: [] });
            toast.success('User created successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fromData = new FormData(e.target);
        const { Email, Password } = Object.fromEntries(fromData);

        try {
            await signInWithEmailAndPassword(auth, Email, Password);
            toast.success('User logged in successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!isMobile || !showSignup ? (
                <div className='item'>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue</p>
                    <form onSubmit={handleLogin}>
                        <input type='email' placeholder='Email' name='Email' />
                        <input type='password' placeholder='Password' name='Password' />
                        <button disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
                        <span>Forgot Password?</span>
                    </form>
                </div>
            ) : null}

            {!isMobile || showSignup ? (
                <div className='item'>
                    <h1>Create an Account!</h1>
                    <p>Sign up to get started!</p>
                    <form onSubmit={handleRegister}>
                        <input type='text' placeholder='Username' name='Username' />
                        <input type='email' placeholder='Email Signup' name='Email' />
                        <input type='password' placeholder='Password' name='Password' />
                        <button disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
                    </form>
                </div>
            ) : null}

            {isMobile && (
                <div className='toggle-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '100%' }}>
                    <button className='toggle-btn' onClick={toggleView}>
                        {showSignup ? 'Go to Login' : 'Go to Signup'}
                    </button>
                </div>
            )}
        </div>
    );
}