import {IconButton} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import {useState} from "react";
import {authedRequest} from "../../../../../http";

export default function MarkStar({defaultMarked = false, notification, onMark}) {

  const [marked, setMarked] = useState(defaultMarked);

  const handleClickMark = async () => {
    try {
      await authedRequest.put(`/api/notifications/${notification._id}/mark`);
      setMarked(true);
      onMark && onMark();
    } catch (err) {

    }
  }

  const handleClickUnMark = async () => {
    try {
      await authedRequest.put(`/api/notifications/${notification._id}/unmark`);
      setMarked(false);
      onMark && onMark();
    } catch (err) {

    }
  }



  if (!marked) {
    return (
      <IconButton
        onClick={handleClickMark}
        className={'ms-3'} size={'large'}>
        <StarBorderIcon color={'inherit'}/>
      </IconButton>
    )
  } else {
    return (
      <IconButton
        onClick={handleClickUnMark}
        className={'ms-3'} size={'large'}>
        <StarIcon color={'warning'}/>
      </IconButton>
    )
  }
}