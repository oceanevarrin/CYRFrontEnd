import {
  Box,
  Button,
  Container,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  Radio,
  Slide,
  TextField,
  Theme,
  Typography,
  withStyles,
  Checkbox,
  FormLabel,
  Link as LinkM,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import samplePDF from "./tos.pdf";
import { green } from "@material-ui/core/colors";
import { RadioProps } from "@material-ui/core/Radio";
import CheckIcon from "@material-ui/icons/Check";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import { inputStyle } from "../../assets/jss/material-react";
import { AppState } from "../../store";
import { AlertState } from "../../store/alert/types";
import { thunkRegister } from "../../store/authenticate/actions";
import { AuthState } from "../../store/authenticate/types";
import { validateEmail } from "../../utils/utils";
import { CustomReactLoading } from "../routing/Loading";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import translate from "../../i18n/translate";
import { EnglishError } from "../../pages/lawyer/data";
import { FrenchError } from "../../pages/lawyer/frenchData";
import { GermanError } from "../../pages/lawyer/germanData";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: "2.5rem 0",
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
      // '& TextField': {
      //     marginTop: '2rem',
      // },
    },
    formControl: {
      marginLeft: "-35%",
      marginTop: theme.spacing(3),
      // marginLeft: theme.spacing(0),
    },
    submit: {
      height: 40,
      marginTop: "1rem",
      color: "#ffffff",
      backgroundColor: "#2196f3",
      "&:hover": {
        background: "#40A9E3cc",
        color: "white",
        boxShadow: theme.shadows[3],
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

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

interface Props {
  auth: AuthState;
  alerts: AlertState;
  thunkRegister: any;
}
const Register: React.FC<Props> = ({ auth, alerts, thunkRegister }) => {
  const classes = useStyles();
  const [modal, setModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [userType, setUserType] = React.useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
  });
  const [helper, sethelper] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    error: false,
    other: "",
  });
  useEffect(() => {
    const h = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      other: "",
      error: false,
      password2: "",
    };
    sethelper(h);
  }, []);

  const { firstname, lastname, email, password, password2 } = formData;
  let err =
    localStorage.getItem("locale") === "en-us"
      ? EnglishError
      : localStorage.getItem("locale") === "de-de"
      ? GermanError
      : FrenchError;
  let passErr =
    localStorage.getItem("locale") === "en-us" ||
    localStorage.getItem("locale") === null
      ? "Password should be at least 8 characters long"
      : localStorage.getItem("locale") === "de-de"
      ? "Das Passwort sollte mindestens 8 Zeichen lang sein"
      : "Le mot de passe doit comporter au moins 8 caractères";
  let emailErr =
    localStorage.getItem("locale") === "en-us" ||
    localStorage.getItem("locale") === null
      ? "Please include an '@' in the email address"
      : localStorage.getItem("locale") === "de-de"
      ? "Bitte fügen Sie ein '@' in die E-Mail Adresse ein"
      : "Veuillez inclure un '@' dans l'adresse électronique";
  const [agreed, setAgreed] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let e = event.target;
    setFormData({ ...formData, [e.name]: e.value });
    if (e.value)
      switch (e.name) {
        case "firstname":
          if (e.value.length < 3)
            sethelper({
              ...helper,
              [e.name]: err[0],
            });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        case "lastname":
          if (e.value.length < 3)
            sethelper({
              ...helper,
              [e.name]: err[1],
            });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        case "email":
          if (validateEmail(e.value)) sethelper({ ...helper, [e.name]: "" });
          else
            sethelper({
              ...helper,
              [e.name]: Boolean(e.validationMessage) ? emailErr : err[2],
            });
          break;
        case "password":
          if (e.value.length < 8)
            sethelper({
              ...helper,
              [e.name]: passErr,
            });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        case "password2":
          if (e.value !== password) sethelper({ ...helper, [e.name]: err[3] });
          else sethelper({ ...helper, [e.name]: "" });
          break;
        default:
          break;
      }
    else sethelper({ ...helper, [e.name]: "" });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  const handleClickOpen = () => {
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !(
        helper.firstname ||
        helper.lastname ||
        helper.email ||
        helper.password ||
        helper.password2
      )
    ) {
      if (password.length < 8)
        sethelper({
          ...helper,
          password: "Password should be at least 8 characters long",
        });
      else if (password !== password2)
        sethelper({ ...helper, password2: "Password do not match" });
      else {
        const type: boolean = userType === "lawyer";
        if (agreed) {
          thunkRegister(firstname, lastname, email, password, type);
          setFormData({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            password2: "",
          });
          setUserType("");
        } else {
          console.log(agreed);
          setOpen(true);
        }
      }
    }
  };

  const handleAlert = (n?: string) => {
    const registerAlert = alerts?.find((alert) => alert.name === "register");
    const errors = registerAlert?.msg.errors;

    if (n === "Name") return errors?.Name;
    else if (n === "Password") return errors?.Password;
    else if (n === "email") return errors?.email;
    else return registerAlert?.msg.error;
  };

  if (auth.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  // if (agreed) {
  //   handleClickOpen("paper");
  // }

  return (
    <Slide direction="left" in timeout={400} mountOnEnter unmountOnExit>
      <Container maxWidth="xs" className={classes.container}>
        <Box position="relative">
          <IconButton component={Link} to="/" style={{ alignContent: "right" }}>
            <img src={transparentLogo} alt="logo" height="90" />
          </IconButton>
          {/* <Text variant="caption" className={classes.alpha}>
                        ALPHA
                    </Text> */}
        </Box>
        <form onSubmit={onSubmit} className={clsx(classes.form)}>
          <Typography variant="h6">
            {translate("Create your account")}
          </Typography>

          <Box className="textField-wrapper">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InputLabel
                  margin="dense"
                  style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
                >
                  {translate("First Name")}
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  margin="normal"
                  type="text"
                  name="firstname"
                  id="name"
                  value={firstname}
                  autoFocus
                  autoComplete="firstname"
                  onChange={onChange}
                  error={Boolean(helper.firstname) || helper.error}
                  helperText={helper.firstname}
                  inputProps={{ style: inputStyle }}
                />
                {Boolean(firstname) && !Boolean(helper.firstname) && (
                  <CheckIcon className="check" />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel
                  margin="dense"
                  style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
                >
                  {translate("Last Name")}
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  margin="normal"
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={lastname}
                  autoFocus
                  autoComplete="lastname"
                  onChange={onChange}
                  error={Boolean(helper.lastname) || helper.error}
                  helperText={helper.lastname}
                  inputProps={{ style: inputStyle }}
                />
                {Boolean(lastname) && !Boolean(helper.lastname) && (
                  <CheckIcon className="check" />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box className="textField-wrapper">
            <InputLabel
              margin="dense"
              style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
            >
              {translate("Email")}
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
              autoComplete="email"
              onChange={onChange}
              error={Boolean(helper.email) || helper.error}
              helperText={helper.email}
              inputProps={{ style: inputStyle }}
            />
            {Boolean(email) && !Boolean(helper.email) && (
              <CheckIcon className="check" />
            )}
          </Box>
          <Box className="textField-wrapper">
            <InputLabel
              margin="dense"
              style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
            >
              {translate("Password")}
            </InputLabel>
            <TextField
              fullWidth
              required
              size="small"
              margin="normal"
              variant="outlined"
              type="password"
              autoComplete="new-password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              error={Boolean(helper.password) || helper.error}
              helperText={helper.password}
              inputProps={{ style: inputStyle }}
            />
            {Boolean(password) && !Boolean(helper.password) && (
              <CheckIcon className="check" />
            )}
          </Box>
          <Box className="textField-wrapper">
            <InputLabel
              margin="dense"
              style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
            >
              {translate("Confirm password")}
            </InputLabel>
            <TextField
              fullWidth
              required
              size="small"
              margin="normal"
              variant="outlined"
              onClick={() => sethelper({ ...helper, password: "" })}
              type="password"
              autoComplete="new-password"
              name="password2"
              value={password2}
              onChange={onChange}
              error={Boolean(helper.password2) || helper.error}
              helperText={helper.password2}
              inputProps={{ style: inputStyle }}
            />
            {Boolean(password2) && !Boolean(helper.password2) && (
              <CheckIcon className="check" />
            )}
          </Box>
          <Grid xs={12}>
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">
                Agree on Terms of Services
              </FormLabel> */}
              <FormGroup>
                <FormLabel style={{ width: "100%" }}>
                  <LinkM
                  style={{cursor: 'pointer'}}
                  onClick={handleClickOpen}
                    // href="http://localhost:3000/#/terms-of-services"
                    // target="_blank"
                  >
                    {translate("Read Terms of services")}
                  </LinkM>
                </FormLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreed}
                      onChange={handleCheckboxChange}
                      name="agreed"
                    />
                  }
                  label={translate("Agree")}
                />
              </FormGroup>
            </FormControl>
          </Grid>
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
          {!auth.loading && (
            <Typography color="error" variant="caption">
              {handleAlert()}
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
            {auth.loading ? <CustomReactLoading /> : translate("Continue")}
          </Button>
        </form>
        {translate("Already have an account?")}
        <Link
          to="/login"
          style={{ color: "#2196f3", fontSize: 15, marginLeft: "1rem" }}
        >
          <u>{translate("Sign in")}</u>
        </Link>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {translate("Please agree on the terms of services!")}
          </Alert>
        </Snackbar>
        <Dialog
          open={modal}
          onClose={handleModalClose}
          aria-labelledby="form-dialog-title"
          // style={{width:'1000px'}}
        >
          <Box display="flex" style={{justifyContent: 'space-between'}}>
          <DialogTitle id="form-dialog-title">Terms of Services</DialogTitle>
          <Button onClick={handleModalClose}>Go Back</Button>
          </Box>
          <DialogContent>
          <iframe title="termsofservice" src={samplePDF} style={{width:"600px", height:"600px"}} frameBorder="0"></iframe>
          </DialogContent>
        </Dialog>
      </Container>
    </Slide>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alerts: state.alerts,
});

export default connect(mapStateToProps, { thunkRegister })(Register);
