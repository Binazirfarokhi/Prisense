import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Button,
    IconButton, Avatar,
  } from '@mui/material';
  import './style.css';
  import {useMatches, useNavigate, useRoutes} from "react-router-dom";
  import {useAuthContext} from "../../../auth";
  import Logo from '../../../assets/translogo.png'
  import {useProfile} from "../../../hooks/useProfile";
  import {useConfirmContext} from "../../../components/ConfirmDialog";
  
  
  
  export default function NavBarMobile({onClickNav}) {
    const {logout, userData} = useAuthContext();
    const {profile} = useProfile();
    const {showConfirm} = useConfirmContext();
    const navs = [
      {
        name: 'Dashboard',
        pathname: '/main/dashboard',
      },
      {
        name: 'Watchlist',
        pathname: '/main/watching-list'
      },
      {
        name: 'Add Item',
        pathname: '/main/additem'
      },
      {
        name: 'Account',
        pathname: '/main/account'
      }
    ];
    const navigate = useNavigate();
    const routesMatch = useMatches();
    const handleClickLogout = () => {
      showConfirm('Do you want to really log out?', () => {
        logout()
          .then(() => {
            navigate('/login', {replace: true})
            onClickNav && onClickNav();
          })
      })
    }
  
    return (
      <div style={{
        position: 'sticky',
        //TODO: sticky doesn't work
        height: '95vh',
        top: 0, 
        background: '#2A5C6B',
        color: 'white',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
      }} className={'w-100 d-flex flex-column align-items-center'}>
  
        <Box
          width={'90%'}
          className={'d-flex flex-column align-items-center justify-content-between flex-grow-1'}
          style={{
            flex: '1', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: '60vh',
          }}
        >
            <List className={'w-100'} 
            style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly', 
            paddingLeft: 0,
            marginTop: '5%', 
            height: '50%'
            }}>
            {navs.map(nav => {
              const active = routesMatch.find(route => route.pathname.includes(nav.pathname));
              return (
                <ListItem
                  selected={active}
                  key={nav.name}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(nav.pathname);
                      onClickNav && onClickNav();
                    }}
                    className="list-item-button"
                    style={{ justifyContent: 'center',
                    borderBottom: active ? '3px solid #FFCF52' : 'none',
                    marginLeft: '35%',
                    marginRight: '32%',
                    paddingBottom: '0'

                  }}
                  >
                    <ListItemText primary={nav.name} 
                    primaryTypographyProps={{fontFamily: 'Poppins'}} 
                    style={{ textAlign: 'center',
                    color: active ? '#FFCF52' : 'white',
                    }}/>
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
  
          <div style={{
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            paddingBottom: '15%'
          }}>
            <Avatar src={profile?.avatar} style={{width: '60px', height: '60px'}} />
            <Typography 
            primaryTypographyProps={{fontFamily: 'Poppins'}}
            sx={{ marginBottom: '15%', fontWeight: '300'}}
            className={'mt-2'} variant={'h6'}>
              {profile?.username}
            </Typography>
            <Button
              onClick={handleClickLogout}
              className={'mb-5'} 
              variant={'contained'}
              sx={{
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <Typography
              sx={{ letterSpacing: '0.2em', fontWeight: '300' }}>
              LOG OUT
              </Typography>
              
            </Button>
          </div>
        </Box>
      </div>
    )
  }