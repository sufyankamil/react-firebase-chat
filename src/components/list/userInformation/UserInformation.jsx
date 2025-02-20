import React from 'react'
import './userInformation.css'

export default function UserInformation() {
    return (
        <div className='userInformation'>
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>
                    John Doe
                </h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" className="icon" />
                <img src="./video.png" alt="" className="icon" />
                <img src="./edit.png" alt="" className="icon" />
            </div>
        </div>
    )
}
