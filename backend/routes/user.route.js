import express from "express";
import {
  getMe,
  logout,
  signIn,
  signUp,
} from "../controllers/user.controller.js";
import { protectThisRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/", protectThisRoute, getMe);
router.get("/logout", logout);
// 1. Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Handle callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    // // You can redirect or send token as response

    return res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
