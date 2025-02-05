import express from "express";
import {
  createColumn,
  deleteColumn,
  getColumn,
  updateColumn,
} from "../controllers/column-controller.js";

const router = express.Router();

router.get("/", getColumn);
router.post("/", createColumn);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);

export default router;
