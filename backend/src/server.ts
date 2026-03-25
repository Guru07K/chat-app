import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/database.config';
import dns from 'dns';
import authRoute from './routes/auth.route';
import { ErrorMiddleware } from './middleware/error.middleware';
import messageRouter from './routes/message.route';
import cors from 'cors';


dns.setServers(["8.8.8.8", "1.1.1.1"])
dotenv.config();
const PORT = process.env.PORT || 7070;


const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const errorMiddleware = new ErrorMiddleware();


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/message', messageRouter);

// Error handling middleware
app.use(errorMiddleware.globalErrorMiddleware);

app.listen(PORT, () => {
    console.log(`>>>>>>>>>>>> Server is running on port ${PORT} <<<<<<<<<<<<<<<<`);
    connectToDatabase()
});