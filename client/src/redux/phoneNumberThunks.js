// features/phoneNumbers/phoneNumberThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;

export const fetchPhoneNumbers = createAsyncThunk(
  'phoneNumbers/fetchPhoneNumbers',
  async (_, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        access_token: accessToken,
      });

      const response = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/phone_numbers?${queryParams}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      return rejectWithValue(error.message);
    }
  }
);
