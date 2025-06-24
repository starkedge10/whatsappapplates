import { Router } from 'express';
const router = Router();
import { fetchChat, fetchAllChats } from '../controllers/chatController.js';




router.get('/chat/:phone', fetchChat);
router.get('/chat', fetchAllChats);



export default router