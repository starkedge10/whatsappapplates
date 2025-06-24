import mongoose, { Schema } from 'mongoose';

const ChatbotSchema = new Schema({
    name: { type: String, required: true, unique: true },
    triggered: { type: Number, default: 0 },
    finished: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    flow: {
        nodes: { type: [Schema.Types.Mixed], default: [] },  // Make nodes an array of mixed types
        edges: { type: [Schema.Types.Mixed], default: [] },  // Make edges an array of mixed types
    },

}, { timestamps: true });

export default mongoose.model('Chatbot', ChatbotSchema);
