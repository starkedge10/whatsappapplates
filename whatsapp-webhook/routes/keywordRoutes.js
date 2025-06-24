import { Router } from 'express';
const router = Router();
import { addKeyword, fetchKeywords, deleteKeywords, updateKeyword } from '../controllers/keywordController.js';


router.post('/addKeyword', addKeyword);
router.get('/keywords', fetchKeywords)
router.delete('/deleteKeyword/:id', deleteKeywords)
router.put('/updateKeyword/:id', updateKeyword)



export default router