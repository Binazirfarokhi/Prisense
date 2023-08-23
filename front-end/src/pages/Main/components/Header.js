import {Badge, Box, IconButton, styled, Typography} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import {useAuthContext} from "../../../auth";
import MobileMenu from "./MobileMenu";
import {useLocation, useMatches, matchRoutes} from "react-router-dom";
import Notification from "../../../components/Notification";
import './style.css';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 13,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));




const BaseHeader = ({title}) => {
  const location = useLocation();
  const isMessageBoxRoute = location.pathname === "/main/message-box";
  return (
    <Box>
      <Box className={'d-none d-lg-flex justify-content-between'} marginBottom={'30px'}>
        <Typography variant={'h4'} style={{ fontFamily: 'Raleway', fontWeight: '700' }}>
          {title}
        </Typography>
        {!isMessageBoxRoute && <Notification />}
      </Box>

      <Box className={'d-flex d-lg-none justify-content-between'}>
        <Box maxWidth={'60%'}>
          <Typography variant={'h5'} style={{ fontFamily: 'Raleway', fontWeight: '700' }}>{title}</Typography>
        </Box>
        <Box>
        {!isMessageBoxRoute && <Notification />}
          <MobileMenu />
        </Box>
      </Box>
    </Box>
  )
}

const WatchingListHeader = () => {
  return (
    <Box className={'d-flex justify-content-between'}>
      <Typography variant={'h4'}>Watching List</Typography>
      <MobileMenu />
    </Box>
  )
}

const ImportInventoryHeader = () => {
  return (
    <Typography variant={'h4'}>Inventory</Typography>
  )
}

const AccountHeader = () => {
  return (
    <Typography variant={'h4'}>Account</Typography>
  )
}


const ImportFromFileHeader = () => {
  return (
    <Typography variant={'h4'}>Import From File</Typography>
  )
}

const ImportBySearch = () => {
  return (
    <Typography variant={'h4'}>Import By Search</Typography>
  )
}



export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const {logout, userData} = useAuthContext();

  const headers = {
    '/main/dashboard': <BaseHeader title={userData?.username + "' s Dashboard"}/>,
    '/main/watching-list': <BaseHeader title={'Watchlist'}/>,
    '/main/inventory': <BaseHeader title={'Inventory'} />,
    '/main/additem': <BaseHeader title={'Add Item'} />,
    '/main/account': <BaseHeader title={'Account'} />,
    '/main/watching-list/import-from-file': <BaseHeader title={'Import Product From File'} />,
    '/main/watching-list/import-by-search': <BaseHeader title={'Import By Search'} />,
    '/main/watching-list/:watchingId': <BaseHeader title={'Watching Item Detail'}/>,
    '/main/message-box': <BaseHeader title={'Message Box'}/>
  }
  const routes = [];
  for (let path in headers) {
    routes.push({
      path: path,
      header: headers[path]
    })
  }
  const matches = matchRoutes(routes, location);
  console.log(matches)
  if (matches && matches.length > 0) {
    return matches[0].route.header;
  }
  return <></>


}