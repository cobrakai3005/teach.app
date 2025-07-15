import mongoose from "mongoose";

const boardSchhema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
    minLength: [4, "Write atleast 4 characters in name"],
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Board = mongoose.model("Board", boardSchhema);

export default Board;
