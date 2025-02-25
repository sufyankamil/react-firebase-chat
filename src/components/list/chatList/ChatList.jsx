import React, {useEffect} from 'react'
import './chatList.css'
import AddUser from './addUser/AddUser'
import {useUserStore} from "../../lib/userStore.js";
import {onSnapshot, doc, getDoc} from 'firebase/firestore';
import {db} from "../../lib/firebase.js";
import {useChatStore} from "../../lib/chatStore.js";

export default function ChatList() {
    const [addMode, setAddMode] = React.useState(false);

    const [chats, setChats] = React.useState([]);

    const {currentUser} = useUserStore();

    const { chatId,changeChat } = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (response) => {
            const items = response.data()?.chats;  // Use optional chaining to prevent errors when "chats" is undefined.

            if (!items || !Array.isArray(items)) {
                console.error('Invalid or missing "chats" data:', items);
                return;
            }

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, 'users', item.receiverId);
                const userDoc = await getDoc(userDocRef);
                const user = userDoc.data();

                return {
                    user,
                    chatId: item.chatId,
                    lastMessage: item.lastMessage,
                    updatedAt: item.updatedAt,
                    isSeen: item.isSeen,
                };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => unSub();
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        changeChat(chat.chatId, chat.user);
    };


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

            {
                chats.map(chat => (
                    <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}
                         style={{backgroundColor: chat.isSeen ? 'transparent' : 'rgba(0, 0, 0, 0.1)'}}
                    >
                        <img src="./avatar.png" alt="" />
                        <div className="text">
                            <span className='name'>{chat.user.username}</span>
                            <p>{chat.lastMessage} </p>
                        </div>
                    </div>
                ))
            }
            {
                addMode && <AddUser />
            }
        </div>
    )
}
