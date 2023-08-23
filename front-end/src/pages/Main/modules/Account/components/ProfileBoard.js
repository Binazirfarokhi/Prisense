import {Avatar, Box, Button, Grid, TextField, Typography, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {authedRequest} from "../../../../../http";
import EditIcon from '@mui/icons-material/Edit';
import {convertImageToBase64} from "../../../../../utiles";
import { Formik } from 'formik';
import {ToastTypes, useToast} from "../../../../../components/Toast";
export default function ProfileBoard() {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const {show} = useToast();

  useEffect(() => {
    authedRequest.get(`/api/users/profile`)
      .then(res => {
        if (res && res.data) {
          setProfile({
            ...res.data
          })
        }
      })
  }, []);

  const handleSubmit = async (values) => {

      try {
        await authedRequest.put(`/api/users/profile`, {
          username: values.username,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          avatar: profile.avatar
        });
        show(ToastTypes.SUCCESS, "Updated successfully!");
        setEditable(false);
      } catch (err) {

      }
  }

  if (!profile) {
    return <></>;
  }

  return (
    <Box className={"d-flex flex-column"}>
      <label>
        <Avatar
          style={{
            width: "80px",
            height: "80px",
            cursor: editable ? "pointer" : "default",
          }}
          src={profile.avatar}
        />

        {editable && (
          <span
            style={{
              marginLeft: "10px",
              marginTop: "10px",
              fontSize: ".8rem",
            }}
          >
            (Click to upload new avatar.)
          </span>
        )}
        <input
          onChange={async (e) => {
            const file = e.target.files[0];
            try {
              const src = await convertImageToBase64(file);
              setProfile({
                ...profile,
                avatar: src,
              });
            } catch (err) {}
          }}
          accept={"image/*"}
          type={editable ? "file" : "text"}
          hidden
        />
      </label>
      <Formik
        initialValues={{
          ...profile,
          password: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email, please try again.";
          }

          if (!values.phoneNumber) {
            errors.phoneNumber = "Required";
          }

          if (
            (values.password || values.confirmPassword) &&
            values.password !== values.confirmPassword
          ) {
            errors.password =
              "The confirmed password does not match the password. Please make sure to enter the same password in both fields.";
          }

          return errors;
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          return (
            <>
              <Grid container marginTop={"30px"}>
                <Grid item xs={12} lg={2}>
                  <Typography variant={"h6"}>Name</Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    error={editable && errors.username}
                    helperText={(editable && errors.username) || ""}
                    label={"Username"}
                    name={"username"}
                    onChange={handleChange}
                    disabled={!editable}
                    value={values.username}
                  />
                </Grid>
              </Grid>

              <Grid container marginTop={"30px"}>
                <Grid item xs={12} lg={2}>
                  <Typography variant={"h6"}>Email Address</Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    error={editable && errors.email}
                    helperText={(editable && errors.email) || ""}
                    label={"Email"}
                    name={"email"}
                    onChange={handleChange}
                    disabled={!editable}
                    value={values.email}
                  />
                </Grid>
              </Grid>

              <Grid container marginTop={"30px"}>
                <Grid item xs={12} lg={2}>
                  <Typography variant={"h6"}>Phone Number</Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    error={editable && errors.phoneNumber}
                    helperText={(editable && errors.phoneNumber) || ""}
                    label={"Phone Number"}
                    name={"phoneNumber"}
                    onChange={handleChange}
                    disabled={!editable}
                    value={values.phoneNumber}
                  />
                </Grid>
              </Grid>

              <Grid container marginTop={"30px"}>
                <Grid item xs={12} lg={2}>
                  <Typography variant={"h6"}>New Password</Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    error={editable && errors.password}
                    helperText={(editable && errors.password) || ""}
                    label={"New Password"}
                    name={"password"}
                    type={"password"}
                    onChange={handleChange}
                    disabled={!editable}
                    value={values.password}
                  />
                </Grid>
              </Grid>

              <Grid container marginTop={"30px"}>
                <Grid item xs={12} lg={2}>
                  <Typography variant={"h6"}>Confirm New Password</Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    error={editable && errors.password}
                    helperText={(editable && errors.password) || ""}
                    label={"Confirm New Password"}
                    name={"confirmPassword"}
                    type={"password"}
                    onChange={handleChange}
                    disabled={!editable}
                    value={values.confirmPassword}
                  />
                </Grid>
              </Grid>

              <Box marginTop={"20px"}>
                {!editable && (
                  <Button
                    onClick={() => {
                      setEditable(true);
                    }}
                    startIcon={<EditIcon />}
                    variant={"contained"}
                  >
                    Edit
                  </Button>
                )}
                {editable && (
                  <Stack direction={"row"}>
                    <Button
                      className={"me-3"}
                      color={"success"}
                      onClick={handleSubmit}
                      variant={"contained"}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditable(false);
                      }}
                      variant={"contained"}
                      color={"inherit"}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Box>
            </>
          );
        }}
      </Formik>
    </Box>
  );
}
