import React from 'react'
import './chatList.css'
import AddUser from './addUser/AddUser'

export default function ChatList() {
    const [addMode, setAddMode] = React.useState(false)

    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder='Search' />
                </div>
                <img src={
                    addMode ? './minus.png' : './plus.png'
                }
                    alt="plus" className='add' onClick={() => setAddMode(!addMode)} />
            </div>

            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="text">
                    <span className='name'>John Doe</span>
                    <p>Hi </p>
                </div>
            </div>
            {
                addMode && <AddUser />
            }
        </div>
    )
}
