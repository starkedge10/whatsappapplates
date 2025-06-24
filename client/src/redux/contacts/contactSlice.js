import { createSlice } from '@reduxjs/toolkit';
import {
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    addTags,
    removeTags,
    addNotes,
    removeNotes,
    updateNote,
} from './contactThunk.js';



const contactSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        const updateContactInList = (state, updated) => {
            const idx = state.contacts.findIndex(c => c._id === updated._id);
            if (idx !== -1) state.contacts[idx] = updated;
        };

        builder
            // FETCH
            .addCase(fetchContacts.pending, handlePending)
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, handleRejected)

            // ADD
            .addCase(addContact.pending, handlePending)
            .addCase(addContact.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts.push(action.payload);
            })
            .addCase(addContact.rejected, handleRejected)

            // UPDATE
            .addCase(updateContact.pending, handlePending)
            .addCase(updateContact.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(updateContact.rejected, handleRejected)

            // DELETE
            .addCase(deleteContact.pending, handlePending)
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = state.contacts.filter(c => c._id !== action.payload);
            })
            .addCase(deleteContact.rejected, handleRejected)

            // TAGS
            .addCase(addTags.pending, handlePending)
            .addCase(addTags.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(addTags.rejected, handleRejected)

            .addCase(removeTags.pending, handlePending)
            .addCase(removeTags.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(removeTags.rejected, handleRejected)

            // NOTES
            .addCase(addNotes.pending, handlePending)
            .addCase(addNotes.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(addNotes.rejected, handleRejected)

            .addCase(removeNotes.pending, handlePending)
            .addCase(removeNotes.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(removeNotes.rejected, handleRejected)

            .addCase(updateNote.pending, handlePending)
            .addCase(updateNote.fulfilled, (state, action) => {
                state.loading = false;
                updateContactInList(state, action.payload);
            })
            .addCase(updateNote.rejected, handleRejected);
    },

});

export default contactSlice.reducer;
