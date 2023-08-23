import {Box, Grid, Paper, Typography} from "@mui/material";
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useNavigate} from "react-router-dom";
import {useOverallData} from "../../../../../hooks/useOverallData";

export default function Trend() {
  const navigate = useNavigate();
  const {overallData} = useOverallData();

  return (
    <Paper className={'w-100 rounded rounded-4 overflow-hidden h-100 d-flex flex-column justify-content-between'} elevation={4} sx={{ backgroundColor: '#E6EFF1' }}>
      <Grid className={'p-3'} container spacing={2}>
        <Grid item xs={6} lg={4}>
          <Typography variant={'h6'}>Today</Typography>
          <Typography className={'text-info'} variant={'h3'}>
            {overallData?.count || '-'}
          </Typography>
          <Typography variant={'subtitle2'}>
            items on watchlist
          </Typography>
        </Grid>

        <Grid item container xs={6} spacing={2} lg={8}>
          <Grid item xs={12} lg={6}>
            <Box className={'d-flex align-items-center text-danger'}>
              <NorthIcon className={'me-2'}/>
              <Typography variant={'subtitle1'}>
                Higher Prices
              </Typography>
            </Box>
            <Typography className={'ms-5 text-danger'} variant={'h5'}>
              {overallData?.positiveDiffIndexCount || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box className={'d-flex align-items-center text-success'}>
              <SouthIcon className={'me-2'}/>
              <Typography variant={'subtitle1'}>
                Lower Prices
              </Typography>
            </Box>
            <Typography className={'ms-5 text-success'} variant={'h5'}>
              {overallData?.negativeDiffIndexCount || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box role={'button'}
           style={{
             background: '#2A5C6B'
           }}
           className={' d-flex align-items-center justify-content-end'} height={50}>

        <Typography
          onClick={() => {
            navigate('/main/watching-list')
          }}
          className={'text-white'} variant={'subtitle1'}>
          View Your watching List

        </Typography>
        <KeyboardArrowRightIcon className={'text-white me-3 ms-2'}/>
      </Box>
    </Paper>
  )
}