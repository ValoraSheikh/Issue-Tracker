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
    return res.json({
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

  return res.json({
    data: "",
    message: "User created successfully",
    status: 200,
  });
};


export const getUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  const user = await db
    .select()
    .from(usersTable)
    .where(sql`${usersTable.id} = ${id}`);

  return res.json({
    data: user,
    message: "User fetched successfully",
    status: 200,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!id && !name && !email && !password) {
    return res.json({ status: 400, message: "Fill the fields" });
  }

  await db
    .update(usersTable)
    .set({
      name: name,
      email: email,
      password: password,
    })
    .where(eq(usersTable.id, id));

  return res.json({
    data: "",
    message: "User updated successfully",
    status: 200,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  await db.delete(usersTable).where(eq(usersTable.id, id));

  return res.json({
    data: "",
    message: "User deleted successfully",
    status: 200,
  });
};
