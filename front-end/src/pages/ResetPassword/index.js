import {Container, Grid, Paper, Typography, Button, TextField, Box} from "@mui/material";
import UserBG from '../../assets/userbg.svg';
import Logo from '../../assets/translogo.png'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ToastTypes, useToast} from "../../components/Toast";
import {authedRequest} from "../../http";

export default function ResetPassword() {
  const searchStr = window.location.search;
  const {show} = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }



  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return show(ToastTypes.WARNING, "Two passwords not same!");
    }
    try {
      const res = await authedRequest.put(`/api/users/reset-password`, {
        email: email,
        newPassword: password,
        resetToken: searchStr.split('=')[1]
      });

      show(ToastTypes.SUCCESS, "Reset successfully!");
      navigate('/login', {replace: true});
    } catch (err) {
      if (err.response.status === 403) {
        show(ToastTypes.WARNING, "Forbidden change!");
      }
    }


  };

  return (
    <Container >
      <Paper className={'mt-5'} elevation={4}>
        <Grid container>
          <Grid container justifyContent="center" alignItems="center" spacing={2} item xs={12} md={6}>
            <Grid item style={{ position: 'relative' }}>
              <img src={UserBG} width={'100%'} alt="loginBG" />
              <img src={Logo} alt="logo" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '35%', height: 'auto' }} />
            </Grid>
            
          </Grid>
          <Grid className={'p-3'} item xs={12} lg={6}>
            <form onSubmit={handleResetPassword}>
              <Typography variant={'h4'} className={'mt-4'}>
                Reset Password
              </Typography>
              <Box className={'mt-3'}>
                <TextField
                  label="Email"
                  variant="outlined"
                  required
                  type={'email'}
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
              </Box>
              <Box className={'mt-3'}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  required
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Box>
              <Box className={'mt-3'}>
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  required
                  fullWidth
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </Box>
              <Box className={'mt-3'} textAlign={'end'}>
                <Link to={'/forget-password'}>Forget Password?</Link>
              </Box>
              <Box className={'mt-4'}>
                <Button type={'submit'} variant="contained" color="primary" >
                  Create
                </Button>
              </Box>
              <Box className={'mt-5 pt-5 d-flex justify-content-center'}>
                <Typography variant={'subtitle1'} className={'me-2'}>
                  Already have an account?
                </Typography>
                <Link to={'/login'}>
                  Log In
                </Link>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}