import {
  Box,
  Button,
  CircularProgress,
  Container,
  createStyles,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import HomeIcon from "@material-ui/icons/Home";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppState } from "../../store";
import { thunkResetPassword } from "../../store/users/actions";
import { UsersState } from "../../store/users/types";
import Alert from "@material-ui/lab/Alert";
import { inputStyle, themeColor2 } from "../../assets/jss/material-react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { logo } from "../../assets/img";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      padding: 0,
    },
    paper: {
      padding: theme.spacing(4),
      width: "100%",
      borderRadius: 0,
      border: `1px solid ${grey[300]}`,
      position: "relative",
    },
    glogin: {
      alignItems: "center",
      backgroundColor: "white",
    },
    submit: {
      marginTop: theme.spacing(2),
      width: "100%",
      color: "white",
      backgroundColor: themeColor2,
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },
    alpha: {
      position: "absolute",
      bottom: 0,
      left: "calc(50% - 0rem)",
      fontSize: "10px",
    },
  })
);
interface Props {
  thunkResetPassword: any;
  users: UsersState;
}

const ResetPassword = ({
  thunkResetPassword,
  users: { resetPassword },
}: Props) => {
  const location: any = useLocation();
  const [alert, setAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  useEffect(() => {
    let mounted = true;
    if (mounted) setAlert(resetPassword?.loading! === false);
    return () => {
      mounted = false;
    };
  }, [resetPassword]);
  const classes = useStyles();
  const [helperText, setHelperText] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { newPassword, confirmPassword } = formData;
  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setHelperText({
        ...helperText,
        confirmPassword: "Password do not match",
      });
    }
    thunkResetPassword({
      email: location.state?.email!,
      newPassword,
      resetToken: location.state?.resetToken!,
    });
  };
  return (
    <Container maxWidth="xs" className={classes.container}>
      <Box position="absolute" top={"6rem"} width="100%">
        {alert &&
          (resetPassword?.data !== undefined ? (
            <Alert
              onClose={() => setAlert(!alert)}
              severity="success"
              color="success"
            >
              Password successfully reset.
            </Alert>
          ) : (
            <Alert
              onClose={() => {
                setAlert(!alert);
              }}
              severity="error"
              color="error"
            >
              Password reset failed.
            </Alert>
          ))}
      </Box>
      <Box width="100%">
        <Box position="relative" mb={3} textAlign="center">
          <img src={logo} alt="logo" height="90" />
        </Box>
        <Paper elevation={0} className={classes.paper}>
          <Box position="absolute" top={"1rem"} right={"2rem"}>
            <IconButton component={Link} to="/">
              <HomeIcon style={{ color: grey[300] }} fontSize="large" />
            </IconButton>
          </Box>
          <Box pr="10%" textAlign="center" mb={2}>
            <Typography variant="h5">Reset password</Typography>
          </Box>
          <form noValidate onSubmit={onSubmit}>
            <Box position="relative">
              <InputLabel
                margin="dense"
                style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
              >
                New password
              </InputLabel>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                value={newPassword}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                id="newPassword"
                autoComplete="new-password"
                error={Boolean(helperText.newPassword)}
                helperText={helperText.newPassword}
                inputProps={{ style: inputStyle }}
                className="inputRounded"
              />
              <InputAdornment
                position="end"
                style={{
                  position: "absolute",
                  right: 5,
                  bottom: 25,
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}{" "}
                </IconButton>
              </InputAdornment>
            </Box>

            <Box position="relative">
              <InputLabel
                margin="dense"
                style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
              >
                Confirm password
              </InputLabel>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="confirm-password"
                error={Boolean(helperText.confirmPassword)}
                helperText={helperText.confirmPassword}
                inputProps={{ style: inputStyle }}
                className="inputRounded"
              />
              <InputAdornment
                position="end"
                style={{
                  position: "absolute",
                  right: 5,
                  bottom: 25,
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}{" "}
                </IconButton>
              </InputAdornment>
            </Box>
            <Box textAlign="center">
              <Button
                disabled={resetPassword?.loading!}
                type="submit"
                size="large"
                variant="text"
                color="inherit"
                value="Login"
                className={clsx(classes.submit)}
              >
                {resetPassword?.loading! ? (
                  <Box
                    color="white"
                    fontWeight="bold"
                    alignItems="center"
                    display="flex"
                    height={26}
                  >
                    <CircularProgress color="inherit" size={20} />
                  </Box>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>{" "}
    </Container>
  );
};
const mapStateToProps = (state: AppState) => ({
  users: state.users,
});

export default connect(mapStateToProps, { thunkResetPassword })(ResetPassword);
