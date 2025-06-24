import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    message: mongoose.Schema.Types.Mixed,
    messageType: {
        type: String,
        enum: ['received', 'sent', 'delivered', 'read'],
       
    },

});

export default mongoose.model('chat', chatSchema);
