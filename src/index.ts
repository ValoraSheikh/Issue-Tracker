import cookieParser from "cookie-parser";
import express from "express";
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

const app = express();
const port = 3000;

app.use(cookieParser());

app.use();

// Users Routes
app.post("/user", createUser);
app.get("/user/:id", getUser);
app.patch("/user/:id", updateUser);
app.delete("/user/:id", deleteUser);

// Projects Routes
app.post("/project", createProject);
app.get("/project/:id", getProject);
app.get("/project/all", getAllProjects);
app.patch("/project/:id", updateProject);
app.delete("/project/:id", deleteProject);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
