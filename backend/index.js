import dotenv from "dotenv";
dotenv.config();
import taskRoutes from "./routes/task.route.js";
import boardRoutes from "./routes/board.route.js";
import userRoutes from "./routes/user.route.js";
import { connectToDatabase } from "./DB/db.config.js";
import express from "express";
import cors from "cors";
const port = process.env.PORT;
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "./models/user.model.js";

const app = express();
// app.use(cors());
app.use(express.json());

//Setup session

app.use(
  session({
    secret: "qwertyuiopkljhgf",
    resave: false,
    saveUninitialized: true,
  })
);

//Iniialise Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: Math.random().toString(36).slice(-8), // placeholder
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Optional: serialize/deserialize if using sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  await User.findById(id).then((user) => done(null, user));
});

//Routes
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/auth", userRoutes);

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${port} http://localhost:${port}`);
});
