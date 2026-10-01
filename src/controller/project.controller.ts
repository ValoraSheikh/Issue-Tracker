import type { Request, Response } from "express";
import { db } from "../db/connections";
import { projectTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  await db.insert(projectTable).values({
    name: name,
    description: description,
    ownerId: req.user.id,
  });

  return res.status(200).json({
    res: "",
    message: "Projecy created successfully",
    status: 200,
  });
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await db.select().from(projectTable);

  return res.status(200).json({
    data: projects,
    message: "All Projects fetched successfully",
    status: 200,
  });
};

export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await db
    .select()
    .from(projectTable)
    .where(sql`${projectTable.id} = ${id}`);

  return res.status(200).json({
    data: project,
    message: "Project fetched successfully",
    status: 200,
  });
};

export const updateProject = async (req: Request, res: Response) => {
  const { name } = req.body;

  const { id: projectId } = req.params;

  await db
    .update(projectTable)
    .set({
      name: name,
    })
    .where(sql`${projectTable.id} = ${projectId}`);

  return res.status(200).json({
    data: "",
    message: "Project updated successfully",
    status: 200,
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;

  await db.delete(projectTable).where(sql`${projectTable.id} = ${projectId}`);

  return res.status(200).json({
    data: "",
    message: "Project deleted successfully",
    status: 200,
  });
};
