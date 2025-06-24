import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';





// CREATE TEMPLATE
export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        axios.post(`/createTemplate`, payload),
        {
          pending: 'Creating template...',
          success: 'Template created successfully!',
          error: 'Failed to create template.',
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// EDIT TEMPLATE
export const editTemplate = createAsyncThunk(
  'templates/editTemplate',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        axios.post(`/editTemplate/${id}`, payload),
        {
          pending: 'Updating template...',
          success: 'Template updated successfully!',
          error: 'Failed to update template.',
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// FETCH TEMPLATES
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await
        axios.get('/templates')


      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// DELETE TEMPLATE
export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      await toast.promise(
        axios.delete(`/deleteTemplate?id=${id}&name=${encodeURIComponent(name)}`),
        {
          pending: 'Deleting template...',
          success: 'Template deleted successfully!',
          error: 'Failed to delete template.',
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
