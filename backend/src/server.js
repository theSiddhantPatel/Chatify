// import express from "express";
// import cookieParser from "cookie-parser";
// import path from "path";
// import cors from "cors";

// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { connectDB } from "./lib/db.js";
// import { ENV } from "./lib/env.js";
// import { app, server } from "./lib/socket.js";

// const __dirname = path.resolve();

// // const PORT = ENV.PORT || 3000;
// const PORT = process.env.PORT || 3000;

// app.use(express.json({ limit: "5mb" })); // req.body
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // make ready for deployment
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// server.listen(PORT, () => {
//   console.log("Server running on port: " + PORT);
//   connectDB();
// });

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Railway provides dynamic PORT
const PORT = process.env.PORT || 3000;

// ====================
// Middlewares
// ====================

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// In Railway production, frontend + backend are same origin
if (process.env.NODE_ENV === "production") {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: ENV.CLIENT_URL,
      credentials: true,
    }),
  );
}

// ====================
// API Routes
// ====================

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ====================
// Serve Frontend (Production Only)
// ====================

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ====================
// Start Server
// ====================

server.listen(PORT, async () => {
  console.log("Server running on port: " + PORT);
  await connectDB();
});
