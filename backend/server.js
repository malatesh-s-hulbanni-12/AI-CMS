import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import devRouter from "./routes/devRouter.js";
import createrRouter from "./routes/createrRouter.js";
import cdCreaterRouter from "./routes/cdCreaterRouter.js";
import adminRouter from "./routes/adminRouter.js";
import notificationRouter from "./routes/notificationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Add your Render URL to allowedOrigins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ai-cms-creaters.vercel.app",
  "https://ai-cms-admin.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "creatertoken",
      "token",
      "admintoken",
      "devtoken",
    ],
    credentials: true,
  }),
);

// High limits for PDF metadata and large imports
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to Database
await connectDB();

app.get("/", (req, res) => {
  res.send("CDMS Server is active and flying.");
});

// API Routes - SPECIFIC routes MUST come BEFORE general routes
app.use("/api/dev", devRouter);
app.use("/api/creater/notifications", notificationRouter);  // Specific route FIRST
app.use("/api/creater/cd", cdCreaterRouter);  // Specific route SECOND
app.use("/api/creater", createrRouter);  // General route LAST
app.use("/api/admin", adminRouter);
app.use('/api/notifications', notificationRouter);

// Global Error Handler for cleaner logs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is flying on port ${PORT}`);
});
