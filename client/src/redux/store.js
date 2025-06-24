import { configureStore } from '@reduxjs/toolkit';
import templateReducer from './templateSlice.js';
import phoneNumberReducer from './phoneNumberSlice.js';
import campaignReducer from './Campaign/campaignSlice.js';
import ContactReducer from './contacts/contactSlice.js';
import ReplyMaterialSlice from './ReplyMaterial/ReplyMaterialSlice.js';
import keywordReducer from './Keywords/keywordsSlice.js'
import chatbotsReducer from './Chatbot/chatbotsSlice.js'
import chatReducer from './chat/chatSlice.js'

export const store = configureStore({
  reducer: {
    templates: templateReducer,
    phoneNumbers: phoneNumberReducer,
    campaign: campaignReducer,
    contact: ContactReducer,
    replyMaterial: ReplyMaterialSlice,
    keywords: keywordReducer,
    chatbots: chatbotsReducer,
    chat: chatReducer,
  },
});


export default store; 