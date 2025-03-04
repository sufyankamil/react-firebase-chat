import React, {useState} from 'react'
import './userInformation.css'
import {useUserStore} from "../../lib/userStore.js";
import AddUser from "../chatList/addUser/AddUser.jsx";

export default function UserInformation() {
    const {currentUser} = useUserStore();
    const [addMode, setAddMode] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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

            {isMobile && (
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                />
            )}

            {!isMobile && (
                <div className="icons">
                    <img src="./more.png" alt="" className="icon" onClick={
                        handleEdit
                    }/>
                </div>
            )}

            {addMode && <AddUser/>}

        </div>
    )
}
