import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PersonIcon from '@mui/icons-material/Person';
import {Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileBoard from "./components/ProfileBoard";
import SettingBoard from "./components/SettingBoard";
export default function Account() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={
              <Box>
                <PersonIcon />
                <strong>Profile</strong>
              </Box>
            } value="1" />
            <Tab label={
              <Box>
                <SettingsIcon />
                <strong>Settings</strong>
              </Box>
            } value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ProfileBoard />
        </TabPanel>
        <TabPanel value="2">
          <SettingBoard />
        </TabPanel>
      </TabContext>
    </Box>
  );
}