import express from "express";
import { protectThisRoute } from "../middleware/auth.middleware.js";
import {
  createBoard,
  deleteBoard,
  getBoards,
} from "../controllers/board.controller.js";

const router = express.Router();

router.get("/", protectThisRoute, getBoards);
router.post("/", protectThisRoute, createBoard);
router.delete("/:id", protectThisRoute, deleteBoard);

export default router;
