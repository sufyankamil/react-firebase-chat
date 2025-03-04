import React, {useEffect, useState} from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../lib/firebase.js";
import {useChatStore} from "../lib/chatStore.js";
import {useUserStore} from "../lib/userStore.js";

export default function Chat() {
    const [chosenEmoji, setChosenEmoji] = useState(false);
    const [text, setText] = useState('');
    const endRef = React.useRef(null);
    const [chatMessages, setMessages] = useState([]);
    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
    const {currentUser} = useUserStore();
    const [isScreenTooSmall, setIsScreenTooSmall] = useState(window.innerWidth < 167);

    useEffect(() => {
        const handleResize = () => setIsScreenTooSmall(window.innerWidth < 167);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({behavior: 'smooth'});
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

        await updateDoc(doc(db, 'chats', chatId), {
            messages: arrayUnion({
                senderId: currentUser.id,
                text,
                createdAt: new Date().toISOString(),
            })
        });

        setText('');
    };

    const handleInfo = () => {
        alert('This is the chat page');
    };

    if (isScreenTooSmall) {
        return (
            <div className='small-screen-warning'
                 style={{textAlign: 'center', padding: '20px', fontSize: '18px', color: 'black'}}>
                Screen size too small. Please increase the width for a better experience.
            </div>
        );
    }

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt=""/>
                    <div className="texts">
                        <span>
                            {isCurrentUserBlocked ? 'User blocked' : user.username}
                        </span>
                        <p>Online</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./info.png" alt="" onClick={handleInfo}/>
                </div>
            </div>
            <div className="center">
                {chatMessages?.length > 0 ? (
                    chatMessages.map((message) => (
                        <div className={`message ${message.senderId === currentUser.id ? 'own' : 'received'}`}
                             key={message?.createdAt}>
                            <div className="texts">
                                <p>{message.text}</p>
                                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty" style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'black',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}>
                        No messages yet. Start the conversation now!
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./mic.png" alt=""/>
                </div>
                <input type="text" placeholder={
                    isCurrentUserBlocked || isReceiverBlocked ? 'User Blocked' : 'Type a message...'
                } value={text} onChange={(e) => setText(e.target.value)}
                       disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="emoji" onClick={() => setChosenEmoji(!chosenEmoji)}/>
                    <div className="picker">
                        <EmojiPicker
                            open={chosenEmoji}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}>Send
                </button>
            </div>
        </div>
    );
}
