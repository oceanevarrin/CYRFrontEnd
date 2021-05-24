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
import { Visibility, VisibilityOff } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Alert from "@material-ui/lab/Alert";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { inputStyle, themeColor } from "../../assets/jss/material-react";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import { thunkChangePassword } from "../../store/users/actions";
import { UsersState } from "../../store/users/types";
import BackDrop from "../custom/BackDrop";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      position: "relative",
      padding: theme.spacing(5),
      width: "100%",
      borderRadius: 5,
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(5, 3),
      },
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(5, 2),
      },
    },
    glogin: {
      alignItems: "center",
      backgroundColor: "white",
    },
    submit: {
      marginTop: theme.spacing(2),
      fontSize: 18,
      width: "100%",
      color: "white",
      height: 44,
      backgroundColor: themeColor,
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
  thunkChangePassword: any;
  users: UsersState;
  auth: AuthState;
}

const ChangePassword = ({
  thunkChangePassword,
  users: { changePassword },
}: Props) => {
  const [alert, setAlert] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  useEffect(() => {
    let mounted = true;
    if (mounted) setAlert(changePassword?.loading! === false);
    return () => {
      mounted = false;
    };
  }, [changePassword]);

  const classes = useStyles();
  const [helperText, setHelperText] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { oldPassword, newPassword, confirmPassword } = formData;
  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setHelperText({
        ...helperText,
        confirmPassword: "Password do not match.",
      });
    }
    thunkChangePassword({ oldPassword, newPassword });
  };
  return changePassword?.success ? (
    <Redirect to="/dashboard" />
  ) : (
    <BackDrop>
      <Container maxWidth="xs" className={classes.container}>
        <Paper elevation={10} className={classes.paper}>
          <Link to="/">
            <IconButton
              color="primary"
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                backgroundColor: "#CDD0D344",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box mt="-1rem">
            {alert &&
              (changePassword?.success! ? (
                <Alert
                  onClose={() => setAlert(!alert)}
                  severity="success"
                  color="success"
                >
                  Password successfuly changed.
                </Alert>
              ) : (
                <Alert
                  onClose={() => {
                    setAlert(!alert);
                  }}
                  severity="error"
                  color="error"
                >
                  Failed changing password!
                </Alert>
              ))}
          </Box>
          <Box pr="10%" textAlign="center" mb={2}>
            <Typography variant="h5">Change password</Typography>
          </Box>
          <form noValidate onSubmit={onSubmit} style={{ maxWidth: 480 }}>
            <Box position="relative">
              <InputLabel
                margin="dense"
                style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
              >
                Old password
              </InputLabel>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="oldPassword"
                value={oldPassword}
                onChange={onChange}
                type={show1 ? "text" : "password"}
                id="oldPassword"
                autoComplete="oldPassword"
                error={Boolean(helperText.oldPassword)}
                helperText={helperText.oldPassword}
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
                  onClick={() => setShow1(!show1)}
                  onMouseDown={handleMouseDownPassword}
                >
                  <Box fontSize={16}>
                    {show1 ? (
                      <Visibility fontSize="inherit" />
                    ) : (
                      <VisibilityOff fontSize="inherit" />
                    )}
                  </Box>
                </IconButton>
              </InputAdornment>
            </Box>

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
                type={show2 ? "text" : "password"}
                id="newPassword"
                autoComplete="newPassword"
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
                  onClick={() => setShow2(!show2)}
                  onMouseDown={handleMouseDownPassword}
                >
                  <Box fontSize={16}>
                    {show2 ? (
                      <Visibility fontSize="inherit" />
                    ) : (
                      <VisibilityOff fontSize="inherit" />
                    )}
                  </Box>
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
                type={show3 ? "text" : "password"}
                id="confirmPassword"
                autoComplete="confirmPassword"
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
                  onClick={() => setShow3(!show3)}
                  onMouseDown={handleMouseDownPassword}
                >
                  <Box fontSize={16}>
                    {show3 ? (
                      <Visibility fontSize="inherit" />
                    ) : (
                      <VisibilityOff fontSize="inherit" />
                    )}
                  </Box>
                </IconButton>
              </InputAdornment>
            </Box>
            <Box textAlign="center">
              <Button
                disabled={changePassword?.loading!}
                type="submit"
                size="large"
                variant="text"
                color="inherit"
                value="Login"
                className={clsx(classes.submit)}
              >
                {changePassword?.loading! ? (
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
                  "Change password"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </BackDrop>
  );
};
const mapStateToProps = (state: AppState) => ({
  users: state.users,
  auth: state.auth,
});

export default connect(mapStateToProps, { thunkChangePassword })(
  ChangePassword
);
