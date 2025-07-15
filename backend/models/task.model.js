import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Please Enter atleast 4 Characters in the Title"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Please Enter atleast 4 Characters in the Title"],
    },
    difficulty: {
      type: String,
      trim: true,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
