import {create } from 'zustand';
import {useUserStore} from "./userStore.js";

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        // Check if currentUser is blocked by the receiver
        if(user.blocked.includes(currentUser.id)){
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }

        // Check if the receiver is blocked by the currentUser
        else if(currentUser.blocked.includes(user.id)){
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        } else {
            set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            });
        }
    },

    changeBlockedStatus: () => {
        set(
            (state) => ({
                isCurrentUserBlocked: !state.isCurrentUserBlocked,
                isReceiverBlocked: !state.isReceiverBlocked,
            })
        );
    }
}));