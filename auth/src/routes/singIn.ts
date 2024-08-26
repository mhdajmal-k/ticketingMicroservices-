import express, { Request, Response } from "express";
import { User } from "../../dbModel/userModel";
import bcrypt from "bcryptjs";
import { tokenCreation } from "../../util/jwt";
const router = express.Router();

router.post("/api/users/signin", async (req: Request, res: Response) => {
  console.log("hi");
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (email.trim() == "" || password.trim() == "") {
    res.json("email and password must be required");
    return;
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(401).json("email not exist need to login");
    return;
  }
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    res.status(401).json("Invalid password");
    return;
  }
  const token = tokenCreation(existingUser.id, existingUser.email);
  console.log(token);
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 360000,
    })
    .status(201)
    .send({ id: existingUser._id, email: existingUser.email });
});

export { router as singInRouter };
