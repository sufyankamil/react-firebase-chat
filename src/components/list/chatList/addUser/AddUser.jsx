import React from 'react'
import './addUser.css'
import {db} from "../../../lib/firebase.js";
import {collection, doc, getDocs, query, setDoc, where, updateDoc} from 'firebase/firestore';
import {serverTimestamp, arrayUnion} from 'firebase/firestore';
import {useUserStore} from "../../../lib/userStore.js";

export default function AddUser() {

    const [users, setUsers] = React.useState(null);

    const {currentUser} = useUserStore();

    const handleSearch = async  (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const username = formData.get('username');

        try{
            const userRef = collection(db, 'users');

            const userQuery = query(userRef, where('username', '==', username));

            const userDoc = await getDocs(userQuery);

            if(!userDoc.empty){
                userDoc.forEach(doc => {
                    setUsers(doc.data());
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdd = async () => {
        const chatRef = collection(db, 'chats');

        const userChatsRef = collection(db, 'userchats');
        try{
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            console.log(newChatRef.id);

            await updateDoc(doc(userChatsRef, users.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: users.id,
                    updatedAt: Date.now(),
                }),
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            {users &&
            <div className="user">
                <div className="detail">
                    <img src="./avatar.png" alt="" />
                    <p>
                        {users.username}
                    </p>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>
            }
        </div>
    )
}
