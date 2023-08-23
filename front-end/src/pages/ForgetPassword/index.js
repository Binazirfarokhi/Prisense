import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Box,
  } from "@mui/material";
  import UserBG from "../../assets/userbg.svg";
  import Logo from "../../assets/translogo.png";
  import { useState } from "react";
  import { ToastTypes, useToast } from "../../components/Toast";
  import { authedRequest } from "../../http";
  import BackButton from "../../components/BackButton";
  export default function ForgetPassword() {
    const { show } = useToast();
  
    const [email, setEmail] = useState("");
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleClickResetPassword = async (e) => {
      e.preventDefault();
      try {
        await authedRequest.post(`/api/users/request-reset-password`, {
          email,
        });
        show(
          ToastTypes.SUCCESS,
          "We have the reset password link to your email! Please look up!"
        );
      } catch (err) {
        if (err.response.status === 404) {
          show(ToastTypes.WARNING, "This email not found!");
        }
      }
    };
  
    return (
      <Container>
        <Paper className={"mt-5"} elevation={4}>
          <Grid container>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
              item
              xs={12}
              md={6}
            >
              <Grid item style={{ position: "relative" }}>
                <img src={UserBG} width={"100%"} alt="loginBG" />
                <img
                  src={Logo}
                  alt="logo"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "35%",
                    height: "auto",
                  }}
                />
              </Grid>
            </Grid>
            <Grid className={"p-3"} item xs={12} lg={6}>
              <BackButton />
              <form onSubmit={handleClickResetPassword}>
                <Typography variant={"h4"} className={"mt-4"}>
                  Forget Password
                </Typography>
  
                <Box className={"mt-3"}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    required
                    type={"email"}
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Box>
  
                <Box className={"mt-4"}>
                  <Button type={"submit"} variant="contained" color="primary">
                    Reset
                  </Button>
                </Box>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
  