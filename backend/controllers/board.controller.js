import Board from "../models/board.model.js";
import User from "../models/user.model.js";

export const createBoard = async (req, res) => {
  const { name } = req.body;
  const loggedInUser = req.user;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Please write a proper name of the board",
    });
  }
  try {
    const board = await Board.create({ name });

    if (board) {
      const user = await User.findByIdAndUpdate(
        loggedInUser._id,
        {
          $push: { boards: board._id },
        },
        { new: true }
      );
      await Board.findByIdAndUpdate(board._id, {
        userId: user._id,
      });

      return res.status(200).json({
        success: true,
        message: "Board created Successfully",
        board,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Somthing went wrong while creating the board",
      board: null,
    });
  }
};

export const deleteBoard = async (req, res) => {
  const { id } = req.params;

  const board = await Board.findById(id);
  if (!board) {
    return res
      .status(400)
      .json({ success: false, message: "Could not find that board " });
  }
  try {
    const b = await Board.findByIdAndDelete(id);
    if (!b) {
      return res
        .status(400)
        .json({ success: false, message: "Could not Delete that board " });
    }

    return res
      .status(200)
      .json({ success: true, message: "Board Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong while deleting that board",
    });
  }
};

export const getBoards = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser._id).populate("boards");

    return res
      .status(200)
      .json({ boards: user.boards, success: true, message: "All Boards" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Somthing went wrong in fetching all then boards",
    });
  }
};
