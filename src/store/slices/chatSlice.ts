import { createSlice } from "@reduxjs/toolkit";
import { CurrentUser } from "../../types/CurrentUser";

interface ChatSliceType {
    chatId: string | null;
    receiverUser: CurrentUser | null;
    isReceiverBlocked: boolean;
    isSenderBlocked: boolean;
}

const initialState: ChatSliceType = {
    chatId: null,
    receiverUser: null,
    isReceiverBlocked: false,
    isSenderBlocked: false
}


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        changeChat: (state, action) => {
            state.chatId = action.payload.chatId;
            state.receiverUser = action.payload.receiverUser;
            state.isReceiverBlocked = action.payload.senderUser.blocked.includes(state.receiverUser?.id);
            state.isSenderBlocked = action.payload.receiverUser.blocked.includes(action.payload.senderUser.id);
        },
        changeBlock: (state, action) => {
            state.isReceiverBlocked = action.payload;
        }
    }
})

export default chatSlice.reducer;
export const {changeChat, changeBlock} = chatSlice.actions;