import React from 'react'
import './login.css'
import { toast } from 'react-toastify';

export default function Login() {
    const [avarat, setAvatar] = React.useState({
        file: null,
        url: '',
    });

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    // const handleLogin = (e) => {
    //     e.preventDefault();
    // }

    return (
        <div className='login'>
            <div className="item">
                <h1>Welcome Back</h1>
                <p>Sign in to continue</p>
                <form >
                    <input type="email" placeholder='Email' name='Email' />
                    <input type="password" placeholder='Password login' name='Password' />
                    <button>Sign In</button>
                    <span>Forgot Password?</span>
                </form>
            </div>

            <div className="seperator"></div>

            <div className="item">
                <h1>Create, Account!</h1>
                <p>Enter your personal details and start journey with us</p>
                <form>
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
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
    )
}
