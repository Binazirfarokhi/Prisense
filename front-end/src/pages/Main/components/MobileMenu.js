import MenuIcon from "@mui/icons-material/Menu";

import {Box, Drawer, IconButton} from "@mui/material";
import {useState, useEffect} from "react";
import NavBarMobile from "./NavBarMobile";
import CloseIcon from "@mui/icons-material/Close";


export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  //Close the menu if the window size>800px
  const handleResize = () => {
    if (window.innerWidth > 800) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(true)
        }}
        color={'inherit'}>
        <MenuIcon
          style={{
            fontSize: '30px'
          }}
        />
      </IconButton>

      <Drawer
        anchor={'right'}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Box
          style={{
            width: '100vw'
          }}>
          <Box
            className={'d-block d-lg-none'} textAlign={'end'} width={'100%'} 
            style={{ backgroundColor: '#2A5C6B' }}>
            <IconButton 
            style={{ marginRight: '5%', color: 'white'}}
            onClick={() => {
              setOpen(false)
            }}>
              <CloseIcon style={{fontSize: '40px'}}/>
            </IconButton>
          </Box>
          <NavBarMobile
            onClickNav={() => {
              setOpen(false)
            }}
          />
        </Box>
      </Drawer>
    </>
  )
}