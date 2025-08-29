import User from "../models/user.model.js";
import mongoose from "mongoose";

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }

  try {
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser)
      return res
        .status(400)
        .json({ success: false, message: "This email is already taken" });

    const create = await User.create({ name, email, password });
    const token = await create.generateToken();

    return res.status(201).json({
      success: true,
      message: "User Created",
      data: {
        token,
        user: create,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });

  try {
    const exist = await User.findOne({ email });

    const matchPassword = await exist.matchPassword(password);
    if (!exist || !matchPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = await exist.generateToken();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        user: exist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMe(req, res) {
  return res
    .status(200)
    .json({ success: true, message: "Your profile", data: req.user });
}
export async function logout(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
