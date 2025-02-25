import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/task-controller.js";

const router = express.Router();

router.get("/", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
