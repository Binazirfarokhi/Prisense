import { Box, Button, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Inventory() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
