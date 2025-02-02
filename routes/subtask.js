import express from "express";
import pool from "../sqlDb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM subtask");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving subtasks", err);
    res.status(500).send("Error retrieving subtasks");
  }
});

router.post("/", async (req, res) => {
  const newSubtask = req.body;
  const subtaskId = uuid();

  try {
    const result = await pool.query(
      "INSERT INTO subtask (id, subtask_name, is_completed, task_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [
        subtaskId,
        newSubtask.subtask_name,
        newSubtask.is_completed,
        newSubtask.task_id,
      ]
    );
    const id = result.rows[0].id;
    res.status(201).json({ id, task: newSubtask });
  } catch (err) {
    console.error("Error adding subtasks", err);
    res.status(500).send("Error adding subtasks");
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.subtask_name;
  const IsCompleted = req.body.is_completed;

  try {
    await pool.query(
      "UPDATE subtask SET subtask_name = $1, is_completed = $2 WHERE id = $3",
      [newName, IsCompleted, id]
    );

    res.status(200).json({
      success: true,
      message: `updated subtask with id ${id} successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `update of subtask with id ${id} is unsuccessful.`,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const { rowCount } = await pool.query("DELETE FROM subtask WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.send(`subtask with id ${id} has been deleted.`);
    } else {
      res.status(404).send(`subtask with id ${id} not found.`);
    }
  } catch (err) {
    console.error("Error deleting subtask:", err);
    next(err);
  }
});

export default router;
