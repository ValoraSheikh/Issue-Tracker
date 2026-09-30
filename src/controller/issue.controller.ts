import type { Request, Response } from "express";
import { db } from "../db/connections";
import { issuesTable, projectTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const createIssue = async (req: Request, res: Response) => {
  const {
    name,
    description,
    projectId,
    priority,
    dueDate,
    assigneeId,
    labels,
  } = req.body;

  await db.insert(issuesTable).values({
    name: name,
    description: description,
    priority: priority,
    labels: labels,
    projectId: projectId,
    assigneeId: assigneeId,
    dueDate: dueDate,
  });

  return res.json({
    res: "",
    message: "Issue created successfully",
    status: 200,
  });
};

export const getProjectIssues = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const user = await db
    .select()
    .from(issuesTable)
    .where(sql`${issuesTable.projectId} = ${projectId}`);

  return res.json({
    res: user,
    message: "Issues fetched successfully",
    status: 200,
  });
};

export const getIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await db
    .select()
    .from(issuesTable)
    .where(sql`${issuesTable.id} = ${id}`);

  return res.json({
    res: user,
    message: "Issue fetched successfully",
    status: 200,
  });
};

export const updateIssue = async (req: Request, res: Response) => {
  const { name, description, priority, dueDate, assigneeId, labels } = req.body;

  const { id } = req.params;

  if (
    !id &&
    !name &&
    !description &&
    !priority &&
    !dueDate &&
    !assigneeId &&
    !labels
  ) {
    return res.json({ status: 400, message: "Fill the fields" });
  }

  await db
    .update(issuesTable)
    .set({
      name,
      description,
      priority,
      dueDate,
      assigneeId,
      labels,
    })
    .where(sql`${issuesTable.id} = ${id}`);

  return res.json({
    res: "",
    message: "Issue updated successfully",
    status: 200,
  });
};

export const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.delete(issuesTable).where(sql`${issuesTable.id} = ${id}`);

  return res.json({
    res: "",
    message: "Issue deleted successfully",
    status: 200,
  });
};
