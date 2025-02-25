import {create } from 'zustand';
import {doc, getDoc} from "firebase/firestore";
import {db} from "./firebase.js";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchCurrentUser: async (uid) => {
        if(!uid) return set({ currentUser: null, isLoading: false });
        try{
            const docRef =  doc(db, 'users', uid);

            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                set({ currentUser: null , isLoading: false });
            }
        } catch (error) {
            console.error(error);
            return set({ currentUser: null , isLoading: false });
        } finally {
            set({ isLoading: false });
        }
    },
    setCurrentUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ currentUser: user });
    },
    logout: () => {
        localStorage.removeItem('user');
        set({ currentUser: null });
    }
}));