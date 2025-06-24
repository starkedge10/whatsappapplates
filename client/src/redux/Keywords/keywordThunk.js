import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const addKeyword = createAsyncThunk('addKeyword', async (keyword, { rejectWithValue }) => {
    try {
        const res = await axios.post('/addKeyword', keyword)
        return res.data;
    } catch (error) {
        return rejectWithValue(err.response?.data || err.message);
    }

});

export const fetchKeywords = createAsyncThunk('fetchKeywords', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/keywords');
        return res.data;
    } catch (error) {
        return rejectWithValue(err.response?.data || err.message);
    }
});


export const deleteKeywords = createAsyncThunk('deleteKeywords', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`/deleteKeyword/${id}`);
        return res.data;
    } catch (error) {
        toast.error('Failed to delete')
        return rejectWithValue(err.response?.data || err.message);
    }
});
export const updateKeyword = createAsyncThunk('updateKeyword', async ({ id, updatedKeyword }, { rejectWithValue }) => {
    try {
        
        const res = await axios.put(`/updateKeyword/${id}`, updatedKeyword);
        return res.data;
    } catch (error) {
        toast.error('Failed to update');
        return rejectWithValue(error.response?.data || error.message);
    }
}
);
