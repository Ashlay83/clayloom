import mongoose  from "mongoose";
import 'dotenv/config';

const mongoURI= process.env.MONGODB_URI;
const port = process.env.PORT;


const connectDB=async  ():Promise<void> =>{

    if(!mongoURI){
        console.error("MongoDB connection Failed : MONGOURI NOT recognized");
        process.exit(1);
    }
    try{
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch(error){
        const errorMessage= error instanceof Error ? error.message:String(error);
        console.error('MongoDB connection Failed:',errorMessage);
        process.exit(1);
    }
};
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET is not set');
const jwt_secret: string = secret;

export {connectDB, port, jwt_secret};
