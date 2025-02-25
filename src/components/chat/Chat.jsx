import React, {useEffect} from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../lib/firebase.js";
import {useChatStore} from "../lib/chatStore.js";
import {useUserStore} from "../lib/userStore.js";

export default function Chat() {
    const [chosenEmoji, setChosenEmoji] = React.useState(false);

    const [text, setText] = React.useState('');

    const endRef = React.useRef(null);

    const [chatMessages, setMessages] = React.useState([]);

    const { chatId, user } = useChatStore();

    const { currentUser } = useUserStore();


    React.useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [text]);

    useEffect(() => {
        const unSubs = onSnapshot(doc(db, 'chats', chatId), async (response) => {
            const items = response.data()?.messages;

            if (!items || !Array.isArray(items)) {
                console.error('Invalid or missing "messages" data:', items);
                return;
            }

            setMessages(items);
        });

        return () => unSubs();
    }, [chatId]);

    const handleEmojiClick = (emojiObject) => {
        setText((prev) => prev + emojiObject.emoji);
        setChosenEmoji(false);
    };

    const handleSend = async () => {
        if (!text) return;

        const message = {
            text,
            createdAt: Date.now(),
        };

        await updateDoc(doc(db, 'chats', chatId), {
            messages: arrayUnion({
                senderId: currentUser.id,
                text,
                createdAt: new Date().toISOString(),
            })
        });

        const userIds = [currentUser.id, user.id].sort();

        for (const userId of userIds) {

            const userChatsRef = doc(db, 'userchats', userId);
            const userChatsDoc = await getDoc(userChatsRef);

            if (userChatsDoc.exists()) {
                const userChatsData = userChatsDoc.data();
                const chatIndex = userChatsData.chats.findIndex(chat => chat.chatId === chatId);

                userChatsData.chats[chatIndex].lastMessage = text;
                userChatsData.chats[chatIndex].isSeen = userId === currentUser.id;
                userChatsData.chats[chatIndex].updatedAt = Date.now();

                await updateDoc(userChatsRef, {
                    chats: userChatsData.chats,
                });

            }
        }
        setText('');
    };

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>
                            {user?.username}
                        </span>
                        <p>
                            Online
                        </p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chatMessages?.length > 0 ? (
                    chatMessages.map((message) => (
                        <div className={'message own'} key={message?.createdAt}>
                            <div className="texts">
                                <p>{message.text}</p>
                                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty">
                        No messages yet
                    </div>
                )}

                <div ref={endRef}></div>
            </div>

            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder='Type a message' value={text} onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="emoji" onClick={() => setChosenEmoji(!chosenEmoji)} />
                    <div className="picker">
                        <EmojiPicker
                            open={chosenEmoji}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend}>Send</button>
            </div>

        </div>
    )
}
