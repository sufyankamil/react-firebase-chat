import React, {useEffect, useState} from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import {useUserStore} from "../../lib/userStore.js";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../lib/firebase.js";
import {useChatStore} from "../../lib/chatStore.js";

export default function ChatList() {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 370);

    const {currentUser} = useUserStore();
    const {changeChat} = useChatStore();
    const [, forceRender] = useState(0);

    useEffect(() => {
        // Update screen size when window resizes
        const handleResize = () => {
            const newScreenSize = window.innerWidth < 370;
            setIsSmallScreen(newScreenSize);
            forceRender((prev) => prev + 1);
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.data();
                return {...item, user};
            });

            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            // eslint-disable-next-line no-unused-vars
            const {user, ...rest} = item;
            return rest;
        });

        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {chats: userChats});
            await changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredChats = chats.filter((c) => c.user?.username.toLowerCase().includes(input.toLowerCase()));

    return (
        <div className="chatList">
            {isSmallScreen && (
                <div className="small-screen-warning"
                     style={{textAlign: "center", padding: "20px", color: "black", fontSize: "16px", fontWeight: "bold"}}>
                    Please increase your screen width for a better experience.
                </div>
            )}

            {!isSmallScreen && (
                <>
                    <div className="search">
                        <div className="searchBar">
                            <img src="./search.png" alt=""/>
                            <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>
                        </div>
                        <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add"
                             onClick={() => setAddMode((prev) => !prev)}/>
                    </div>

                    {chats.length === 0 && (
                        <div className="empty" style={addMode ? {display: "none"} : {textAlign: "center"}}>
                            <p>No chats available</p>
                            <h3>
                                Start a new chat by clicking the
                                <img src="./plus.png" alt="" style={{width: "20px", height: "20px", padding: "0 5px"}}/>
                                icon
                            </h3>
                        </div>
                    )}

                    {filteredChats.map((chat) => (
                        <div
                            className="item"
                            key={`${chat.chatId}-${chat.user.id}`}
                            onClick={() => handleSelect(chat)}
                            style={{
                                backgroundColor: chat?.isSeen ? "transparent" : "mediumpurple",
                            }}
                        >
                            <img
                                src={
                                    chat.user.blocked.includes(currentUser.id)
                                        ? "./avatar.png"
                                        : chat.user.avatar || "./avatar.png"
                                }
                                alt=""
                            />
                            <div className="texts">
                                <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                                <p>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}

                    {addMode && <AddUser/>}
                </>
            )}
        </div>
    );
}
