import { Box, Button, Grid } from "@mui/material";
function getColorByValue(value) {
  let hue, saturation, lightness;

  if (Math.abs(value) > 1) {
    return "#000000";
  }

  if (value >= 0) {
    hue = 0;
    saturation = 100;
    lightness = (1 - value) * 100;
  } else {
    hue = 120;
    saturation = 100;
    lightness = (1 + value) * 50;
  }

  let hslToRgb = function (h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      let hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  let rgbToHex = function (rgb) {
    return (
      "#" +
      rgb
        .map(function (value) {
          let hex = value.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  let rgb = hslToRgb(hue, saturation, lightness);
  let hexColor = rgbToHex(rgb);

  return hexColor;
}

export default function DiffIndex({ value }) {
  return (
    <Box className={"d-flex align-items-center"}>
      {value < 0 && (
        <Box minWidth={"100px"}>
          <Grid container>
            <Grid
              className={"d-flex align-items-center justify-content-end"}
              item
              xs={6}
            >
              <Box
                width={Math.abs(value) * 40 + "px"}
                height={"20px"}
                style={{
                  background: getColorByValue(value),
                }}
              ></Box>
              <Box
                width={"2px"}
                height={"30px"}
                style={{
                  background: "gray",
                }}
              ></Box>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Box>
      )}

      {value > 0 && (
        <Box minWidth={"100px"}>
          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid className={"d-flex align-items-center"} item xs={6}>
              <Box
                width={"2px"}
                height={"30px"}
                style={{
                  background: "gray",
                }}
              ></Box>
              <Box
                width={value * 40 + "px"}
                height={"20px"}
                style={{
                  background: getColorByValue(value),
                }}
              ></Box>
            </Grid>
          </Grid>
        </Box>
      )}

      <Button>{value.toFixed(2)}</Button>
    </Box>
  );
}
