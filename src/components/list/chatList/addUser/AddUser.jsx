import React from 'react'
import './addUser.css'

export default function AddUser() {
    return (
        <div className='addUser'>
            <form>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            <div className="user">
                <div className="detail">
                    <img src="./avatar.png" alt="" />
                    <p>
                        John Doe
                    </p>
                </div>
                <button>Add User</button>
            </div>
        </div>
    )
}
