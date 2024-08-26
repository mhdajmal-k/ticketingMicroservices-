import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../dbModel/userModel";
import bcrypt from "bcryptjs";
import { tokenCreation } from "../../util/jwt";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").trim().isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("message must be strong"),
  ],
  async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      res.status(400).send("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("user Exists");
      res.status(400).send("user Already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = tokenCreation(user.id, user.email);
    console.log(token);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(201)
      .send({ id: user._id, email: user.email });
  }
);

export { router as signUpRouter };
