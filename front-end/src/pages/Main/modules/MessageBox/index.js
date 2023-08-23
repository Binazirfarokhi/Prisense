import { Box } from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import NotificationList from "./components/NotificationList";
import { useAllNotifications } from "../../../../hooks/useAllNotifications";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useMarkedNotifications } from "../../../../hooks/useMarkedNotifications";
import BackButton from "../../../../components/BackButton";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MessageBox() {
  const [value, setValue] = React.useState(0);
  const { allNotifications, refreshNotification: refreshAll } =
    useAllNotifications();
  const {
    notifications: unReadNotifications,
    refreshNotification: refreshUnRead,
  } = useNotifications();
  const { markedNotifications, refreshNotification: refreshMarked } =
    useMarkedNotifications();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMark = () => {
    refreshAll();
    refreshUnRead();
    refreshMarked();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <BackButton />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="ALL" {...a11yProps(0)} />
          <Tab label="UNREAD" {...a11yProps(1)} />
          <Tab label="BOOKMARKED" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <NotificationList
          onMark={handleMark}
          notifications={allNotifications}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <NotificationList
          onMark={handleMark}
          notifications={unReadNotifications}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <NotificationList
          onMark={handleMark}
          notifications={markedNotifications}
        />
      </CustomTabPanel>
    </Box>
  );
}
