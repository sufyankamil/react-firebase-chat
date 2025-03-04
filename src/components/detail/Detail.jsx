import React from 'react'
import './detail.css'
import {auth, db} from "../lib/firebase.js";
import {useUserStore} from "../lib/userStore.js";
import {useChatStore} from "../lib/chatStore.js";
import {arrayUnion, doc, updateDoc,arrayRemove} from "firebase/firestore";

export default function Detail() {
    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlockedStatus} = useChatStore();

    const { currentUser } = useUserStore();

    const handleLogout = () => {
        if(window.confirm('Are you sure you want to logout?')){
            auth.signOut();
        }
    }

    // const handleBlock = async () => {
    //     if(window.confirm(`Are you sure you want to ${isReceiverBlocked ? 'unblock' : 'block'} ${user?.username || 'this user'}?`
    //     )) {
    //         console.log('block: ', user);
    //         if (!user) return;
    //
    //         const userDocRef = doc(db, "users", currentUser.id);
    //
    //         try {
    //             await updateDoc(userDocRef, {
    //                 blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    //             });
    //             changeBlockedStatus();
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    // };

    const handleBlock = async () => {
        if (!user) return console.error("User is null");

        if (window.confirm(`Are you sure you want to ${isReceiverBlocked ? 'unblock' : 'block'} ${user?.username || 'this user'}?`)) {
            try {
                const currentUserDocRef = doc(db, "users", currentUser.id);
                const receiverUserDocRef = doc(db, "users", user.id);

                await updateDoc(currentUserDocRef, {
                    blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
                });

                await updateDoc(receiverUserDocRef, {
                    blocked: isReceiverBlocked ? arrayRemove(currentUser.id) : arrayUnion(currentUser.id),
                });

                changeBlockedStatus();
            } catch (err) {
                console.log("Error blocking user:", err);
            }
        }
    };



    return (
        <div className='detail'>
            <div className="user">
                <img src="./avatar.png" alt="avatar" />
                <h2>
                {/* if username is null then set default username */}
                    {isCurrentUserBlocked ? 'User blocked' : user.username}
                </h2>
                <p>
                    {isCurrentUserBlocked ? 'User blocked' : user.username}
                </p>
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

                <button style={
                    !isReceiverBlocked ? {backgroundColor: 'red'} : {backgroundColor: 'green'}
                } onClick={ () => handleBlock()}>
                    {isReceiverBlocked ? 'Unblock User' : 'Block User'}
                </button>
                <button className='logout' onClick={ () => handleLogout()}>Logout</button>
            </div>
        </div>
    )
}
