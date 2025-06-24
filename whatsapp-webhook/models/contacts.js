import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    time: { type: Date, default: Date.now }
}, { _id: false });

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    attributes: [attributeSchema],
    notes: [noteSchema],
    tags: [String]
}, {
    timestamps: true
});

export default mongoose.model('Contact', contactSchema);
