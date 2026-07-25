import mongoose from "mongoose";

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI) 
       console.log("database connected successfully");
    } catch (error) {
        console.log("database connection failed",error.message);
        //If not exited,The Node.js process will not terminate. 
        // Your Express server will still boot up and listen on its port (e.g., port 5000/5001), 
        // despite having no database connection.
        process.exit(1);
    }
}

export default connectDB;