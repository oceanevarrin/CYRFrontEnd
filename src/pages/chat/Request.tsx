import {
  Box,
  Button,
  Container,
  createStyles,
  IconButton,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import clsx from "clsx";
import React, { useState } from "react";
import NumericInput from "react-numeric-input";
import { connect } from "react-redux";
import { inputStyle, themeColor } from "../../assets/jss/material-react";
import BackDrop from "../../components/custom/BackDrop";
import { AppState } from "../../store";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import ErrorMessage from "./ErrorMessage";
import translate from '../../i18n/translate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
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
    label: {
      width: "8rem",
      textAlign: "left",
      marginTop: 5,
    },
    inputWraper: {
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      marginBottom: "2rem",
    },
  })
);
interface Props {
  lawyer: string;
  thunkSignContract: any;
  handleClose: any;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Request = ({ thunkSignContract, lawyer, handleClose }: Props) => {
  let [formData, setFormData] = useState({
    price: 0,
    contract_title: "",
  });

  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [succeOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);

  const { price, contract_title } = formData;
  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChange = (
    value: number | null,
    stringValue: string,
    input: HTMLInputElement
  ) => {
    setFormData({ ...formData, price: value! });
  };

  const validate = () => {
    if (price === 0) {
      setMessage("Amount can not be 0!");
      return false;
    } else if(lawyer === "" || lawyer === null || lawyer === undefined){
      setMessage(" Lawyer hasn't been selected from chat");
      return false;
    }else {
      return true;
    }
  };

  const handleErrorToastClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  const handleSuccessToastClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log("this is the lawyer", lawyer);
    
    if (validate()) {
      thunkSignContract(contract_title, lawyer, price).then((s: boolean) => {
        if (s) {
          setSuccessOpen(true);
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else {
          setErrorOpen(true);
        }
      });
    }
  };
  return (
    <BackDrop>
      <Container maxWidth="xs" className={classes.container}>
        <Paper elevation={10} className={classes.paper}>
          <IconButton
            onClick={handleClose}
            color="primary"
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              backgroundColor: "#CDD0D344",
            }}
          >
            <Close />
          </IconButton>

          <Box pr="10%" textAlign="center" mb={2}>
            {message ? <ErrorMessage msg={message} /> : null}
            <Typography variant="h5">{translate("Request Form")}</Typography>
          </Box>
          <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
            <Box position="relative">
              <InputLabel
                margin="dense"
                style={{ textAlign: "left", marginBottom: 10, fontSize: 13 }}
              >
                {translate("Work Title")}
              </InputLabel>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="contract_title"
                value={contract_title}
                onChange={onChange}
                type="text"
                id="contract_title"
                autoComplete="contract_title"
                inputProps={{ style: inputStyle }}
                className="inputRounded"
              />
            </Box>
            <Box className={classes.inputWraper} mt="2rem">
              <InputLabel className={classes.label}>
                <b>{translate("Price")}</b>
              </InputLabel>
              <NumericInput
                required
                onChange={handleChange}
                min={0}
                max={1000000}
                value={price}
              />
              <h6 style={{ marginLeft: "4%" }}> CHF</h6>
            </Box>
            <Box textAlign="center">
              <Button
                type="submit"
                size="large"
                variant="text"
                color="inherit"
                value="Login"
                className={clsx(classes.submit)}
              >
                {translate("Send Request")}
              </Button>
            </Box>
          </form>
        </Paper>
        <div className={classes.root}>
          <Snackbar
            open={succeOpen}
            autoHideDuration={3000}
            onClose={handleSuccessToastClose}
          >
            <Alert onClose={handleSuccessToastClose} severity="success">
              {translate("Job offered to lawyer successfully")}!
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorOpen}
            autoHideDuration={3000}
            onClose={handleErrorToastClose}
          >
            <Alert onClose={handleErrorToastClose} severity="error">
              {translate("Job can not be offered please try again")}!
            </Alert>
          </Snackbar>
        </div>
      </Container>
    </BackDrop>
  );
};
const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, {})(Request);
