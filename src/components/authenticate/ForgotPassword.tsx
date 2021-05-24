import {
  Button,
  CircularProgress,
  createStyles,
  FormControl,
  FormControlLabel,
  Slide,
  Typography,
  IconButton,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import { AppState } from "../../store";
import { AlertState } from "../../store/alert/types";
import {
  thunkForgotPassword,
  thunkClientForgotPassword,
} from "../../store/authenticate/actions";
import Checkbox from "@material-ui/core/Checkbox";
import { IErrorMessage } from "../../store/payment/types";
import translate from "../../i18n/translate";

interface Props {
  alerts: AlertState;
  thunkForgotPassword: any;
  thunkClientForgotPassword: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(1),
      paddingRight: "8rem",
    },
    container: {
      height: "42rem",
      paddingTop: "5%",
    },
    glogin: {
      alignItems: "center",
      backgroundColor: "white",
    },
    submit: {
      // margin: theme.spacing(3, 0, 2),
      width: "9.5rem",
      color: "white",
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

interface responseType {
  status: boolean;
  data: IErrorMessage;
}

const ForgotPassword: React.FC<Props> = ({
  thunkForgotPassword,
  thunkClientForgotPassword,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [emailHelper, setemailHelper] = useState("");
  const [withEmail] = useState(true);
  const [emailSuccess, setEmailSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean | null>(false);

  const { email } = formData;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const validateEmail = () => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
    setemailHelper("You have entered an invalid email address!");
    return false;
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setEmailSuccess(null);
    if (validateEmail()) {
      !checked
        ? thunkClientForgotPassword(email).then((response: responseType) => {
            setLoading(false);
            setEmailSuccess(response.data.success);
            setMessage(response.data.message);
            if (response.status && response.data.success) {
              setFormData({
                email: "",
              });
            }
          })
        : thunkForgotPassword(email).then((response: responseType) => {
            setLoading(false);
            setEmailSuccess(response.data.success);
            setMessage(response.data.message);
            if (response.status && response.data.success) {
              setFormData({
                email: "",
              });
            }
          });
    }
  };

  return emailSuccess ? (
    <Box pt="40vh" textAlign="center">
      <h4>
        <b>{translate("Password reset link is sent to your email")}.</b>
      </h4>
      <h5 style={{ fontWeight: "normal" }}>
        {translate("Please check your email to reset your password")}.
      </h5>
    </Box>
  ) : (
    <Container maxWidth="xs" className={classes.container}>
      <Box mt={4} textAlign="center">
        <Slide
          direction="left"
          in={withEmail}
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <div>
            {withEmail && (
              <Box>
                <IconButton
                  component={Link}
                  to="/"
                  style={{ alignContent: "right" }}
                >
                  <img src={transparentLogo} alt="logo" height="90" />
                </IconButton>
                <Box
                  border={1}
                  borderColor="grey.300"
                  p="2rem"
                  mt="1rem"
                  mb="2rem"
                  style={{ backgroundColor: "white" }}
                >
                  <form onSubmit={onSubmit}>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      size="small"
                      margin="normal"
                      type="email"
                      label={translate("Confirmation Email")}
                      name="email"
                      id="email"
                      value={email}
                      autoFocus
                      autoComplete="email"
                      onChange={onChange}
                      onClick={() => setemailHelper("")}
                      helperText={emailHelper}
                      error={Boolean(emailHelper)}
                    />
                    <h6 style={{ fontWeight: "normal" }}>
                      {translate("Your email will never be shared")}
                    </h6>

                    <FormControl component="fieldset">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={handleChange}
                            name="User"
                          />
                        }
                        label={translate("I am a lawyer")}
                      />
                    </FormControl>
                    <Box m={2}>
                      {loading && emailSuccess === null ? (
                        <CircularProgress size={20} />
                      ) : !emailSuccess ? (
                        <Typography color="error">{message}</Typography>
                      ) : null}
                    </Box>
                    <Box
                      justifyContent="space-between"
                      display="flex"
                      alignItems="center"
                      mt="1rem"
                    >
                      <Button
                        type="submit"
                        size="large"
                        variant="text"
                        value="Login"
                        className={clsx(classes.submit)}
                      >
                        {translate("Send Email")}
                      </Button>

                      <Link to="/login">{translate("Back to Login")}</Link>
                    </Box>
                  </form>
                </Box>
              </Box>
            )}
          </div>
        </Slide>
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  alerts: state.alerts,
});

export default connect(mapStateToProps, {
  thunkForgotPassword,
  thunkClientForgotPassword,
})(ForgotPassword);
