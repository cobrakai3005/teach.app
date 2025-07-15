import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name should be atleast 4 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|\"[a-zA-Z0-9.+!% -]{1,64}\")@[a-zA-Z0-9][a-zA-Z0-9.-]+(.[a-z]{2,}|.[0-9]{1,})$/,

        "Please use a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      minLength: 5,
      // select: false,
      required: [true, "Password is required"],
    },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    // isOAuth: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
};
const User = mongoose.model("User", userSchema);

export default User;
