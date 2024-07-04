import express from "express";
import urlRoute from "./routes/url.routes.js";
import { connectToMongoDB } from "./connection.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));
//tell server to accept json data, earlier we had to use body-parser but now express handles it auto.
app.use(express.json({ limit: "16kb" }));
//to get data from urls, we need to do config of urlencoding.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//here extended helps us to receive data in nested objects, a complex format.
//static configuration helps us to store some data like img on your server itself (public folder).
app.use(express.static("public"));


const PORT = 8001;
const MONGO_URL = process.env.MONGO_CONNECTION_STRING;

(async () => {
  try {
    await connectToMongoDB(MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB", error));

    app.use(express.json());
    app.use("/", urlRoute);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
})();
