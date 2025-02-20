import React from 'react'
import './list.css'
import UserInformation from './userInformation/UserInformation'
import ChatList from './chatList/ChatList'

export default function List() {
    return (
        <div className='list'>
            <UserInformation />
            <ChatList />
            <div className='small-screen'>
                <h3>
                    Please make the screen bigger
                </h3>
                <p>
                    This app is not supported in small screens
                </p>
            </div>
        </div>
    )
}
