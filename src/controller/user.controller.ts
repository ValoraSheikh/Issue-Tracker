import type { Request, Response } from "express";
import { db } from "../db/connections";
import { usersTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser[0]) {
    return res.status(400).json({
      data: "",
      message: "User already exists",
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(usersTable).values({
    name: name,
    email: email,
    password: hashedPassword,
  });

  return res.status(200).json({
    data: "",
    message: "User created successfully",
    status: 200,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user[0]) {
    return res.status(404).json({
      data: "",
      message: "User not found",
      status: 404,
    });
  }

  const { password: hashedPassword } = user[0];

  const isPasswordValid = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordValid) {
    return res.status(401).json({
      data: "",
      message: "Invalid Credentials",
      status: 401,
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      data: "",
      message: "SECRET not set",
      status: 500,
    });
  }

  const token = jwt.sign(
    { id: user[0].id, name: user[0].name, email: user[0].email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  req.user = {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
  };

  res.cookie("auth", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    data: "",
    message: "Login successful",
    status: 200,
  });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  if (!id) {
    return res.status(401).json({
      data: "",
      message: "user id is required",
      status: 200,
    });
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(sql`${usersTable.id} = ${id}`);

  return res.status(200).json({
    data: user,
    message: "User fetched successfully",
    status: 200,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!id && !name && !email && !password) {
    return res
      .status(400)
      .json({ data: "", status: 400, message: "Fill the fields" });
  }

  await db
    .update(usersTable)
    .set({
      name: name,
      email: email,
      password: password,
    })
    .where(eq(usersTable.id, id));

  return res.status(200).json({
    data: "",
    message: "User updated successfully",
    status: 200,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  await db.delete(usersTable).where(eq(usersTable.id, id));

  return res.status(200).json({
    data: "",
    message: "User deleted successfully",
    status: 200,
  });
};
