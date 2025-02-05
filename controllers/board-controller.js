import pool from "../sqlDb.js";
import { v4 as uuid } from "uuid";

export const getBoard = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM board");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving board", err);
    res.status(500).send("Error retrieving board");
  }
};

export const createBoard = async (req, res) => {
  const newBoard = req.body;
  const boardId = uuid();

  try {
    const result = await pool.query(
      "INSERT INTO board (id, board_name) VALUES ($1, $2) RETURNING id",
      [boardId, newBoard.board_name]
    );
    const id = result.rows[0].id;
    res.status(201).json({ id, board: newBoard.board });
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).send("Error adding todo");
  }
};

export const updateBoard = async (req, res) => {
  const id = req.params.id;
  const newName = req.body.board_name;

  try {
    await pool.query("UPDATE board SET board_name = $1 WHERE id = $2", [
      newName,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: `updated board with id ${id} successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `update of board with id ${id} is unsuccessful.`,
    });
  }
};

export const deleteBoard = async (req, res, next) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM board_column WHERE board_id = $1", [id]);

    const { rowCount } = await pool.query("DELETE FROM board WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.send(`board with id ${id} has been deleted.`);
    } else {
      res.status(404).send(`board with id ${id} not found.`);
    }
  } catch (err) {
    console.error("Error deleting board:", err);
    next(err);
  }
};
