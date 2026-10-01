import type { Request, Response } from "express";
import { db } from "../db/connections";
import { notificationsTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const createNotification = async (req: Request, res: Response) => {
  const { issueId, assigneeId } = req.body;

  await db.insert(notificationsTable).values({
    issueId,
    assigneeId,
  });

  return res.json({
    data: "",
    message: "Notification created successfully",
    status: 200,
  });
};

export const getAllNotifications = async (req: Request, res: Response) => {
  const { assigneeId } = req.body;

  const user = await db
    .select()
    .from(notificationsTable)
    .where(sql`${notificationsTable.assigneeId} = ${assigneeId}`);

  return res.json({
    data: user,
    message: "Notifications fetched successfully",
    status: 200,
  });
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.body;

  await db.delete(notificationsTable).where(eq(notificationsTable.id, id));

  return res.json({
    data: "",
    message: "Notification deleted successfully",
    status: 200,
  });
};
