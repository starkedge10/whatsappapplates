
import mongoose from 'mongoose';

const keywordActionSchema = new mongoose.Schema({


    keywords: {
        type: [String],
        required: true,
    },

    matchingMethod: {
        type: String,
        enum: ['fuzzy', 'exact', 'regex'],
        required: true,
    },

    fuzzyThreshold: {
        type: Number,
        default: 70,
    },

    replyMaterial: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReplyMaterial',
    }],

    triggered: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });

export default mongoose.model('KeywordAction', keywordActionSchema);
