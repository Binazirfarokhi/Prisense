import {Box, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography} from "@mui/material";


export default function News() {
  return (
    <Paper elevation={4} className={'p-3 rounded rounded-4'} sx={{ backgroundColor: '#E6EFF1' }}>
      <Typography variant={'h5'}>
        News about the competitors
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="Article1" />
        </ListItem>
        <Divider  component="li" />

        <ListItem disablePadding>
          <ListItemText primary="Article2" />
        </ListItem>
        <Divider  component="li" />
      </List>
    </Paper>
  )
}