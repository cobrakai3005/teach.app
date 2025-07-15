import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskDiffifulty,
} from "../controllers/task.controller.js";
import { protectThisRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:boardName", createTask);
router.get("/:boardName", getTasks);
router.put("/:id", updateTask);
router.patch("/:id", updateTaskDiffifulty);
router.delete("/:id", deleteTask);

export default router;
