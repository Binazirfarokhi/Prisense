import {Container, Grid, Paper, Typography, Button, TextField, Box} from "@mui/material";
import UserBG from '../../assets/userbg.svg';
import Logo from '../../assets/translogo.png'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {authedRequest} from "../../http";
import {useAuthContext} from "../../auth";
import {ToastTypes, useToast} from "../../components/Toast";
import theme from '../../style/MUItheme'
import { ThemeProvider } from '@mui/material/styles';

export default function SignIn() {


  const {login} = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {show} = useToast();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authedRequest.post(`/api/users/login`, {
        email,
        password
      });
      const data = res.data;
      login(data.token, data.userData)
        .then(() => {
          show(ToastTypes.SUCCESS, "Login successfully! Welcome!");
          navigate('/main');
        })
    } catch (err) {
      if (err.response.status === 401) {
        show(ToastTypes.WARNING, "Please activate your account, we have send an message to your email!");
      } else if (err.response.status === 400) {
        show(ToastTypes.WARNING, "Your password or email is incorrect!");
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

          <ThemeProvider theme={theme}>
          <Grid className={'p-3'} item xs={12} lg={6} display="flex" justifyContent="center" alignItems="center">
            <form onSubmit={handleLogin}>
              <Typography variant={'h4'} className={'mt-4'} marginBottom={'30%'}>
                Welcome!
              </Typography>
              <Box className={'mt-3'} display="flex" justifyContent="center" alignItems="center">
                <TextField
                  label="Email"
                  variant="outlined"
                  required
                  width="60%"
                  InputLabelProps={{ shrink: true }}
                  // fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
              </Box>
              <Box className={'mt-3'} display="flex" justifyContent="center" alignItems="center"> 
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  width="60%"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Box>
              <Box className={'mt-3'} textAlign={'end'}>
                <Link to={'/forget-password'}>Forget Password?</Link>
              </Box>
              <Box className={'mt-4'} display="flex" justifyContent="center" alignItems="center">
                <Button type={'submit'} variant="contained" >
                  Login
                </Button>
              </Box>
              <Box className={'mt-5 pt-5 d-flex justify-content-center'}>
                <Typography variant={'subtitle1'} className={'me-2'}>
                  Do not have an account?
                </Typography>
                <Link to={'/register'}>
                  Sign Up
                </Link>
              </Box>
            </form>
          </Grid>
          </ThemeProvider>
        </Grid>
      </Paper>
    </Container>
  )
}