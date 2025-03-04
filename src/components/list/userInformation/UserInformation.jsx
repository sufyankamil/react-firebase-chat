import React from 'react'
import './userInformation.css'
import {useUserStore} from "../../lib/userStore.js";

export default function UserInformation() {
    const {currentUser} = useUserStore();

    const handleEdit = () => {
        window.alert('User will be able to edit their profile here');
    }

    return (
        <div className='userInformation'>
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>
                    {currentUser?.username}
                </h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" className="icon" onClick={
                    handleEdit
                }/>
            </div>
        </div>
    )
}
