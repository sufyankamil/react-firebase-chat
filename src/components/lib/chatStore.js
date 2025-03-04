import { create } from 'zustand';
import { useUserStore } from "./userStore.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

export const useChatStore = create((set, get) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,

    changeChat: async (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        if (!user || !currentUser) {
            return set({ chatId: null, user: null, isCurrentUserBlocked: false, isReceiverBlocked: false });
        }

        try {
            const userDocSnap = await getDoc(doc(db, "users", user.id));
            if (userDocSnap.exists()) {
                const updatedUser = userDocSnap.data();

                // Check if current user is blocked by the receiver
                if (updatedUser.blocked.includes(currentUser.id)) {
                    return set({
                        chatId,
                        user: updatedUser,
                        isCurrentUserBlocked: true,
                        isReceiverBlocked: false,
                    });
                }

                // Check if the receiver is blocked by the current user
                if (currentUser.blocked.includes(updatedUser.id)) {
                    return set({
                        chatId,
                        user: updatedUser,
                        isCurrentUserBlocked: false,
                        isReceiverBlocked: true,
                    });
                }

                // If neither is blocked
                set({
                    chatId,
                    user: updatedUser,
                    isCurrentUserBlocked: false,
                    isReceiverBlocked: false,
                });
            }
        } catch (error) {
            console.error("Error fetching updated user data:", error);
        }
    },

    // Fetch blocked status from Firestore again to ensure correct state
    fetchBlockedStatus: async () => {
        const { user } = get();
        const currentUser = useUserStore.getState().currentUser;

        if (!user || !currentUser) return;

        try {
            const userDocSnap = await getDoc(doc(db, "users", user.id));
            if (userDocSnap.exists()) {
                const updatedUser = userDocSnap.data();
                set({
                    isCurrentUserBlocked: updatedUser.blocked.includes(currentUser.id),
                    isReceiverBlocked: currentUser.blocked.includes(updatedUser.id),
                });
            }
        } catch (error) {
            console.error("Error updating blocked status:", error);
        }
    },

    changeBlockedStatus: () => {
        set((state) => ({
            ...state,
            isReceiverBlocked: !state.isReceiverBlocked,
        }));
    },
}));
