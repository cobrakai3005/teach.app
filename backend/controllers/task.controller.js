// import Task from "../models/task.model.js";

import Board from "../models/board.model.js";
import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  const { title, description, difficulty } = req.body;

  if (!title || !description || !difficulty) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields to make Task" });
  }
  const { boardName } = req.params;

  try {
    const board = await Board.findOne({ name: boardName });

    const newTask = await Task.create({
      title,
      description,
      difficulty,
      board: board._id,
    });

    await Board.findByIdAndUpdate(
      board._id,
      {
        $push: { tasks: newTask._id },
      },
      { new: true }
    );

    if (newTask) {
      return res.status(201).json({
        success: true,
        task: newTask,
        message: "Successfully created Task",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong in creating task",
    });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, difficulty } = req.body;
  const { id } = req.params;

  if (!title || !description || !difficulty) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields to make Task" });
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Sorry Could not find that task" });
    }
    const updated = await Task.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (updated)
      return res.status(200).json({ success: true, updateTask: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went  wrong while updating the task",
    });
  }
};

export const updateTaskDiffifulty = async (req, res) => {
  const { difficulty } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Sorry Could not find that task" });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: { difficulty } },
      { new: true }
    );
    if (updated)
      return res.status(200).json({ success: true, updateTask: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went  wrong while updating the task",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { boardName } = req.params;
    const board = await Board.findOne({ name: boardName }).populate("tasks");

    return res.status(200).json({ success: true, tasks: board.tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Could not find tasks" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Could not find that task" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    const updateBoard = await Board.findByIdAndUpdate(
      deleted.board._id,
      {
        $pull: { tasks: deleted._id },
      },
      { new: true }
    );

    return res
      .status(201)
      .json({ success: true, message: "Successfully deleted Task", deleted });
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: "Somthing went wrong in deleting that task",
    });
  }
};
