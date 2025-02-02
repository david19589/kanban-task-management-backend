import express from "express";
import pool from "../sqlDb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM board_column");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving columns", err);
    res.status(500).send("Error retrieving columns");
  }
});

router.post("/", async (req, res) => {
  const newColumn = req.body;
  const columnId = uuid();

  try {
    const result = await pool.query(
      "INSERT INTO board_column (id, column_name, board_id) VALUES ($1, $2, $3) RETURNING id",
      [columnId, newColumn.column_name, newColumn.board_id]
    );
    const id = result.rows[0].id;
    res.status(201).json({ id, column: newColumn });
  } catch (err) {
    console.error("Error adding column:", err);
    res.status(500).send("Error adding column");
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.column_name;

  try {
    await pool.query("UPDATE board_column SET column_name = $1 WHERE id = $2", [
      newName,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: `updated column with id ${id} successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `update of column with id ${id} is unsuccessful.`,
    });
    console.log(id);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM task WHERE column_id = $1", [id]);

    const { rowCount } = await pool.query(
      "DELETE FROM board_column WHERE id = $1",
      [id]
    );
    if (rowCount > 0) {
      res.send(`column with id ${id} has been deleted.`);
    } else {
      res.status(404).send(`column with id ${id} not found.`);
    }
  } catch (err) {
    console.error("Error deleting column:", err);
    next(err);
  }
});

export default router;
