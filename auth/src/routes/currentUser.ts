import express, { Request, Response } from "express";
import { currentUser } from "../../middilware/logined";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.json("not found need to login");
    }

    res.json(req.currentUser);
  }
);

export default router;
