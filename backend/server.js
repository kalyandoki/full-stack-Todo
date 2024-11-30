const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express App
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI =
  "mongodb+srv://kalyanreddy14343:IyE5zNMTWks2jR70@cluster0.a0pvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  status: { type: String, default: "Unpaid" },
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving tasks" });
  }
});
//IyE5zNMTWks2jR70
// Add a New Task
app.post("/tasks", async (req, res) => {
  const { name, money } = req.body;
  try {
    const newTask = new Task({ name, money });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: "Error adding task" });
  }
});

// Update a Task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, money, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, money, status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: "Error updating task" });
  }
});

// Delete a Task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
