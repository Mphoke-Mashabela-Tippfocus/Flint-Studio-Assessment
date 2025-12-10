import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, InputAdornment } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../api"; // ✅ import the login helper

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setErrors({});

    try {
      await login({ email, password });
      toast.success("Login successful!", { position: "top-right", autoClose: 3000 });
      await checkAuth();
      navigate("/");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 419) {
          toast.error("CSRF token missing/expired. Refresh the page.");
        } else if (status === 422 && data.errors) {
          setErrors(data.errors);
          toast.error("Validation failed. Check form inputs.");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        toast.error("No response from server.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <Box className="login-container">
      <Paper className="login-paper">
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <LoginIcon sx={{ color: '#e91e63', mr: 1 }} />
          <Typography variant="h5" className="login-title">Login</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Enter your email"
            type="email"
            fullWidth
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon sx={{ color: "#e91e63" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
            required
            error={!!errors.email}
            helperText={errors.email && errors.email[0]}
          />

          <TextField
            placeholder="Enter your password"
            type="password"
            fullWidth
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#e91e63" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
            required
            error={!!errors.password}
            helperText={errors.password && errors.password[0]}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
            sx={{ mb: 2 }}
            disabled={loggingIn}
          >
            {loggingIn ? "Logging in..." : "Login"}
          </Button>

          <Button
            href="/register"
            fullWidth
            variant="contained"
            className="login-button register-button"
            sx={{ backgroundColor: "#555", color: "#fff", '&:hover': { backgroundColor: "#777" } }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
