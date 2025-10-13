import express from "express";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", (req, res) => {
  res.send("Login endpoint");
});

router.post("/logout", (req, res) => {
  res.send("Logout endpoint");
});

export default router;
