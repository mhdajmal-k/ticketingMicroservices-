import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies || {};
  console.log(token, "is the token");
  if (!token) {
    req.currentUser = null;
    return next();
  }
  console.log("hi");
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    console.log(payload, "is the payload");
    req.currentUser = payload;
  } catch (err) {
    req.currentUser = null;
  }

  next();
};

export { currentUser };
