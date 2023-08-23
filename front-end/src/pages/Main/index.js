import {
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NavBar from "./components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth";
import Header from "./components/Header";

export default function Main() {
  const { logout, userData } = useAuthContext();
  const navigate = useNavigate();

  const StickyNavBar = styled(NavBar)({
    position: "fixed",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 100,
  });

  return (
    <div className={"container-fluid full-height p-0 "}>
      <Grid container className={"h-100"}>
        <Grid
          className={
            "d-flex flex-column align-items-center justify-content-between h-100  d-none d-lg-flex"
          }
          item
          md={2}
        >
          <Box width={"100%"}>
            <StickyNavBar />
          </Box>
        </Grid>
        <Grid item xs={12} md={10} className={"p-3"}>
          <Header />
          <Outlet />
        </Grid>
      </Grid>
    </div>
  );
}
