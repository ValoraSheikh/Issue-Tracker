import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface JwtProps {
  id: string;
  name: string;
  email: string;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!process.env.JWT_SECRET) {
    return res.json({
      data: "",
      message: "SECRET not set",
      status: 500,
    });
  }

  const token = req.cookies.auth;

  if (!token) {
    return res.json({
      data: "",
      message: "No token",
      status: 401,
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.json({
      data: "",
      message: "SECRET not set",
      status: 500,
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtProps;

  req.user = {
    id: decode?.id,
    name: decode?.name,
    email: decode?.email,
  };

  next();
}

export default authMiddleware;
