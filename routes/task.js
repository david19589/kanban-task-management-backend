import express from "express";
import pool from "../sqlDb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM task");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving tasks", err);
    res.status(500).send("Error retrieving tasks");
  }
});

router.post("/", async (req, res) => {
  const newTask = req.body;
  const taskId = uuid();

  try {
    const result = await pool.query(
      "INSERT INTO task (id, task_name, description, status, column_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        taskId,
        newTask.task_name,
        newTask.description,
        newTask.status,
        newTask.column_id,
      ]
    );
    const id = result.rows[0].id;
    res.status(201).json({ id, task: newTask });
  } catch (err) {
    console.error("Error adding tasks", err);
    res.status(500).send("Error adding tasks");
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.task_name;
  const newDescription = req.body.description;
  const newStatus = req.body.status;
  const columnId = req.body.column_id;

  try {
    await pool.query(
      "UPDATE task SET task_name = $1, description = $2, status = $3, column_id = $4 WHERE id = $5",
      [newName, newDescription, newStatus, columnId, id]
    );

    res.status(200).json({
      success: true,
      message: `updated task with id ${id} successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `update of task with id ${id} is unsuccessful.`,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM subtask WHERE task_id = $1", [id]);

    const { rowCount } = await pool.query("DELETE FROM task WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.send(`task with id ${id} has been deleted.`);
    } else {
      res.status(404).send(`task with id ${id} not found.`);
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    next(err);
  }
});

export default router;
