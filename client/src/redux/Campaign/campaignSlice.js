import { createSlice } from '@reduxjs/toolkit';
import {
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} from './campaignThunks';

const initialState = {
    campaigns: [],
    loading: false,
    error: null,
};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // fetch campaigns
            .addCase(fetchCampaigns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.campaigns = action.payload;
                state.loading = false;
            })
            .addCase(fetchCampaigns.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // create campaign
            .addCase(createCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                state.campaigns.push(action.payload);
                state.loading = false;
            })
            .addCase(createCampaign.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // update campaign
            .addCase(updateCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                const index = state.campaigns.findIndex(
                    (c) => c._id === action.payload._id
                );
                if (index !== -1) {
                    state.campaigns[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateCampaign.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // delete campaign
            .addCase(deleteCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                state.campaigns = state.campaigns.filter(c => c._id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteCampaign.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default campaignSlice.reducer;
