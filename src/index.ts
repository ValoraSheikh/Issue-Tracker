import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import {
  createUser,
  deleteUser,
  getUser,
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

dotenv.config({ path: "./.env" });
const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());


// Users Routes
app.post("/user", createUser);
app.get("/user", getUser);
app.patch("/user", updateUser);
app.delete("/user", deleteUser);

// Projects Routes
app.post("/project", createProject);
app.get("/project/:id", getProject);
app.get("/project/all", getAllProjects);
app.patch("/project/:id", updateProject);
app.delete("/project/:id", deleteProject);

// Issues Routes
app.post("/issue", createIssue);
app.get("/project/issue/:projectId", getProjectIssues)
app.get("/issue/:id", getIssue);
app.patch("/issue/:id", updateIssue);
app.delete("/issue/:id", deleteIssue);

// Notifications Routes
app.post("/notification", createNotification);
app.delete("/notification/:id", deleteNotification);
app.get("/notification/all", getAllNotifications);

// Comments Routes
app.get("/issue/comment/:issueId", getIssueComments);
app.post("/comment", createComment);
app.patch("/comment/:id", updateComment);
app.delete("/comment/:id", deleteComment);


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
