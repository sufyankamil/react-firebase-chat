import React, { useEffect, useState } from 'react';
import './detail.css';
import { auth, db } from "../lib/firebase.js";
import { useUserStore } from "../lib/userStore.js";
import { useChatStore } from "../lib/chatStore.js";
import { arrayUnion, doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";

export default function Detail() {
    const { chatId, user, changeBlockedStatus, changeChat } = useChatStore();
    const { currentUser } = useUserStore();

    const [fetchedUser, setFetchedUser] = useState(user); // Store user if lost
    const [receiverBlockedStatus, setReceiverBlockedStatus] = useState(false); // Local state for block status

    // (Fetch user and blocked status) again if lost on refresh
    useEffect(() => {
        if (!user && chatId) {
            const fetchUser = async () => {
                try {
                    const userChatsRef = doc(db, "userchats", currentUser.id);
                    const userChatsSnap = await getDoc(userChatsRef);

                    if (userChatsSnap.exists()) {
                        const userChats = userChatsSnap.data().chats;
                        const chatData = userChats.find(chat => chat.chatId === chatId);

                        if (chatData) {
                            const userDocRef = doc(db, "users", chatData.receiverId);
                            const userSnap = await getDoc(userDocRef);
                            if (userSnap.exists()) {
                                const userData = userSnap.data();
                                setFetchedUser(userData);
                                await changeChat(chatId, userData); // 🔹 Update store

                                // Check if current user is blocked
                                setReceiverBlockedStatus(userData.blocked?.includes(currentUser.id));
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user after refresh:", error);
                }
            };
            fetchUser().catch(error => console.error("Error in fetchUser:", error));
        } else if (user) {
            // Ensure block status updates even if user is already available
            setReceiverBlockedStatus(user.blocked?.includes(currentUser.id));
        }
    }, [user, chatId, currentUser.id, changeChat]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            auth.signOut();
        }
    };

    const handleBlock = async () => {
        const targetUser = user || fetchedUser;
        if (!targetUser) return console.error("User is null");

        if (window.confirm(`Are you sure you want to ${receiverBlockedStatus ? 'unblock' : 'block'} ${targetUser?.username || 'this user'}?`)) {
            try {
                const currentUserDocRef = doc(db, "users", currentUser.id);
                const receiverUserDocRef = doc(db, "users", targetUser.id);

                if (!receiverBlockedStatus) {
                    await updateDoc(currentUserDocRef, {
                        blocked: arrayUnion(targetUser.id),
                    });
                    await updateDoc(receiverUserDocRef, {
                        blocked: arrayUnion(currentUser.id),
                    });
                } else {
                    await updateDoc(currentUserDocRef, {
                        blocked: arrayRemove(targetUser.id),
                    });
                    await updateDoc(receiverUserDocRef, {
                        blocked: arrayRemove(currentUser.id),
                    });
                }

                setReceiverBlockedStatus(!receiverBlockedStatus); // Update state
                changeBlockedStatus(); // Update store
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
                    {receiverBlockedStatus ? 'User blocked' : (user || fetchedUser)?.username}
                </h2>
                <p>
                    {receiverBlockedStatus ? 'User blocked' : (user || fetchedUser)?.username}
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
                        <span>Privacy & Security</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                {!receiverBlockedStatus && (
                    <button
                        style={{ backgroundColor: 'red' }}
                        onClick={handleBlock}
                    >
                        Block User
                    </button>
                )}

                {receiverBlockedStatus && (
                    <button
                        style={{ backgroundColor: 'green' }}
                        onClick={handleBlock}
                    >
                        Unblock User
                    </button>
                )}

                <button className='logout' onClick={handleLogout}>Logout</button>


                {receiverBlockedStatus && (
                    <p>You won’t be able to send messages to this user</p>
                )}
            </div>
        </div>
    );
}