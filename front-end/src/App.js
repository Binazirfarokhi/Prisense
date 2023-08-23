import { RouterProvider} from "react-router-dom";

import {router} from "./route";
import {ConfirmProvider} from "./components/ConfirmDialog";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useEffect, useState} from "react";
import {useProfile} from "./hooks/useProfile";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2A5C6B'
    },
    info: {
      main: '#2A5C6B'
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2A5C6B'
    },
    info: {
      main: '#2A5C6B'
    },
  }
})

function App() {
  const [theme, setTheme] = useState(lightTheme);
  const {profile} = useProfile();

  useEffect(() => {
    if (profile) {
      if (profile.mode === 'dark') {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    }
  }, [profile]);

  window.addEventListener('changeTheme', (event) => {
    if (event.detail.mode === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ThemeProvider>
    </LocalizationProvider>

  );
}

export default App;
