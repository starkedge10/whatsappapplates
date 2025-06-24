
import chatbots from "../models/chatbots.js";
import ReplyMaterial from "../models/ReplyMaterial.js";



export const addChatbot = async (req, res) => {
    try {

        const chatbot = new chatbots(req.body);
        const savedChatbot = await chatbot.save();


        const replyMaterialData = {
            name: savedChatbot.name,
            replyType: 'Chatbot',
            content: {
                text: null,
                url: null,
                materialModel: 'Chatbot',
                materialId: savedChatbot._id,
            },
            createdAt: new Date(),
        };

        const savedReplyMaterial = await ReplyMaterial.create(replyMaterialData);

        res.status(201).json(savedChatbot);
    } catch (error) {
        console.error('Add Chatbot Error:', error.message);
        res.status(500).json({ message: 'Failed to create chatbot', error: error.message });
    }
};




export const getChatbots = async (req, res) => {
    try {
        const chatbot = await chatbots.find();

        const existingReplyMaterials = await ReplyMaterial.find({ replyType: 'Chatbot' });

        const replyMaterialIds = existingReplyMaterials.map(rm =>
            String(rm.content?.materialId?._id)
        );

        const newReplyMaterials = chatbot
            .filter(chatbot => !replyMaterialIds.includes(String(chatbot._id)))
            .map(chatbot => ({
                name: chatbot.name,
                replyType: 'Chatbot',
                content: {
                    text: null,
                    url: null,
                    materialModel: 'Chatbot',
                    materialId: chatbot._id,
                },
                createdAt: new Date(),
            }));

        if (newReplyMaterials.length > 0) {
            await ReplyMaterial.insertMany(newReplyMaterials);
        }

        res.status(200).json(chatbot);
    } catch (error) {
        console.error('Get Chatbots Error:', error.message);
        res.status(500).json({
            message: 'Failed to fetch chatbots',
            error: error.message,
        });
    }
};


export const updateChatbot = async (req, res) => {
    try {
        const { id } = req.params;
        const flow = req.body;

        const updatedChatbot = await chatbots.findByIdAndUpdate(
            id,
            { $set: { "flow.nodes": flow.nodes, "flow.edges": flow.edges } },
            { new: true }
        );

        if (!updatedChatbot) {
            return res.status(404).json({ message: 'Chatbot not found' });
        }

        res.json(updatedChatbot);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};




export const deleteChatbot = async (req, res) => {
    try {
        const { id } = req.params;
        const chatbot = await chatbots.findByIdAndDelete(id);
        res.json(chatbot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const updateChatbotName = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;
        const updatedChatbot = await chatbots.findByIdAndUpdate(id, { name: newName }, { new: true });
        res.json(updatedChatbot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


