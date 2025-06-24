import { createSlice } from '@reduxjs/toolkit';

import { addChatbot, getChatbots, updateChatbot, deleteChatbot, updateChatbotName } from './chatbotsThunk';



const initialState = {
    chatbots: [],
    loading: false,
    error: null,
};


const chatbotsSlice = createSlice({
    name: 'chatbots',
    initialState,
    reducers: {
        setChatbots: (state, action) => {
            state.chatbots = action.payload;
        },
    },
    extraReducers: (builder) => {

        //update Chatbot name 
        builder.addCase(updateChatbotName.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateChatbotName.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.chatbots.findIndex(bot => bot._id === action.payload._id);
            if (index !== -1) {
                state.chatbots[index] = action.payload;
            }
        });
        builder.addCase(updateChatbotName.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });




        //deleteChatbot
        builder.addCase(deleteChatbot.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteChatbot.fulfilled, (state, action) => {
            state.loading = false;
            state.chatbots = state.chatbots.filter(bot => bot._id !== action.payload._id);
        });
        builder.addCase(deleteChatbot.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });




        //updateChatbot
        builder.addCase(updateChatbot.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateChatbot.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.chatbots.findIndex(bot => bot._id === action.payload._id);
            if (index !== -1) {
                state.chatbots[index] = action.payload;
            }
        });
        builder.addCase(updateChatbot.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });




        //getChatbots
        builder.addCase(getChatbots.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getChatbots.fulfilled, (state, action) => {
            state.loading = false;
            state.chatbots = action.payload;
        });
        builder.addCase(getChatbots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });


        //addChatbot
        builder.addCase(addChatbot.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addChatbot.fulfilled, (state, action) => {
            state.loading = false;
            state.chatbots.push(action.payload);
        });
        builder.addCase(addChatbot.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});




export const { setChatbots } = chatbotsSlice.actions;


export default chatbotsSlice.reducer;