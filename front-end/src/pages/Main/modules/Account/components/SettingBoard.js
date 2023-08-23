import {Box, MenuItem, Switch, TextField, Typography} from "@mui/material";
import {authedRequest} from "../../../../../http";
import {useProfile} from "../../../../../hooks/useProfile";
import {ToastTypes, useToast} from "../../../../../components/Toast";
import {useEffect} from "react";

export default function SettingBoard() {

  const {show} = useToast();
  const {profile, refresh} = useProfile();
  const handleChange = async (field, value) => {
    console.log("changing"+field+"to "+value)
    await authedRequest.put('/api/users/settings', {
      [field]: value
    });
   
    refresh();
    show(ToastTypes.SUCCESS, 'Updated successfully!');
  }

  useEffect(() => {
    if (profile) {
      const event = new CustomEvent('changeTheme', {
        bubbles: true,
        detail: {
          mode: profile.mode
        }
      });
      window.dispatchEvent(event);
    }
  }, [profile]);


  return (
    <Box>
      <Box className={'d-flex'}>
        <Box width={'250px'}>
          <Typography className={'fw-bold'} variant={'h6'}>
            Notification
          </Typography>
        </Box>
        <Switch
          onChange={(e, val) => {
           handleChange('notification', val)
          }}
          checked={profile?.notification}/>
      </Box>

      <Box className={'d-flex mt-3'}>
        <Box width={'250px'}>
          <Typography className={'fw-bold'} variant={'h6'}>
            Alert Threshold
          </Typography>
        </Box>
        <TextField
          onChange={e => {
            handleChange('alertThreshold', e.target.value)
          }}
          value={profile?.alertThreshold || 1.5}
          style={{
          width: '300px'
        }} label={'Alert Threshold'} select>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={1.5}>1.5</MenuItem>
          <MenuItem value={2}>2</MenuItem>
        </TextField>
      </Box>

      <Box className={'d-flex mt-3'}>
        <Box width={'250px'}>
          <Typography className={'fw-bold'} variant={'h6'}>
            Mode
          </Typography>
        </Box>
        <TextField
          onChange={e => {
            handleChange('mode', e.target.value)
          }}
          value={profile?.mode || 'light'}
          style={{
          width: '300px'
        }} label={'Select Mode'} select>
          <MenuItem value={'light'}>Light</MenuItem>
          <MenuItem value={'dark'}>Dark</MenuItem>
        </TextField>
      </Box>
    </Box>
  )
}
