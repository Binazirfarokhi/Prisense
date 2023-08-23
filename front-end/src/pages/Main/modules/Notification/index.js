import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import NotifItem from "../../components/NotifItem";

const data = [
  {
    id: 1,
    title: "ABC has gone down in price in may!",
    description: "According to ABC has gone down in price in may!",
    time: "a day ago",
    favourite: false,
    type: "BOOKMARKED",
  },
  {
    id: 2,
    title: "ABC has gone down in price in may!",
    description: "According to ABC has gone down in price in may!",
    time: "a day ago",
    favourite: true,
    type: "UNREAD",
  },
  {
    id: 3,
    title: "ABC has gone down in price in may!",
    description: "According to ABC has gone down in price in may!",
    time: "a day ago",
    favourite: true,
    type: "UNREAD",
  },
];

const Notification = () => {
  const [tab, setTab] = useState(0);

  const getNotifications = () => {
    if (tab === 0) {
      return data;
    } else if (tab === 1) {
      return data.filter((item) => item.type === "UNREAD");
    } else {
      return data.filter((item) => item.type === "BOOKMARKED");
    }
  };
  return (
    <div style={{ maxWidth: "600px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          TabIndicatorProps={{
            style: {
              backgroundColor: "#000",
            },
          }}
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
        >
          <Tab label="All" value={0} />
          <Tab label="Unread" value={1} />
          <Tab label="Bookmarked" value={2} />
        </Tabs>
      </Box>
      {getNotifications().map((item) => (
        <NotifItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Notification;
