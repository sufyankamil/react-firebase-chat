import React from 'react'
import './userInformation.css'
import {useUserStore} from "../../lib/userStore.js";

export default function UserInformation() {
    const {currentUser} = useUserStore();

    return (
        <div className='userInformation'>
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>
                    {currentUser?.username}
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
