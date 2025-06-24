import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
    replyType: {
        type: String,
        required: true,
        enum: ['Text', 'Image', 'Document', 'Video', 'Template', 'Chatbot'],
    },
    name: {
        type: String,
        required: true,
    },
    content: {
        type: new mongoose.Schema({
            text: { type: String },
            url: { type: String },

            materialModel: {
                type: String,
                enum: ['Text', 'Image', 'Document', 'Video', 'Template', 'Chatbot'],
                required: true,
            },
            materialId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'content.materialModel',
            },
        }, { _id: false }),
    },
}, { timestamps: true });


ReplySchema.pre('save', function (next) {
    if (this.replyType && this.content) {
        this.content.materialModel = this.replyType;
    }
    next();
});

export default mongoose.model('ReplyMaterial', ReplySchema);
