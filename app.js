import express from "express";
import boardRoute from "./routes/board.js";
import columnRouter from "./routes/column.js";
import taskRouter from "./routes/task.js";
import subtaskRouter from "./routes/subtask.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/boards", boardRoute);
app.use("/columns", columnRouter);
app.use("/tasks", taskRouter);
app.use("/subtasks", subtaskRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
