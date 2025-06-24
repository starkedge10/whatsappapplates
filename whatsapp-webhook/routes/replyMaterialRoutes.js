import { Router } from 'express';
const router = Router();
import { addReplyMaterial, fetchTextReply, updateReplyMaterial, deleteReplyMaterial, fetchReplyMaterial, fetchTemplateReply, fetchChatbotReply } from '../controllers/replyMaterialController.js';

// router.get('/replyMaterial/textReply')
router.post('/addReplyMaterial', addReplyMaterial)
router.get('/replyMaterial/textReply', fetchTextReply)
router.put('/updateReplyMaterial/:id', updateReplyMaterial)
router.delete('/deleteReplyMaterial/:id', deleteReplyMaterial)
router.get('/replyMaterial', fetchReplyMaterial)
router.get('/replyMaterial/templateReply', fetchTemplateReply)
router.get('/replyMaterial/chatbotReply', fetchChatbotReply)



export default router;