import {Box, Button, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ImportInventoryMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className={'d-none d-lg-inline'} variant={'contained'}>
        Add Item
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {
          navigate('import-from-file')
        }}>
          Import From File
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('import-by-search')
        }}>
          Search
        </MenuItem>
      </Menu>
    </Box>
  )
}