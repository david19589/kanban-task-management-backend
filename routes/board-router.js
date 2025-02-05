import express from "express";
import {
  createBoard,
  deleteBoard,
  getBoard,
  updateBoard,
} from "../controllers/board-controller.js";

const router = express.Router();

router.get("/", getBoard);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
