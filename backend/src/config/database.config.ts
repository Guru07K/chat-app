import mongoose from "mongoose";

export const connectToDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URI!)
        .then((con) => {
            console.log(`>>>>>>>>>>>> MongoDB Connected Successfully <<<<<<<<<<<<<<<<`);
        }).catch((err) => {
            console.log("MongoDB connection error ==>", err)
            process.exit(1);
        });
}