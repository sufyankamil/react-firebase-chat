import React from 'react'
import './login.css'
import { toast } from 'react-toastify';
import  { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
    const [avarat, setAvatar] = React.useState({
        file: null,
        url: '',
    });

    const [loading, setLoading] = React.useState(false);

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fromData = new FormData(e.target);

        const {Username, Email, Password} = Object.fromEntries(fromData);

        try {
            const response = await createUserWithEmailAndPassword(auth, Email, Password);

            await setDoc(doc(db, 'users', response.user.uid), {
                username: Username,
                email: Email,
                id: response.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, 'userchats', response.user.uid), {
                chats: [],
            });

            toast.success('User created successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fromData = new FormData(e.target);

        const {Email, Password} = Object.fromEntries(fromData);

        try {
            await signInWithEmailAndPassword(auth, Email, Password);

            toast.success('User logged in successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login'>
            <div className="item">
                <h1>Welcome Back</h1>
                <p>Sign in to continue</p>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder='Email' name='Email' />
                    <input type="password" placeholder='Password login' name='Password' />
                    <button disabled={loading}>
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                    <span>Forgot Password?</span>
                </form>
            </div>

            <div className="seperator"></div>

            <div className="item">
                <h1>Create, Account!</h1>
                <p>Enter your personal details and start journey with us</p>
                <form onSubmit={handleRegister}>
                    <label htmlFor='file'>
                        <img src={avarat.url ? avarat.url : './avatar.png'} alt="" />
                        Upload an Image
                    </label>
                    <input type="file" id='file' style={{ display: 'none' }}
                        onChange={(e) => {
                            handleAvatar(e)
                        }}
                    />
                    <input type="text" placeholder='Username' name='Username' />
                    <input type="email" placeholder='Email Signup' name='Email' />
                    <input type="password" placeholder='Password' name='Password' />
                    <button disabled={loading}>
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    )
}
