import { createSlice } from '@reduxjs/toolkit';
import { fetchTemplates, deleteTemplate, createTemplate, editTemplate } from './templateThunks';

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    loading: false,
    error: null,
    deleteStatus: 'idle',
  },

  reducers: {
    clearTemplates(state) {
      state.templates = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload.templates;
        state.loading = false;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
        state.deleteStatus = 'success';
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(editTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTemplate.fulfilled, (state, action) => {
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { clearTemplates } = templateSlice.actions;

export default templateSlice.reducer;
