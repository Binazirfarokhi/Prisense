import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
  },
  buttonWidth: {
    width: '200px',
  }
});

export default theme;