import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import {useEffect} from "react";
import {auth} from "./components/lib/firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useUserStore} from "./components/lib/userStore.js";
import {useChatStore} from "./components/lib/chatStore.js";
import Notification from "./components/notification/Notification"
import { Analytics } from '@vercel/analytics/react';

const App = () => {
    const {currentUser, fetchCurrentUser, isLoading} = useUserStore();

    const {chatId} = useChatStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          // fetchCurrentUser(user?.uid);
            fetchCurrentUser(user?.uid).catch((error) => console.error("Error fetching user:", error));
        });

        return () => unsubscribe();
    }, [fetchCurrentUser]);

    if(isLoading) return <div className="loading">
        Please wait while the app is loading...
    </div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
              {chatId && <Chat />}
              {chatId && <Detail />}
          </>
        ) : (
          <Login />
        )
      }
      <Notification />
        <Analytics />
    </div>
  )
}

export default App