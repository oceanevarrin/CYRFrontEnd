import {
  Box,
  Button,
  CircularProgress,
  Container,
  createStyles,
  makeStyles,
  Slide,
  TextField,
  IconButton,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import clsx from "clsx";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import { AppState } from "../../store";
import { AlertState } from "../../store/alert/types";
import {
  thunkResetPassword,
  thunkClientResetPassword,
} from "../../store/authenticate/actions";
import { AuthState } from "../../store/authenticate/types";

interface Props {
  auth: AuthState;
  thunkResetPassword: any;
  thunkClientResetPassword: any;
  alerts: AlertState;
  token: string;
  isLawyer: boolean;
}
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      padding: "2rem 1rem",
      margin: "4rem auto",
      textAlign: "center",
    },
    input: {
      border: 0,
      borderRadius: 8,
    },
    form: {
      backgroundColor: "#ffffff",
      padding: "1rem 2rem 2rem",
      margin: "1rem 0rem",
      border: "1px solid #dddddd",
      textAlign: "center",
    },
    submit: {
      marginTop: "1rem",
      color: "#ffffff",
      backgroundColor: "#2196f3",
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
const ResetPassword: React.FC<Props> = ({
  token,
  auth,
  thunkResetPassword,
  thunkClientResetPassword,
  alerts,
  isLawyer,
}) => {
  const classes = useStyles();
  const [isChanged, setIsChanged] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const [helper, sethelper] = useState({
    password: "",
    password2: "",
    error: false,
  });
  const { password, password2 } = formData;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let e = event.target;

    setFormData({ ...formData, [e.name]: e.value });
    if (e.value)
      switch (e.name) {
        case "password":
          if (e.value.length < 8)
            sethelper({
              ...helper,
              [e.name]: "Password should be at least 8 characters long",
            });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        case "password2":
          if (e.value !== password)
            sethelper({ ...helper, [e.name]: "Passwords do not match" });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        default:
          break;
      }
    else sethelper({ ...helper, [e.name]: "" });
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sethelper({ ...helper, error: true });
    if (!(helper.password || helper.password2)) {
      if (password.length < 8)
        sethelper({
          ...helper,
          password: "Password should be at least 8 characters long",
        });
      else if (password !== password2)
        sethelper({ ...helper, password2: "Password do not match" });
      else {
        sethelper({ ...helper, error: false });
        isLawyer
          ? thunkResetPassword(token, password)
          : thunkClientResetPassword(token, password);
        setIsChanged(true);
      }
    }
  };
  if (isChanged) {
    return <Redirect to="/login" />;
  }
  const handleAlert = (n: string) => {
    const registerAlert = alerts?.find((alert) => alert.name === "register");
    const errors = registerAlert?.msg.errors;
    if (n === "Password") return errors?.Password;
    else return registerAlert?.msg.detail;
  };
  const handleAlert2 = () => {
    const registerAlert = alerts?.find((alert) => alert.name === "register");
    const errors = registerAlert?.msg.errors;
    if (Boolean(errors)) return null;
    return registerAlert?.msg.detail;
  };
  return (
    <Slide direction="left" in timeout={400} mountOnEnter unmountOnExit>
      <Container maxWidth="xs" className={classes.container}>
        <IconButton component={Link} to="/" style={{ alignContent: "right" }}>
          <img src={transparentLogo} alt="logo" height="90" />
        </IconButton>
        <form onSubmit={onSubmit} className={clsx(classes.form)}>
          <Typography variant="h6">Enter new password</Typography>
          <Box className="textField-wrapper">
            <TextField
              fullWidth
              required
              size="small"
              margin="normal"
              variant="outlined"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              label="Password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              error={
                Boolean(handleAlert("Password")) ||
                Boolean(helper.password) ||
                helper.error
              }
              helperText={
                handleAlert("Password")
                  ? handleAlert("Password")
                  : helper.password
              }
            />
            {Boolean(password) && !Boolean(helper.password) && (
              <CheckIcon className="check" />
            )}
          </Box>
          {/* <InputLabel shrink>Confirm password</InputLabel> */}
          <Box className="textField-wrapper">
            <TextField
              fullWidth
              required
              size="small"
              margin="normal"
              variant="outlined"
              onClick={() => sethelper({ ...helper, password: "" })}
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              label="Confirm assword"
              name="password2"
              value={password2}
              onChange={onChange}
              error={Boolean(helper.password2) || helper.error}
              helperText={helper.password2}
            />
            {Boolean(password2) && !Boolean(helper.password2) && (
              <CheckIcon className="check" />
            )}
          </Box>
          {auth.loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography color="error" variant="caption">
              {handleAlert2()}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            size="large"
            variant="text"
            color="inherit"
            value="Register"
            className={classes.submit}
          >
            Reset Password
          </Button>
        </form>
      </Container>
    </Slide>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alerts: state.alerts,
});

export default connect(mapStateToProps, {
  thunkResetPassword,
  thunkClientResetPassword,
})(ResetPassword);
