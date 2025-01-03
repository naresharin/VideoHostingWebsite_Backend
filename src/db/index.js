import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nDB Connection Succesful!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("\n DB Connection Failed\n",error)
        process.exit(1)
    }
}

export default connectDB