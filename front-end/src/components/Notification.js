import {Alert, Badge, Box, Button, Drawer, IconButton, List, ListItem, styled, Typography} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {useState} from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CloseIcon from '@mui/icons-material/Close';
import {useNotifications} from "../hooks/useNotifications";
import WatchingItem from "../pages/Main/modules/WathcingList/components/WatchingItem";
import {useProfile} from "../hooks/useProfile";
import {ReadButton} from "./ReadButton";
import {useNavigate} from "react-router-dom";
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 13,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default function Notification() {

  const [open, setOpen] = useState(false);
  const {notifications, refreshNotification} = useNotifications();
  const {profile} = useProfile();
  const [watchingId, setWatchingId] = useState();
  const [openWatching, setOpenWatching] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <WatchingItem
        watchingId={watchingId}
        open={openWatching}
        onClose={() => {
          setOpenWatching(false);
          setWatchingId(null);
        }}
      />
      <Drawer
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        anchor={'right'}>
        <Box>
          <Box className={'d-none d-lg-block'} style={{width: '600px'}}></Box>
          <Box className={'d-block d-lg-none'} style={{width: '100vw'}}></Box>

          <Box className={'p-3 w-100'}>
            <Box className={'d-flex justify-content-between'}>
              <Typography variant={'h5'} className={'fw-bold'}>
                Notifications
              </Typography>
              <IconButton
                onClick={() => {
                  setOpen(false)
                }}
                color={'primary'}>
                <CloseIcon />
              </IconButton>
            </Box>

            {notifications.length === 0 && (
              <Alert icon={false} color={'success'}>
                No New Notification Yet!
              </Alert>
            )}

            <List>
              {notifications.map(notification => {
                const product = notification.watchingItem;
                return (
                  <ListItem
                    key={notification._id}
                    style={{
                    border: '1px solid gray',
                    marginTop: '10px'
                  }}>
                    <Box>
                      <Typography variant={'subtitle1'}>

                        <strong className={'me-1'}>
                          {product.name}
                        </strong>
                        price diff index is
                        <strong className={'text-danger ms-1'}>
                          {product.diffIndex.toFixed(2)}
                        </strong>
                      </Typography>

                      <Box marginTop={'10px'}>
                        <Button
                          onClick={() => {
                            setWatchingId(product._id);
                            setOpenWatching(true);
                          }}
                          size={'small'} startIcon={<ArrowRightAltIcon />}>
                          See More
                        </Button>
                        <ReadButton
                          onRead={() => {
                            refreshNotification();
                          }}
                          notificationId={notification._id}/>
                      </Box>
                    </Box>
                  </ListItem>
                )
              })}
              <ListItem>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate('/main/message-box');
                  }}
                  className={'mt-5'} color={'info'} variant={'contained'} fullWidth>
                  MORE
                </Button>
              </ListItem>



            </List>
          </Box>
        </Box>
      </Drawer>
      <StyledBadge
        badgeContent={
          profile && profile.notification && (notifications.length > 0 ? notifications.length : null) || null
        } color={'error'}>
        <IconButton
          onClick={() => {
            setOpen(true)
          }}
          color={'inherit'}>
          <NotificationsIcon
            style={{
              fontSize: '35px'
            }}
          />
        </IconButton>
      </StyledBadge>
    </>
  )
}