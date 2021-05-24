import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Cdivider } from "../../utils/Custum";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CircularProgress, Grid, Snackbar, TextField } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { thunkSetupPayment, thunkGetSubscriptionDetail } from "../../store/payment/actions";
import { AppState } from "../../store";
import { PaymentState, IErrorMessage } from "../../store/payment/types";
import { thunkLoadUser } from '../../store/authenticate/actions';
import translate from "../../i18n/translate";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  layout: {
    width: "auto",
    marginTop: "8%",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    outline: "none",
    background: "#9f6aae",
    color: "white",
    "&:hover": {
      background: "#9f6aae",
      boxShadow: theme.shadows[3],
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "4%",
    },
  },
  backButton: {
    outline: "none",
    background: "#9f6aae",
    color: "white",
    marginBottom: "-5%",
    "&:hover": {
      background: "#9f6aae",
      boxShadow: theme.shadows[3],
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "4%",
    },
  },
}));

interface Props {
  thunkLoadUser: any;
  payment:PaymentState,
  thunkSetupPayment: any;
  thunkGetSubscriptionDetail: any;
}

interface responseType {
  status: boolean,
  data: IErrorMessage
}

const Payment = ({ thunkLoadUser,   payment, thunkSetupPayment,   thunkGetSubscriptionDetail }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const [start, setStart] = useState<boolean | null>(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [exp_month, handleMonthChange] = useState(new Date());
  const [exp_year, handleYearChange] = useState(new Date());
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: 0,
    cvc: 0,
  });
  const { cardName, cardNumber, cvc } = formData;

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const goBack = () => {
    history.push("/dashboard");
  };

  const validateForm = () => {
    let date = new Date();
    let currentMonth = parseInt((date.getMonth() + 1).toString());
    let currentYear = parseInt(date.getFullYear().toString());
    let expiration_year = parseInt(exp_year.getFullYear().toString());
    let expiration_month = parseInt((exp_month.getMonth() + 1).toString());
    if (expiration_year === currentYear) {
      if (expiration_month > currentMonth) {
        return true;
      } else {
        return false;
      }
    } else if (expiration_year > currentYear) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setStart(true);
    let expiration_year = parseInt(exp_year.getFullYear().toString());
    let expiration_month = parseInt((exp_month.getMonth() + 1).toString());
    if (validateForm()) {
      // let body = { expiration_year, expiration_month, cardNumber, cvc };
      // console.log("body", body);

      thunkSetupPayment(
        cardName,
        cardNumber,
        expiration_month,
        expiration_year,
        cvc
      ).then((response: responseType) => {
        
        if (response.status && response.data.success) {
          setOpen(response.status);
          setFormData({
            cardName: "",
            cardNumber: 0,
            cvc: 0,
          });
          setStart(false);
          thunkLoadUser();
          thunkGetSubscriptionDetail();
          setTimeout(() => {
            history.push("/dashboard");
          }, 10000);
          
        } else {
          setErrorMessage(response.data.message);
          setOpenError(true);
          setFormData({
            cardName: "",
            cardNumber: 0,
            cvc: 0,
          });
          setStart(false);
        }
      });
    } else {
      setErrorMessage("Card has already expired!");
      setOpenError(true);
      setStart(false);
    }
    //  && console.log("form data", formData);
  };

  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    event?.preventDefault();
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleErrorToastClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    event?.preventDefault();
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Button onClick={goBack} className={classes.backButton}>
          <ArrowBackIcon style={{ marginRight: "0.5rem" }} /> {translate("Cancel subscription")}
        </Button>

        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {translate("Subscription Form")}
          </Typography>
          <Cdivider />
          <React.Fragment>
            <React.Fragment>
              <form onSubmit={onSubmit}>
                <Typography variant="h6" gutterBottom>
                  {translate("Payment method")}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      name="cardName"
                      id="cardName"
                      label={translate("Name on card")}
                      fullWidth
                      onChange={onChange}
                      autoComplete="cc-name"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      name="cardNumber"
                      id="cardNumber"
                      label={translate("Card number")}
                      fullWidth
                      onChange={onChange}
                      autoComplete="cc-number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        views={["month"]}
                        label={translate("Expiry month")}
                        fullWidth
                        value={exp_month}
                        onChange={handleMonthChange}
                        animateYearScrolling
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        views={["year"]}
                        label={translate("Expiry year")}
                        fullWidth
                        value={exp_year}
                        onChange={handleYearChange}
                        animateYearScrolling
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      id="cvc"
                      name="cvc"
                      label="CVC"
                      helperText={translate("Last three digits on signature strip")}
                      fullWidth
                      onChange={onChange}
                      autoComplete="cc-csc"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <p>
                    {translate("Subscription agreement")}
                    </p>
                  </Grid>
                </Grid>
                {start && <CircularProgress size="2rem" />}
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    //   color="primary"
                    // onClick={handleNext}
                    type="submit"
                    className={classes.button}
                    style={{ marginTop: "3%", width: "25%" }}
                  >
                    {translate("Submit")}
                  </Button>
                </div>
              </form>
              <div className={classes.root}>
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleToastClose}
                >
                  <Alert onClose={handleToastClose} severity="success">
                    Subscription made successfully!
                  </Alert>
                </Snackbar>
              </div>
              <div className={classes.root}>
                <Snackbar
                  open={openError}
                  autoHideDuration={3000}
                  onClose={handleErrorToastClose}
                >
                  <Alert onClose={handleErrorToastClose} severity="error">
                    {errorMessage}
                  </Alert>
                </Snackbar>
              </div>
            </React.Fragment>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
};

const mapStateToProps = (state:AppState) => ({
  // payment:state.payment
});

export default connect(mapStateToProps, {thunkLoadUser,
  thunkSetupPayment, thunkGetSubscriptionDetail
})(Payment);