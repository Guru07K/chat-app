import { AuthController } from '../controller/auth.controller';
import express from 'express';
import { Authenticator } from '../middleware/authenticator.middleware';

const router = express.Router();

const authController = new AuthController();
const authenticator = new Authenticator();

// Public routes
router.post('/signup', authController.signUpUser);
router.post('/login', authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

// Protected routes
router.use(authenticator.isAuthenticated);

router.post('/userList', authController.getUserList);
router.delete('/removeUser', authController.removeUser);
router.put('/updateUser', authController.updateUser);




export default router;