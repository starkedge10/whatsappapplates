import { Router } from 'express';
const router = Router();
import { addChatbot, getChatbots, updateChatbot, deleteChatbot, updateChatbotName } from '../controllers/chatbotsController.js';


router.post('/addChatbot', addChatbot);
router.get('/getChatbots', getChatbots);
router.put('/updateChatbot/:id', updateChatbot);
router.delete('/deleteChatbot/:id', deleteChatbot);
router.put('/updateChatbotName/:id', updateChatbotName);






export default router;
