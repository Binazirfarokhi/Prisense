import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
const NotifItem = ({ title, description, time, favourite, popup = false }) => {
  return (
    <div className="d-flex gap-2 my-2 w-100">
      <div
        className="rounded-circle "
        style={{ width: "30px", height: "30px", backgroundColor: "#555" }}
      />
      <div className={`d-flex flex-column ${!popup && "gap-4"} w-100`}>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <Typography>{title}</Typography>
            {!popup && <Typography>{description}</Typography>}
          </div>
          {!popup && <>{favourite ? <StarIcon /> : <StarBorderIcon />}</>}
        </div>
        <Typography>{time}</Typography>
      </div>
    </div>
  );
};

export default NotifItem;
