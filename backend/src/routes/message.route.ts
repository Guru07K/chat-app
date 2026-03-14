import express from 'express';
import { MessageController } from '../controller/message.controller';
import { Authenticator } from '../middleware/authenticator.middleware';

const router = express.Router();

const messageController = new MessageController();
const authenticator = new Authenticator();

// Protected routes
router.use(authenticator.isAuthenticated);

router.get('/contacts', messageController.getAllContacts)
router.get('/chats', messageController.getPartnersChat)
router.get('/:id', messageController.getMessagesByUserId)
router.post('/send/:id', messageController.sendMessage)

export default router;