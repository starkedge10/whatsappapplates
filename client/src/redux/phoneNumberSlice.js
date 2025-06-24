// features/phoneNumbers/phoneNumberSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPhoneNumbers } from './phoneNumberThunks';

const phoneNumberSlice = createSlice({
  name: 'phoneNumbers',
  initialState: {
    phoneNumbers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhoneNumbers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhoneNumbers.fulfilled, (state, action) => {
        state.phoneNumbers = action.payload;
        state.loading = false;
      })
      .addCase(fetchPhoneNumbers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default phoneNumberSlice.reducer;
