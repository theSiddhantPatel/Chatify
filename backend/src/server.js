import express from "express"; //type:module in package.json time 11.10
import path from "path";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json()); //req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment t 0033
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
  connectDB();
});
