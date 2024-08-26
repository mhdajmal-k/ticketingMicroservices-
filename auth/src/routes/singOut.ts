import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Signed out successfully" });
});

export { router as signOutRouter };
