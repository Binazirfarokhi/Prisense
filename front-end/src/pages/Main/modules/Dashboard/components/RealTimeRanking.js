import {Paper, Typography} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useWatchingPriceChartData} from "../../../../../hooks/useWatchingPriceChartData";
import {useMemo} from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RealTimeRanking() {
  const {watchingPriceChartData} = useWatchingPriceChartData();

  const labels = useMemo(() => {
    return watchingPriceChartData.map(item => item.label);
  }, [watchingPriceChartData]);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: '',
          data: watchingPriceChartData.map(item => item.itemsCount),
          backgroundColor: 'rgba(47, 145, 145, 0.8)',
        },
      ],
    }
  }, [watchingPriceChartData]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: '',
      },
      legend: {
        display: false
      }
    },
  };

  if (watchingPriceChartData.length === 0) {
    return <></>
  }

  return (
    <Paper className={'p-3 rounded rounded-4 h-100'} elevation={3} sx={{ backgroundColor: '#E6EFF1' }}>
      <Typography variant={'h6'}>
        Distribution of prices
      </Typography>
      <Bar height={'100%'} options={options} data={data} />
    </Paper>
  )
}