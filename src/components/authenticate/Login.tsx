import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioProps,
  Slide,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { green, grey } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { Link, Redirect, useHistory } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import { inputStyle } from "../../assets/jss/material-react";
import { AppState } from "../../store";
import { thunkLogin, thunkTrialPeriod } from "../../store/authenticate/actions";
import { AuthState } from "../../store/authenticate/types";
import { LawyersState } from "../../store/lawyers/types";
import { validateEmail } from "../../utils/utils";
import { CustomReactLoading } from "../routing/Loading";
import { thunkGetClients } from "../../store/clients/actions";
import { thunkGetAllRegisteredLawyers } from "../../store/lawyers/actions";
import { thunkLoadUser } from "../../store/authenticate/actions";
import { thunkGetLawyerProfile } from "../../store/profile/actions";
import { thunkGetProfilePicture } from "../../store/lawyers/actions";
import { AlertState } from "../../store/alert/types";
import translate from "../../i18n/translate";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: "2.5rem 0",
    textAlign: "center",
  },
  form: {
    border: "1px solid " + grey[300],
    padding: "1.5rem 2rem 2.5rem",
    margin: "2rem 0",
    backgroundColor: theme.palette.background.paper,
  },
  submit: {
    borderRadius: 3,
    width: "9rem",
    height: 40,
    color: "white",
    backgroundColor: "#2196f3",
    "&:hover": {
      background: "#40A9E3cc",
      color: "white",
      boxShadow: theme.shadows[3],
    },
  },
  signinwithEmail: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  gbutton: {
    backgroundColor: "white",
    border: "1px solid",
    borderColor: grey[300],
    width: "100%",
    borderRadius: 0,
    marginTop: "2rem",
    height: 49,
    "&:hover": {
      backgroundColor: grey[50],
      color: grey[600],
    },
  },
}));
const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

interface ResponseType {
  status: boolean;
  data: { error: string };
}

