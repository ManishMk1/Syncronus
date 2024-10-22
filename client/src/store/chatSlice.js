import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts:[],
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatType: (state, action) => {
            state.selectedChatType = action.payload;
        },
        setDirectMessagesContacts:(state,action)=>{
            state.directMessagesContacts=action.payload;
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload;
        },
        setSelectedChatMessages: (state, action) => {
            state.selectedChatMessages = action.payload;
        },
        closeChat: (state) => {
            state.selectedChatType = undefined;
            state.selectedChatData = undefined;
            state.selectedChatMessages = [];
        },
        addMessage: (state, action) => {
            const message = action.payload;
            const selectedChatType = state.selectedChatType;
            
            const newMessage = {
                ...message,
                recipient:
                    selectedChatType === "channel"
                        ? message.recipient
                        : message.recipient._id,
                sender:
                    selectedChatType === "channel"
                        ? message.sender
                        : message.sender._id,
            };

            state.selectedChatMessages.push(newMessage);
        },
    },
});

export const {
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    closeChat,
    addMessage,
    setDirectMessagesContacts
} = chatSlice.actions;

export default chatSlice.reducer;
