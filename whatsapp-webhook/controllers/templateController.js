import axios from 'axios';
import Template from '../models/templates.js'
import ReplyMaterial from "../models/ReplyMaterial.js";

import dotenv from 'dotenv';
dotenv.config();


const accessToken = process.env.WHATSAPP_API_TOKEN;
const businessId = process.env.WHATSAPP_BUSINESS_ID;
const baseURL = `https://graph.facebook.com/v22.0/${businessId}/message_templates`;






// ------------------------- Fetch Templates -------------------------
export const fetchTemplates = async (req, res) => {
    try {
        const response = await axios.get(`${baseURL}?access_token=${accessToken}&limit=1000`);
        const templates = response.data.data;

        const operations = templates.map(t => ({
            updateOne: {
                filter: { id: t.id },
                update: {
                    $set: { ...t, updatedAt: new Date() }
                },
                upsert: true
            }
        }));

        await Template.bulkWrite(operations);

        const visibleTemplates = await Template.find({ deleted: { $ne: true } });
        const existingReplyMaterials = await ReplyMaterial.find({ replyType: 'Template' });

        const replyMaterialIds = existingReplyMaterials.map(rm =>
            String(rm.content?.materialId?._id )
        );

        const newReplyMaterials = visibleTemplates
            .filter(template => !replyMaterialIds.includes(String(template._id)))
            .map(template => ({
                name: template.name,
                replyType: 'Template',
                content: {
                    text: null,
                    url: null,
                    materialModel: 'Template',
                    materialId: template._id,
                },
                createdAt: new Date(),
            }));

        if (newReplyMaterials.length > 0) {
            await ReplyMaterial.insertMany(newReplyMaterials);
        }

        res.status(200).json({ templates: visibleTemplates });
    } catch (error) {
        console.error('Fetch Error:', error.message);
        res.status(500).json({
            message: 'Failed to fetch templates',
            error: error.response?.data || error.message,
        });
    }
};



// ------------------------- Create Template -------------------------
export const createTemplate = async (req, res) => {
    try {
        const payload = req.body;


        await axios.post(baseURL, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });


        const fetchResponse = await axios.get(`${baseURL}?access_token=${accessToken}&limit=1000`);
        const templates = fetchResponse.data.data;

        const created = templates.find(t => t.name === payload.name);

        if (!created) {
            return res.status(404).json({ message: 'Template created but not found in fetch.' });
        }

        const newTemplateData = {
            ...created,
            createdAt: new Date(),
        };

        const savedTemplate = await Template.create(newTemplateData);


        const replyMaterialData = {
            name: savedTemplate.name,
            replyType: 'Template',
            content: {
                text: null,
                url: null,
                materialModel: 'Template',
                materialId: savedTemplate._id,
            },
            createdAt: new Date(),

        };

        const savedReplyMaterial = await ReplyMaterial.create(replyMaterialData);


        res.status(201).json({ template: savedTemplate, replyMaterial: savedReplyMaterial });
    } catch (error) {
        console.error('Create Error:', error.message);
        res.status(500).json({
            message: 'Failed to create template',
            error: error.response?.data || error.message,
        });
    }
};



// ------------------------- Edit Template -------------------------
export const editTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;


        const response = await axios.post(`https://graph.facebook.com/v22.0/${id}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const updatedData = {
            ...response.data,
            payload,
            updatedAt: new Date(),
        };

        const updated = await Template.findOneAndUpdate({ id }, updatedData, { new: true });

        res.status(200).json({ template: updated });
    } catch (error) {
        console.error('Edit Error:', error.message);
        res.status(500).json({
            message: 'Failed to update template',
            error: error.response?.data || error.message,
        });
    }
};

// ------------------------- Delete Template -------------------------
export const deleteTemplate = async (req, res) => {
    try {
        const { id, name } = req.query;

        if (!id || !name) {
            return res.status(400).json({ message: 'Missing template id or name' });
        }

        const deleteUrl = `${baseURL}?hsm_id=${id}&name=${name}&access_token=${accessToken}`;

        const response = await axios.delete(deleteUrl);

        if (response.data.success) {
            await Template.deleteOne({ id });

            res.status(200).json({ success: true, id });
        } else {
            throw new Error('Delete failed on WhatsApp');
        }
    } catch (error) {
        console.error('Delete Error:', error.message);
        res.status(500).json({
            message: 'Failed to delete template',
            error: error.response?.data || error.message,
        });
    }
};

