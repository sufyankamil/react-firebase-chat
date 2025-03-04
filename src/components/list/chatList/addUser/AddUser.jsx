import React, {useState} from 'react'
import './addUser.css'
import {db} from "../../../lib/firebase.js";
import {collection, doc, getDocs, query, setDoc, where, updateDoc} from 'firebase/firestore';
import {serverTimestamp, arrayUnion} from 'firebase/firestore';
import {useUserStore} from "../../../lib/userStore.js";

export default function AddUser() {

    const [users, setUsers] = React.useState(null);
    const {currentUser} = useUserStore();
    const [searchMessage, setSearchMessage] = useState('');

    const handleSearch = async  (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        setSearchMessage('');

        try{
            const userRef = collection(db, 'users');
            const userQuery = query(userRef, where('username', '==', username));
            const userDoc = await getDocs(userQuery);

            if(!userDoc.empty){
                userDoc.forEach(doc => {
                    setUsers(doc.data());
                });
            }else {
                setUsers(null);
                setSearchMessage('User not found');
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
            <h2 style={
                {
                    textAlign: 'left',
                    color: 'white',
                    margin: '0px 5px'
                }
            }>Add User</h2>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Type username...' name='username' />
                <button>Search</button>
            </form>

            {searchMessage && <p style={{ color: 'red' }}>{searchMessage}</p>}


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
