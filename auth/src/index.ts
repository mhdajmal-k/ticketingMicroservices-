import express, { Response, Request } from "express";
import currentUserRouter from "./routes/currentUser";
import { singInRouter } from "./routes/singIn";
import { signUpRouter } from "./routes/singUp";
import { signOutRouter } from "./routes/singOut";
import { errorHandler } from "./middleware/error-handiler";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(signUpRouter);
app.use(singInRouter);
app.use(currentUserRouter);
app.use(signOutRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("not fount");
});
app.use(errorHandler);

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("authDB connected");
  } catch (err) {
    console.log(err);
  }
};
dbConnect();
app.listen(3000, () => {
  console.log("server is running on port 3000");
  console.log("skaffold testing...");
});
