import Campaign from "../models/campaign.js";



export const fetchCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const updateCampaign = async (req, res) => {
    try {
        const { ...updatedCampaign } = req.body;
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: "Campaign id is required" });
        }
        const updatedData = await Campaign.findByIdAndUpdate(id, updatedCampaign, { new: true });
        if (!updatedData) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Campaign id is required" });
        }

        const deleted = await Campaign.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        res.json({ message: "Campaign deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

