import { AuthController } from '../controller/auth.controller';
import express from 'express';
import { Authenticator } from '../middleware/authenticator.middleware';

const router = express.Router();

const authController = new AuthController();
const authenticator = new Authenticator();

router.post('/signup', authController.signUpUser);
router.post('/login', authController.loginUser);
router.post('/userList', authenticator.isAuthenticated, authController.getUserList);
router.delete('/removeUser', authenticator.isAuthenticated, authController.removeUser);
router.put('/updateUser', authenticator.isAuthenticated, authController.updateUser);

router.get('/verify-email', authController.verifyEmail);



export default router;