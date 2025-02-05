import express from "express";
import {
  createSubtask,
  deleteSubtask,
  getSubtask,
  updateSubtask,
} from "../controllers/subtask-controller.js";

const router = express.Router();

router.get("/", getSubtask);
router.post("/", createSubtask);
router.put("/:id", updateSubtask);
router.delete("/:id", deleteSubtask);

export default router;
