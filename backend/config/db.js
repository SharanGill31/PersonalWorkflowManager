
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sharangill:3108023600@cluster0.ml7kl.mongodb.net/TaskPulse';
        await mongoose.connect(mongoURI);
        console.log('DB CONNECTED');
    } catch (error) {
        console.error('DB CONNECTION ERROR:', error);
        process.exit(1);
    }
};
