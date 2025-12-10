// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";

import TaskCard from "../components/TaskCard.jsx";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import echo from "../echo"; // import Echo instance
import { useAuth } from "../context/AuthProvider";
import api, { getCsrfCookie,csrfRequest , logout } from "../api";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const columns = ["todo", "doing", "done"];
  const navigate = useNavigate();

  const [newTaskInputs, setNewTaskInputs] = useState({
    todo: { title: "", description: "" },
    doing: { title: "", description: "" },
    done: { title: "", description: "" },
  });

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({ title: "", description: "" });

  const { user, setUser } = useAuth();

  // -----------------------
  // FETCH TASKS
  // -----------------------
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks. Are you logged in?");
    }
  };

  // -----------------------
  // INITIALIZATION
  // -----------------------
useEffect(() => {
  if (!user) return;

  const initialize = async () => {
    try {
      await getCsrfCookie();
      fetchTasks();

      if (echo) {
        const channel = echo.channel("tasks");
        channel.listen(".task.updated", (e) => {
          setTasks((prev) => {
            const exists = prev.find((t) => t.id === e.task.id);
            if (exists) {
              return prev.map((t) => (t.id === e.task.id ? e.task : t));
            } else {
              return [...prev, e.task];
            }
          });
        });
      }
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  initialize();

  return () => {
    if (echo) {
      echo.leaveChannel("tasks");
    }
  };
}, [user]);

  // -----------------------
  // ADD TASK
  // -----------------------
  const handleAddTask = async (col) => {
  const { title, description } = newTaskInputs[col];
  if (!title) return toast.error("Task title is required!");

  try {
    await csrfRequest("post", "/tasks", { title, description, status: col });
    setNewTaskInputs((prev) => ({ ...prev, [col]: { title: "", description: "" } }));
    fetchTasks();
    toast.success("Task added!");
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to add task.");
  }
};

// -----------------------
// DELETE TASK
// -----------------------
const handleDeleteTask = async (id) => {
  try {
    await csrfRequest("delete", `/tasks/${id}`);
    fetchTasks();
    toast.success("Task deleted");
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to delete task.");
  }
};

// -----------------------
// MOVE TASK
// -----------------------
const handleMoveTask = async (task, direction) => {
  const order = ["todo", "doing", "done"];
  const index = order.indexOf(task.status);
  let newStatus = task.status;

  if (direction === "forward" && index < order.length - 1) newStatus = order[index + 1];
  if (direction === "backward" && index > 0) newStatus = order[index - 1];

  try {
    await csrfRequest("put", `/tasks/${task.id}`, { status: newStatus });
    fetchTasks();
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to update task");
  }
};
  // -----------------------
  // EDIT TASK
  // -----------------------
  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskData({ title: task.title, description: task.description });
  };

 const saveEditTask = async (taskId) => {
  if (!editingTaskData.title) return toast.error("Title cannot be empty!");

  try {
    await csrfRequest("put", `/tasks/${taskId}`, editingTaskData);
    setEditingTaskId(null);
    setEditingTaskData({ title: "", description: "" });
    fetchTasks();
    toast.success("Task updated!");
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to update task");
  }
};

  // -----------------------
  // LOGOUT
  // -----------------------
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed (CSRF/session issue)");
    }
  };

  // -----------------------
  // RENDER
  // -----------------------
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #0d1b2a, #b71c1c)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToastContainer />
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "1200px",
          borderRadius: 4,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: "#e91e63", fontWeight: 700, textAlign: "center", width: "100%" }}
          >
            Task Dashboard
          </Typography>
          <IconButton color="error" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* COLUMNS */}
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {columns.map((col) => (
            <Grid item xs={12} sm={6} md={4} key={col} sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  p: 3,
                  borderRadius: 5,
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center", color: "#e91e63", fontWeight: 700 }}>
                  {col.toUpperCase()}
                </Typography>

                {/* NEW TASK INPUT */}
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Task title"
                  sx={{ mb: 1 }}
                  value={newTaskInputs[col].title}
                  onChange={(e) =>
                    setNewTaskInputs((prev) => ({ ...prev, [col]: { ...prev[col], title: e.target.value } }))
                  }
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Task description"
                  sx={{ mb: 1 }}
                  value={newTaskInputs[col].description}
                  onChange={(e) =>
                    setNewTaskInputs((prev) => ({ ...prev, [col]: { ...prev[col], description: e.target.value } }))
                  }
                />
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: "50px",
                    backgroundColor: "#e91e63",
                    "&:hover": { backgroundColor: "#d81b60" },
                    mb: 2,
                  }}
                  onClick={() => handleAddTask(col)}
                >
                  Add Task
                </Button>

                {/* TASK LIST */}
                {tasks
                  .filter((task) => task.status === col)
                  .map((task) => (
                    <TaskCard key={task.id} task={task}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                        {/* MOVE */}
                        <Box>
                          {columns.indexOf(col) > 0 && (
                            <Button size="small" onClick={() => handleMoveTask(task, "backward")}>
                              ◀
                            </Button>
                          )}
                          {columns.indexOf(col) < columns.length - 1 && (
                            <Button size="small" onClick={() => handleMoveTask(task, "forward")}>
                              ▶
                            </Button>
                          )}
                        </Box>

                        {/* EDIT / DELETE */}
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>

                          {editingTaskId === task.id ? (
                            <>
                              <TextField
                                size="small"
                                value={editingTaskData.title}
                                onChange={(e) =>
                                  setEditingTaskData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                sx={{ width: 120 }}
                              />
                              <TextField
                                size="small"
                                value={editingTaskData.description}
                                onChange={(e) =>
                                  setEditingTaskData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                sx={{ width: 160 }}
                              />
                              <IconButton size="small" color="primary" onClick={() => saveEditTask(task.id)}>
                                <SaveIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton size="small" color="primary" onClick={() => startEditTask(task)}>
                              <EditIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </TaskCard>
                  ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
