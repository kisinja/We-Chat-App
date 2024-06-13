import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => console.log("Database connected successfully"));
    } catch (error) {
        console.log(error.message);
    }
};

export { connectDb };