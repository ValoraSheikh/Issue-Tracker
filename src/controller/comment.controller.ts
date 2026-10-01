import type { Request, Response } from "express";
import { db } from "../db/connections";
import { commentsTable, issuesTable, projectTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const createComment = async (req: Request, res: Response) => {
  const { comment, issueId } = req.body;

  await db.insert(commentsTable).values({
    comment,
    issueId,
    userId: req.user.id,
  });

  return res.status(200).json({
    data: "",
    message: "Comment created successfully",
    status: 200,
  });
};

export const getIssueComments = async (req: Request, res: Response) => {
  const { issueId } = req.params;

  const comments = await db
    .select()
    .from(commentsTable)
    .where(sql`${commentsTable.issueId} = ${issueId}`);

  return res.status(200).json({
    data: comments,
    message: "Comments fetched successfully",
    status: 200,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const { userId, comment } = req.body;

  const { id } = req.params;

  if (!id && !userId && !comment) {
    return res.status(400).json({ status: 400, message: "Fill the fields" });
  }

  if (req.user.id != userId) {
    return res.status(403).json({
      res: "",
      message: "You are not authorized",
      status: 403,
    });
  }

  await db
    .update(commentsTable)
    .set({
      comment,
    })
    .where(sql`${issuesTable.id} = ${id}`);

  return res.status(200).json({
    data: "",
    message: "Comment updated successfully",
    status: 200,
  });
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const comment = await db
    .select()
    .from(commentsTable)
    .where(sql`${issuesTable.id} = ${id}`);

  if (req.user.id != comment[0]?.userId) {
    return res.status(403).json({
      res: "",
      message: "You are not authorized",
      status: 403,
    });
  }

  await db.delete(commentsTable).where(sql`${issuesTable.id} = ${id}`);

  return res.status(200).json({
    data: "",
    message: "Issue deleted successfully",
    status: 200,
  });
};
