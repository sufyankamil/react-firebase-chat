import React from 'react'
import './detail.css'

export default function Detail() {
    return (
        <div className='detail'>
            <div className="user">
                <img src="./avatar.png" alt="avatar" />
                <h2>
                    John Doe
                </h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque iste eveniet beatae, officiis nulla</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Open Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Security
                        </span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>
                            Chat Settings
                        </span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Images</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./avatar.png" alt="" />
                                <span>Image 1</span>
                            </div>
                            <img src="./download.png" alt="" className='icon' />

                        </div>
                    </div>
                </div>
                <button>Block User</button>
                <button className='logout'>Logout</button>
            </div>
        </div>
    )
}
