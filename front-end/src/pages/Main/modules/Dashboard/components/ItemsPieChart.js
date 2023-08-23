import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Box, Grid, Paper, Typography} from "@mui/material";
import {useDiffIndexChartData} from "../../../../../hooks/useDiffIndexChartData";
import {useMemo, useEffect, useState} from "react";
import './style.css'
import { Height } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ItemsPieChart() {
  const {diffIndexChartData} = useDiffIndexChartData();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculatePieSize = () => {
    if (windowWidth < 1200 && windowWidth > 400) {
      console.log("400-1200")
      return 0.3; 
    } else if(windowWidth > 1200){
      console.log(">1200")
      return 0.4; 
    } else{
      
      return 1;
    }
  };

  const chartOptions = {
    aspectRatio: calculatePieSize(),
  };

  const chartData = useMemo(() => {
    const labels = diffIndexChartData.map(item => item.label);
    const numbers = diffIndexChartData.map(item => item.itemsCount);
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Distribution of Diff-Index',
          data: numbers,
          backgroundColor: [
            'rgba(135, 206, 250, 0.8)',
            'rgba(144, 238, 144, 0.8)',
            'rgba(240, 128, 128, 0.8)',
            'rgba(255, 160, 122, 0.8)',
            'rgba(230, 230, 250, 0.8)',
            'rgba(57, 20, 242, 0.8)'
          ],
          borderColor: [
            'rgba(135, 206, 250, 0.8)',
            'rgba(144, 238, 144, 0.8)',
            'rgba(240, 128, 128, 0.8)',
            'rgba(255, 160, 122, 0.8)',
            'rgba(230, 230, 250, 0.8)',
            'rgba(57, 20, 242, 0.8)'
          ],
          borderWidth: 1,
        },
      ],
    };
    return data;
  }, [diffIndexChartData]);

  return (
    <Paper elevation={4} className={'p-3 rounded rounded-4 overflow-hidden'} sx={{ backgroundColor: '#E6EFF1'}}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} lg={8}>
          <Typography variant={'h5'}>
          Distribution of Diff-Index
          </Typography>

          <Pie data={chartData} sx={{ marginTop: 0, marginBottom: 0 }}/>
        </Grid>
      </Grid>
    </Paper>
  )
}