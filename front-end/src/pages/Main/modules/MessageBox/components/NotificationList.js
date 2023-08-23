import {Alert, Avatar, Box,  Typography} from "@mui/material";

import MarkStar from "./MarkStar";
export default function NotificationList({notifications = [], onMark}) {




  if (notifications.length === 0) {
    return (
      <Alert color={'warning'}>
        No notifications yet!
      </Alert>
    )
  }

  return (
    <Box>
      {notifications.map(notification => {
        const product = notification.watchingItem;
        return (
          <Box className={'d-flex align-items-start mb-3'}>
            <Avatar style={{
              width: '40px',
              height: '40px',
              marginRight: '20px'
            }}>
              {product.name[0]}
            </Avatar>
            <Box>
              <Typography>
                <strong className={'me-1'}>
                  {product.name}
                </strong>
                <span className={'me-1'}>
          price diff index is
        </span>
                <strong className={'text-danger'}>
                  {product.diffIndex.toFixed(2)}
                </strong>
              </Typography>
              <Typography>
                <small className={'text-secondary'}>
                  1 days ago
                </small>
              </Typography>
            </Box>
            <MarkStar
              onMark={onMark}
              defaultMarked={notification.marked} notification={notification}/>
          </Box>
        )
      })}
    </Box>
  )
}