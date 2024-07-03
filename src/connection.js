import mongoose from "mongoose";
mongoose.set("strictQuery", true);
export async function connectToMongoDB(url) {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log(error);
  }
}
