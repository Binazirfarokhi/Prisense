import {useState} from "react";
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import {Button} from "@mui/material";
import {authedRequest} from "../http";
export const ReadButton = ({notificationId, onRead}) => {
  const [readed, setReaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickRead = async () => {
    setLoading(true);
    await authedRequest.put(`/api/notifications/${notificationId}`);
    setReaded(true);
    setLoading(false);
    onRead();
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (readed) {
    return <Button
        startIcon={<CheckIcon />}
        variant={'contained'}
        color={'success'}>
        Readed
    </Button>
  }

  return (
    <Button
      onClick={handleClickRead}
      color={'success'}>Read</Button>
  )

}