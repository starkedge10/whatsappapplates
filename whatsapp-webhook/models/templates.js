import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    language: Object,
    status: String,
    category: String,
    components: Array,
    parameter_format: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    deleted: { type: Boolean, default: false }
});

const Template = mongoose.model('Template', templateSchema);
export default Template;
