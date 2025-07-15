import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongodb connected ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    console.log("Failed To Connect  with Mongodb");
    process.exit(1);
  }
};
