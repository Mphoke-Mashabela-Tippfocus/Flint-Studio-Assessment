import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, InputAdornment, Button } from "@mui/material";
import { toast } from "react-toastify";

import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

import { register } from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(" ");
        toast.error(messages);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Box className="login-container">
      <Paper className="login-paper">
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <HowToRegIcon sx={{ color: '#e91e63', mr: 1 }} />
          <Typography variant="h5" className="login-title">
            Register
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Enter your name"
            fullWidth
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#e91e63" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, '& input::placeholder': { color: '#e91e63', opacity: 1 } }}
          />

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
            sx={{ mb: 2, '& input::placeholder': { color: '#e91e63', opacity: 1 } }}
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
            sx={{ mb: 3, '& input::placeholder': { color: '#e91e63', opacity: 1 } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
            sx={{ mb: 2 }}
          >
            Register
          </Button>

          <Button
            href="/login"
            fullWidth
            variant="contained"
            className="login-button register-button"
            sx={{ backgroundColor: "#555", color: "#fff", '&:hover': { backgroundColor: "#777" } }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
