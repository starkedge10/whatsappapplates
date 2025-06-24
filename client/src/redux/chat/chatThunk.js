import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



// export const fetchChat = createAsyncThunk('chat/fetchChat', async ({ phone }, { rejectWithValue }) => {

//     console.log(phone);
//     try {
//         const response = await axios.get(`/chat/${phone}`);
//         return response.data;

//     } catch (error) {
//         console.log(error);
//         return rejectWithValue(error.message)
//     }

// })
export const fetchChat = createAsyncThunk('chat/fetchChat', async ({ phone, page = 0, limit = 15 }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/chat/${phone}?skip=${page * limit}&limit=${limit}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);



export const fetchAllChats = createAsyncThunk('chat/fetchAllChats', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/chat');
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
})