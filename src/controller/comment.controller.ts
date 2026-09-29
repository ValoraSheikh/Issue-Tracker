import type { Request, Response } from "express";
import { db } from "../db/connections";
import { commentsTable, issuesTable, projectTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const createComment = async (req: Request, res: Response) => {
  const { comment, issueId } =
    req.body;

  await db.insert(commentsTable).values({
    comment, issueId, userId: req.user.id
  });

  return res.json({
    res: "",
    message: "Comment created successfully",
    status: 200,
  });
};

export const getAllComments = async (req: Request, res: Response) => {
  const { issueId } = req.body;

  const user = await db
    .select()
    .from(commentsTable)
    .where(sql`${commentsTable.issueId} = ${issueId}`);

  return res.json({
    res: user,
    message: "Comments fetched successfully",
    status: 200,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const { id, userId, comment } =
    req.body;

  if (
    !id &&
    !userId &&
    !comment) {
    return res.json({ status: 400, message: "Fill the fields" });
  }

  if (req.user.id != userId) {
    res.json({
      res: "", message: "You are not authorized", status: 403
    })
  }

  await db
    .update(commentsTable)
    .set({
      comment,
    })
    .where(eq(commentsTable.id, id));

  return res.json({
    res: "",
    message: "Comment updated successfully",
    status: 200,
  });
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id, userId } = req.body;

  if (req.user.id != userId) {
    res.json({
      res: "", message: "You are not authorized", status: 403
    })
  }

  await db.delete(commentsTable).where(eq(commentsTable.id, id));

  return res.json({
    res: "",
    message: "Issue deleted successfully",
    status: 200,
  });
};
