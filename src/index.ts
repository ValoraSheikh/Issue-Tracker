import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  updateUser,
} from "./controller/user.controller";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "./controller/project.controller";
import {
  createIssue,
  deleteIssue,
  getIssue,
  getProjectIssues,
  updateIssue,
} from "./controller/issue.controller";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
} from "./controller/notification.controller";
import {
  createComment,
  deleteComment,
  getIssueComments,
  updateComment,
} from "./controller/comment.controller";
import authMiddleware from "./middleware/auth";

dotenv.config({ path: "./.env" });
const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Login Route
app.post("/auth/login", loginUser);

// Users Routes
app.post("/user", createUser);
app.get("/user", authMiddleware, getUser);
app.patch("/user", authMiddleware, updateUser);
app.delete("/user", authMiddleware, deleteUser);

// Projects Routes
app.post("/project", authMiddleware, createProject);
app.get("/project/all", authMiddleware, getAllProjects);
app.get("/project/:id", authMiddleware, getProject);
app.patch("/project/:id", authMiddleware, updateProject);
app.delete("/project/:id", authMiddleware, deleteProject);

// Issues Routes
app.post("/issue", authMiddleware, createIssue);
app.get("/project/issue/:projectId", authMiddleware, getProjectIssues);
app.get("/issue/:id", authMiddleware, getIssue);
app.patch("/issue/:id", authMiddleware, updateIssue);
app.delete("/issue/:id", authMiddleware, deleteIssue);

// Notifications Routes
app.post("/notification", authMiddleware, createNotification);
app.delete("/notification", authMiddleware, deleteNotification);
app.get("/notification/all", authMiddleware, getAllNotifications);

// Comments Routes
app.get("/issue/comment/:issueId", authMiddleware, getIssueComments);
app.post("/comment", authMiddleware, createComment);
app.patch("/comment/:id", authMiddleware, updateComment);
app.delete("/comment/:id", authMiddleware, deleteComment);

// app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
// 
//   console.log("look in here", err.statusCode, err.message)
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
// 
//   console.log(message, statusCode);
//   return res.status(statusCode).json({
//     status: statusCode,
//     message: message,
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
