import {Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate(-1)
      }}
      startIcon={<ArrowBackIcon />}
      variant={'contained'}>
      Back
    </Button>
  )
}