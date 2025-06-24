import { Router } from 'express';
const router = Router();
import { verifyWebhook, handleWebhook} from '../controllers/webhookControllers.js';


router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);
// router.post('/sendTemplateMessages', sendTemplateMessages);
// router.post('/sendTextMessage', sendTextMessages);



export default router;