interface Props {
  thunkLogin: any;
  auth: AuthState;
  alerts: AlertState;
  lawyers: LawyersState;
  thunkGetClients: any;
  thunkTrialPeriod: any;
  thunkGetAllRegisteredLawyers: any;
  thunkSigninWithMicrosoft: any;
  thunkLoadUser: any;
  thunkGetLawyerProfile: any;
  thunkGetProfilePicture: any;
}
const Login: React.FC<Props> = ({
  thunkSigninWithMicrosoft,
  thunkLogin,
  thunkGetAllRegisteredLawyers,
  thunkGetClients,
  thunkLoadUser,
  thunkGetLawyerProfile,
  thunkTrialPeriod,
  thunkGetProfilePicture,
  auth: { isAuthenticated, loading, user, isLawyer },
  lawyers,
  alerts,
}) => {
  const location = useLocation();
  const history = useHistory();
  const params = qs.parse(location.search);
  const [allowSubscription, setAllowSubscription] = useState(false);
  const [userType, setUserType] = React.useState("lawyer");
  const classes = useStyles();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailHelper, setemailHelper] = useState("");
  const [withEmail, setwithEmail] = useState(true);
  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };
  useEffect(() => {
    let mounted = true;
    if (mounted)
      if (Boolean(params.code)) thunkSigninWithMicrosoft(params.code);
    return () => {
      mounted = false;
    };
  }, [params.code, thunkSigninWithMicrosoft]);
  if (Boolean(params.Email) && Boolean(params.ResetToken)) {
    return (
      <Redirect
        to={{
          pathname: "/reset-password",
          state: { email: params.Email, resetToken: params.ResetToken },
        }}
      />
    );
  }

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAlert = () => {
    const loginAlert = alerts?.find((alert) => alert.name === "login");
    return <Typography color="error">{loginAlert?.msg.error}</Typography>;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const type: boolean = userType === "lawyer";
    if (validateEmail(email)) {
      thunkLogin(email, password, type).then((response: ResponseType) => {
        console.log("Response ",response);
        
        if (
          !response.status &&
          response.data.error === "Your free trial session has expired!"
        ) {
          setAllowSubscription(true);
        }
      });
    } else
      setemailHelper(
        (translate(
          "You have entered an invalid credential!"
        ) as unknown) as string
      );
  };

  const handleEmailSignIn = () => {
    setwithEmail(!withEmail);
  };
  if (
    isAuthenticated &&
    lawyers?.selectedLawyer == null &&
    user.role === "admin"
  ) {
    thunkGetClients();
    thunkGetAllRegisteredLawyers();
    return <Redirect to="/lawyers" />;
  } else if (isAuthenticated && lawyers?.selectedLawyer) {
    thunkGetLawyerProfile(lawyers?.selectedLawyer?.lawyer._id);
    return <Redirect to="/lawyer-detail" />;
  } else if (
    isAuthenticated &&
    lawyers?.selectedLawyer == null &&
    user.role !== "admin"
  ) {
    thunkTrialPeriod();
    thunkLoadUser(isLawyer);
    // thunkGetProfilePicture();
    return <Redirect to="/dashboard" />;
  }

  const subscribe = () => {
    history.push('/subscribe');
  };

  return (
    <Slide direction="left" in timeout={300} mountOnEnter unmountOnExit>
      <Container maxWidth="xs" className={classes.container}>
        <div>
          <IconButton component={Link} to="/" style={{ alignContent: "right" }}>
            <img src={transparentLogo} alt="logo" height="90" />
          </IconButton>
          {withEmail && (
            <form onSubmit={onSubmit} className={classes.form}>
              <Typography variant="h6">
                {translate("Sign in to your account")}{" "}
              </Typography>
              <InputLabel
                margin="dense"
                style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
              >
                Email
              </InputLabel>
              <TextField
                fullWidth
                required
                variant="outlined"
                size="small"
                margin="normal"
                type="email"
                name="email"
                id="email"
                value={email}
                autoFocus
                autoComplete="email"
                onChange={onChange}
                onClick={() => setemailHelper("")}
                helperText={emailHelper}
                error={Boolean(emailHelper)}
                inputProps={{ style: inputStyle }}
                className="inputRounded"
              />
              <Box position="relative">
                <InputLabel
                  margin="dense"
                  style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
                >
                  {translate("Password")}
                </InputLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  value={password}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
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
              <Grid xs={12}>
                <FormControlLabel
                  value=""
                  control={
                    <GreenRadio
                      checked={userType === "lawyer"}
                      onChange={handleChange}
                      value="lawyer"
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "Lawyer" }}
                    />
                  }
                  label={translate("Lawyer")}
                />

                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      checked={userType === "client"}
                      onChange={handleChange}
                      value="client"
                      required
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "Client" }}
                    />
                  }
                  label={translate("Client")}
                />
              </Grid>
              {!loading && (
                <Typography variant="caption" color="error">
                  {handleAlert()}
                </Typography>
              )}
              <Box
                justifyContent="space-between"
                display="flex"
                alignItems="center"
                mt="1.6rem"
              >
                <Link
                  to="/forgot-password"
                  style={{ color: "#2196f3", fontSize: 15 }}
                >
                  <u>{translate("Forgot password")}</u>
                </Link>
                <Button
                  disabled={loading!}
                  type="submit"
                  size="large"
                  variant="text"
                  value="Login"
                  className={clsx(classes.submit)}
                >
                  {loading ? (
                    <Box
                      color="white"
                      fontWeight="bold"
                      alignItems="center"
                      display="flex"
                      height={26}
                    >
                      <CustomReactLoading color="white" />
                    </Box>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Box>
            </form>
          )}
          <Divider style={{ margin: "2rem 0rem" }} />
          {allowSubscription && (
            <Box>
              <Button
                type="submit"
                size="large"
                variant="text"
                value="Subscribe"
                className={clsx(classes.submit)}
                style={{
                  width: "70%",
                  marginBottom: "5%",
                }}
                onClick={subscribe}
              >
                Subscribe to unlock
              </Button>
            </Box>
          )}
          {withEmail ? (
            <Divider />
          ) : (
            <Button onClick={handleEmailSignIn} className={classes.gbutton}>
              <Box display="flex" alignItems="center" width="100%" pl="1rem">
                <span style={{ fontSize: 27 }}>@</span>
                <Box
                  height="2.2rem"
                  borderLeft={1}
                  borderColor="grey.300"
                  ml="1.3rem"
                  mr="1.5rem"
                />
                <span>{translate("Sign in with Email")}</span>
              </Box>
            </Button>
          )}
          {/* <GoogleLogin /> */}
          {/* <LoginWithMicrosoft /> */}
          <Box mt="1.6rem" pr="2rem">
            {translate("no account?")}{" "}
            <Link to="/register" style={{ color: "#2196f3" }}>
              <u>{translate("Sign up")}</u>
            </Link>
          </Box>
        </div>
      </Container>
    </Slide>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alerts: state.alerts,
  lawyers: state.lawyers,
});

export default connect(mapStateToProps, {
  thunkLogin,
  thunkGetClients,
  thunkGetAllRegisteredLawyers,
  thunkLoadUser,
  thunkGetLawyerProfile,
  thunkGetProfilePicture,
  thunkTrialPeriod,
})(Login);
