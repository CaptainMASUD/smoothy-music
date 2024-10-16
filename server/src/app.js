import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

// Middleware to handle JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware for cookie parsing
app.use(cookieParser());

// Import user routes
import userRouter from "./routes/users.routes.js";
// Import audio routes
import audioRouter from "./routes/audio.routes.js"; 

// Use user routes
app.use("/api/v1/users", userRouter);
// Use audio routes
app.use("/api/v1/audio", audioRouter); 

export { app };
