import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { inputStyle, themeColor } from "../../assets/jss/material-react";
import { CustomReactLoading } from "../../components/routing/Loading";
import { AppState } from "../../store";
import translate from '../../i18n/translate';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(1),
    boxShadow: theme.shadows[10],
    backgroundColor: "white",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    "&:hover": {
      boxShadow: theme.shadows[24],
    },
    zIndex: theme.zIndex.modal,
  },
  paper: {
    position: "fixed",
    width: "24rem",
    height: "80vh",
    right: theme.spacing(1),
    bottom: 0,
    padding: theme.spacing(2),
    zIndex: theme.zIndex.modal,
  },
  submitButton: {
    background: themeColor,
    boxShadow: theme.shadows[5],
    color: "white",
    "&:hover": {
      boxShadow: theme.shadows[10],
      background: themeColor,
    },
  },
  form: {
    position: "absolute",
    bottom: 10,
    right: 10,
    left: 10,
  },
}));

const Chat = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [m, setM] = useState("");
  const onChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setM(message);
    //send message
  };
  return (
    <Fragment>
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        className={classes.button}
      >
        {translate("Message")}
      </Button>

      <Slide in={open} direction="up">
        <Paper elevation={10} className={classes.paper}>
          <Box textAlign="right">
            <IconButton style={{}} onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />

          <form onSubmit={handleSubmit} className={classes.form}>
            <Box maxWidth="80%">
              <Box display="flex" alignItems="center">
                <Avatar />
                <Typography style={{ marginLeft: 10 }}>Mulusew</Typography>
              </Box>
              <Typography style={{ marginLeft: "3rem" }}>{m}</Typography>
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                required
                variant="outlined"
                placeholder="Write a message..."
                size="small"
                margin="dense"
                type="text"
                name="text"
                id="text"
                value={message}
                autoFocus
                onChange={onChange}
                inputProps={{ style: inputStyle }}
                className="inputRounded"
                // rows={1}
              />
            </Box>
            <Button className={classes.submitButton} fullWidth type="submit">
              {false ? <CustomReactLoading msg="Sending" /> : "Send"}
            </Button>
          </form>
        </Paper>
      </Slide>
    </Fragment>
  );
};
const mapStateToProps = (state: AppState) => ({});
export default connect(mapStateToProps, {})(Chat);
