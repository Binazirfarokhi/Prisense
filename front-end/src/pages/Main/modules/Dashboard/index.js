import {Badge, Box, Grid, IconButton, styled, Typography} from "@mui/material";
import Trend from "./components/Trend";
import ItemsPieChart from "./components/ItemsPieChart";
import RealTimeRanking from "./components/RealTimeRanking";
import News from "./components/NewsList";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {useAuthContext} from "../../../../auth";
import MenuIcon from '@mui/icons-material/Menu';
import '../style.css';
export default function Dashboard() {
  const {logout, userData} = useAuthContext();

  const commonBoxStyle = {
    backgroundColor: '#E6EFF1',
  };

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} lg={6}>
        <Box height={400} >
          <Trend />
        </Box>
        <Box className={'mt-3'}>
          <ItemsPieChart />
        </Box>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Box height={400}>
          <RealTimeRanking />
        </Box>
        <Box className={'mt-3'}>
          <News />
        </Box>
      </Grid>
    </Grid>
  );
}