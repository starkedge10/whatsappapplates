import keywords from "../models/keywords.js";


export const addKeyword = async (req, res) => {
    try {
        // Create the keyword first
        const keywordData = await keywords.create(req.body);

        // Find it again and populate replyMaterial before sending response
        const populatedKeyword = await keywords.findById(keywordData._id).populate('replyMaterial');

        res.status(201).json(populatedKeyword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const fetchKeywords = async (req, res) => {
    try {
        const keywordsData = await keywords.find().populate('replyMaterial');
        res.status(200).json(keywordsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteKeywords = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await keywords.findByIdAndDelete(id);
        res.status(200).json(deleted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateKeyword = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...updatedData } = req.body;
        const updated = await keywords.findByIdAndUpdate(id, updatedData, { new: true });
        const populatedKeyword = await keywords.findById(updated._id).populate('replyMaterial');
        res.status(200).json(populatedKeyword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

