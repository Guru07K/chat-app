import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/database.config';
import dns from 'dns';
import authRoute from './routes/auth.route';
import { ErrorMiddleware } from './middleware/error.middleware';


dns.setServers(["8.8.8.8", "1.1.1.1"])
dotenv.config();
const PORT = process.env.PORT || 7070;


const app = express();
app.use(express.json());
app.use(cookieParser());

const errorMiddleware = new ErrorMiddleware();



app.use('/api/v1/auth', authRoute);


// Error handling middleware
app.use(errorMiddleware.globalErrorMiddleware);

app.listen(PORT, () => {
    console.log(`>>>>>>>>>>>> Server is running on port ${PORT} <<<<<<<<<<<<<<<<`);
    connectToDatabase()
});