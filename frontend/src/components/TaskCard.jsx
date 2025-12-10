import { Card, CardContent, Typography, Box } from "@mui/material";

export default function TaskCard({ task, children }) {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: "#e91e63", fontWeight: 700, mb: 1 }}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography variant="body2" sx={{ color: "#a0304cff", mb: 1, lineHeight: 1.4 }}>
            {task.description}
          </Typography>
        )}

        <Typography variant="caption" sx={{ color: "#a0304cff" }}>
          Assigned to: {task.user?.name}
        </Typography>

        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
      </CardContent>
    </Card>
  );
}
