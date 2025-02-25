import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Nofitication from "./components/notification/Notification"
import {useEffect} from "react";
import {auth} from "./components/lib/firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useUserStore} from "./components/lib/userStore.js";
import {useChatStore} from "./components/lib/chatStore.js";

const App = () => {
    const {currentUser, fetchCurrentUser, isLoading} = useUserStore();

    const {chatId} = useChatStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          fetchCurrentUser(user?.uid);
        });

        return () => unsubscribe();
    }, [fetchCurrentUser]);

    if(isLoading) return <div className="loading">
        Please wait while we load the app...
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
      <Nofitication />
    </div>
  )
}

export default App