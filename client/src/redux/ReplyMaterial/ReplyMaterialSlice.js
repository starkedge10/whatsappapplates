
import { createSlice } from '@reduxjs/toolkit';
import { addReplyMaterial, updateReplyMaterial, deleteReplyMaterial, fetchTextReply, fetchReplyMaterial, fetchTemplateReply, fetchChatbotReply } from './ReplyMaterialThunk.js';


const initialState = {
    replyMaterial: [],
    textReplyMaterial: [],
    templateReplyMaterial: [],
    chatbotReplyMaterial: [],
    loading: false,
    error: null,
};

const replyMaterialSlice = createSlice({
    name: 'replyMaterial',
    initialState,
    reducers: {
        setReplyMaterial: (state, action) => {
            state.replyMaterial = action.payload;
        },
    },
    extraReducers: (builder) => {

        // fetch chatbotReply
        builder.addCase(fetchChatbotReply.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchChatbotReply.fulfilled, (state, action) => {
            state.loading = false;
            state.chatbotReplyMaterial = action.payload;
        });

        builder.addCase(fetchChatbotReply.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })



        //fetch templateReply

        builder.addCase(fetchTemplateReply.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchTemplateReply.fulfilled, (state, action) => {
            state.loading = false;
            state.templateReplyMaterial = action.payload;
        });

        builder.addCase(fetchTemplateReply.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });



        // fetch ReplyMaterial
        builder.addCase(fetchReplyMaterial.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchReplyMaterial.fulfilled, (state, action) => {
            state.loading = false;
            state.replyMaterial = action.payload;

        });

        builder.addCase(fetchReplyMaterial.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });


        //fetch text reply
        builder.addCase(fetchTextReply.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTextReply.fulfilled, (state, action) => {
            state.loading = false;
            state.textReplyMaterial = action.payload;
        });
        builder.addCase(fetchTextReply.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // Add
        builder.addCase(addReplyMaterial.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addReplyMaterial.fulfilled, (state, action) => {
            state.loading = false;
            state.replyMaterial.push(action.payload);
        });
        builder.addCase(addReplyMaterial.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update
        builder.addCase(updateReplyMaterial.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateReplyMaterial.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.replyMaterial.findIndex((item) => item._id === action.payload._id);
            if (index !== -1) {
                state.replyMaterial[index] = action.payload;
            }
        });
        builder.addCase(updateReplyMaterial.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(deleteReplyMaterial.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteReplyMaterial.fulfilled, (state, action) => {
            state.loading = false;
            state.replyMaterial = state.replyMaterial.filter((item) => item._id !== action.payload);
        });
        builder.addCase(deleteReplyMaterial.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { setReplyMaterial } = replyMaterialSlice.actions;
export default replyMaterialSlice.reducer;
