import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Theme,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Send } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import classNames from "classnames";
import { DropzoneDialog } from "material-ui-dropzone";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import deal from "../../assets/deal.png";
import { baseURL, instance } from "../../config";
import translate from '../../i18n/translate';
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import {
  thunkGetClients,
  thunkSignContract,
} from "../../store/clients/actions";
import { ClientsState, IClient } from "../../store/clients/types";
// import {
//   thunkGetConversations,
//   thunkGetSingleConversation,
// } from "../../store/conversations/actions";
import {
  ConversationState,
  ConversationTypes,
  IConversations,
} from "../../store/conversations/types";
import {
  thunkGetAllLawyers,
  thunkSetSelectedUser,
} from "../../store/lawyers/actions";
import { thunkGetLawyerProfile } from "../../store/profile/actions";
import { LawyersState } from "../../store/lawyers/types";
import { thunkSendMessage } from "../../store/messages/actions";
import Request from "./Request";
import { Search } from "./Search";
import Titlebar from "./Titlebar";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing(4, "10%"),
  },
  newroot: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    height: "100%",
    borderRadius: 10,
  },
  //
  messageContainer: {
    height: "calc(100% - 3rem)",
    display: "flex",
    alignContent: "flex-end",
    overflow: "auto",
  },
  messagesRow: {
    maxHeight: "calc(100vh - 235px)",
    overflowY: "auto",
  },
  inputRow: {
    // display: "flex",
    // alignItems: "flex-end",
  },
  form: {
    width: "100%",
  },
  newMessageRow: {
    width: "100%",
    padding: theme.spacing(0, 2, 1),
  },
  avatar: {
    margin: theme.spacing(1, 0),
  },
  messageBubble: {
    padding: 10,
    border: "1px solid white",
    backgroundColor: grey[300],
    borderRadius: "0 10px 10px 10px",
    boxShadow: "-3px 4px 4px 0px rgba(0,0,0,0.08)",
    marginTop: 8,
    maxWidth: "40em",
  },
  label: {
    width: "8rem",
    textAlign: "left",
    marginTop: 5,
  },
  messageBubbleRight: {
    borderRadius: "10px 0 10px 10px",
    backgroundColor: "#053F9C",
    color: "white",
  },
  submit: {
    borderRadius: 3,
    width: "30%",
    height: 40,
    color: "white",
    backgroundColor: "#2196f3",
    "&:hover": {
      background: "#40A9E3cc",
      color: "white",
      boxShadow: theme.shadows[3],
    },
  },
  listItem: {
    color: "white",
    display: "flex",
    width: "86%",
  },
  listItemRight: {
    // width: "100%",
    // textAlign: 'right',
    marginLeft: "14%",
    flexDirection: "row-reverse",
  },
  sidbar: {
    height: "calc(100% - 3rem)",
  },
  listText: {
    color: "#dddddd",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
interface Props {
  auth: AuthState;
  clients: ClientsState;
  lawyers: LawyersState;
  conversations: ConversationState;
  thunkGetConversations: any;
  thunkSendMessage: any;
  thunkSetSelectedUser: any;
  thunkGetLawyerProfile: any;
  // thunkGetSingleConversation: any;
  thunkGetClients: any;
  thunkGetAllLawyers: any;
  thunkSignContract: any;
}

const Messages = ({
  auth: { isLawyer, user },
  clients,
  lawyers,
  conversations: {
    // conversations,
    // single_conversation,
    loading_conv,
    selectedUser,
  },
  thunkGetConversations,
  thunkSendMessage,
  // thunkGetSingleConversation,
  thunkGetLawyerProfile,
  thunkGetClients,
  thunkGetAllLawyers,
  thunkSetSelectedUser,
  thunkSignContract,
}: Props) => {
  const classes = useStyles();
  const [language, ] = useState(localStorage.getItem("locale") ===  null ? 'EN' : localStorage.getItem("locale") === 'en-us' ? 'EN' : localStorage.getItem("locale") === 'de-de'? 'DE' : 'FR');
  const currentUserId = Boolean(user?._id) ? user?._id : user?.id;

  const [conversations, setConversations] = useState<any[]>([]);
  const [newConversation, setNewConversation] = useState<any>(null);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = React.useState(false);
  const [recipient, setRecipient] = React.useState<string>("");
  const [firstMessage, setFirstMessage] = useState("");
  const [openBrowser, setopenBrowser] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [request, setRequest] = useState(false);
  const [start, setStart] = useState<boolean | null>(false);
  const [status, setStatus] = useState<boolean | null>(false);
  // const [newMessageId, setNewMessageId] = useState<string | null>(null);
  // const [isNew, setIsNew] = useState<boolean | null>(null);
  console.log(files);

  let conversationLists: IConversations[] | undefined =
    searchInput.length > 0
      ? conversations?.filter(
          (i) => i?.client.first_name.toLocaleLowerCase().match(searchInput)!
        )
      : conversations!;
  const dispatch = useDispatch();

  // const handleRecipient = (recipients: any[]) => {
  //   for (let i = 0; i < recipients.length; i++) {
  //     if (recipients[i].username !== user?.email) {
  //       return recipients[i];
  //     }
  //   }
  //   return null;
  // };
  const handleChat = (c: any) => {
    dispatch({ type: ConversationTypes.SET_USER, payload: c });
    let body = { to: c?.client?._id };
    const api = isLawyer
      ? "/api/lawyer/single-conversation"
      : "/api/client/single-conversation";
    instance()
      .post(api, body)
      .then((res) => setMessages(res.data));
  };

  useEffect(() => {
    const api = isLawyer
      ? "/api/lawyer/conversations"
      : "/api/client/conversations";
    instance()
      .get(api)
      .then((res) => setConversations(res.data));
  }, [newConversation, isLawyer]);

  const reloadMessages = useCallback(() => {
    if (selectedUser !== null) {
      let body = {
        to: selectedUser.client ? selectedUser.client._id : selectedUser._id,
      };
      const api = isLawyer
        ? "/api/lawyer/single-conversation"
        : "/api/client/single-conversation";
      instance()
        .post(api, body)
        .then((res) => setMessages(res.data));
    } else {
      setMessages([]);
    }
  }, [selectedUser, isLawyer]);

  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [lastMessage, reloadMessages, selectedUser]);

  useEffect(() => {
    let socket = socketIOClient(baseURL);
    socket.on("messages", (data: any) => {
      // setNewMessageId(data.id);
      // setLastMessage(data);
      setNewConversation(data);

      return () => {
        socket.removeListener("messages");
      };
    });
  }, []);

  useEffect(() => {
    thunkGetAllLawyers();
    thunkGetClients();
  }, [thunkGetAllLawyers, thunkGetClients]);
  ///////
  let chatBottom = useRef<any>(null);

  useEffect(() => {
    const socket = socketIOClient(baseURL);
    socket.on("messages", (data: any) => {
      
      setLastMessage(data);
      // if(data)
      return () => {
        socket.removeListener("messages");
      };
    });
  }, []);

  const scrollToBottom = () => {
    chatBottom?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (newMessage !== "") {
      setStart(true);
      setStatus(null);

      let body = {
        to: selectedUser.client ? selectedUser.client._id : selectedUser._id,
        body: newMessage,
      };
      const api = isLawyer
        ? "/api/lawyer/post-message"
        : "/api/client/post-message";
      instance()
        .post(api, body)
        .then((res) => {
          // setLastMessage(newMessage);
          setNewMessage("");
          setStart(false);
        });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value.toLocaleLowerCase());
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRecipientsChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRecipient(event.target.value as string);
  };
  let userList = isLawyer ? clients?.clients : lawyers.allLawyers;
  const onChange = async (e: any) => setFirstMessage(e.target.value);

  const handleOpenBrowser = () => {
    setopenBrowser(true);
  };
  const handleSave = (files: any) => {
    setFiles(files);
    setopenBrowser(false);
  };
  const handleCloseBrowser = () => {
    setopenBrowser(false);
  };
  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setStatus(false);
  };
  const sendNewMessage = (e: any) => {
    e.preventDefault();
    setStart(true);
    setStatus(null);
    let newSelectedUser: IClient | null = null;
    thunkSendMessage(recipient, firstMessage).then((s: boolean) => {
      setStatus(!s);
      if (s) {
        userList?.forEach((user) => {
          if (user._id === recipient) {
            newSelectedUser = user;
          }
        });
        // setLastMessage(newMessage);
        console.log("s", newSelectedUser);

        dispatch({
          type: ConversationTypes.SET_USER,
          payload: newSelectedUser,
        });
        setFirstMessage("");
        setRecipient("");
      }

      setStart(false);
      handleClose();
    });
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={2}
            sm={1}
            md={3}
            style={{
              backgroundColor: "#023076",
              borderRight: "1px solid #cccccc",
              height: "100%",
            }}
          >
            <div className={classes.sidbar}>
              <Box
                borderBottom="1px solid #eeeeee"
                // minWidth="10rem"
                height="3rem"
                p={1}
              >
                <Search
                  name="roleSearch"
                  handleSearchChange={handleSearchChange}
                />
              </Box>
              <Box overflow="auto" height="100%">
                {conversationLists?.map((c, i) => (
                  <div key={i}>
                    <ListItem
                      className={classes.listItem}
                      key={c._id}
                      button
                      onClick={() => handleChat(c)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {c?.client?.first_name[0] + c?.client?.last_name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={c?.client?.first_name}
                        className={classes.listText}
                        secondary={
                          <Box
                            overflow="auto"
                            height=""
                            style={{ color: "white" }}
                          >
                            <div style={{display:'flex'}}><p className="text-muted">{c?.lastMessage}{" "}</p></div>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </Box>
            </div>
            <div style={{ height: "3rem" }}>
              <Button
                onClick={handleClickOpen}
                style={{
                  outline: "none",
                  // backgroundColor: "#9f6aae",
                  color: "white",
                }}
              >
                <AddIcon style={{ marginRight: "0.5rem" }} />
                {/* New Message */}
              </Button>
              <Dialog
                open={open}
                fullWidth
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <form onSubmit={sendNewMessage}>
                  <DialogTitle id="form-dialog-title">{translate("New Message")}</DialogTitle>
                  <DialogContent>
                    <Box mt="2rem" display="flex" alignItems="center">
                      <InputLabel className={classes.label}>
                        <h6>{translate("Recipient")}</h6>
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={recipient}
                        fullWidth
                        onChange={handleRecipientsChange}
                      >
                        {userList &&
                          userList.map((client: any) => {
                            return (
                              <MenuItem value={client._id}>
                                {client.first_name + " " + client.last_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </Box>
                    <Box mt="2rem" display="flex" alignItems="center">
                      <InputLabel className={classes.label}>
                        <h6>{language==='EN' ? 'Message': language==='DE' ? 'Nachricht' : 'Message' }</h6>
                      </InputLabel>
                      <TextField
                        required
                        multiline={true}
                        variant="outlined"
                        id="firstMessage"
                        name="firstMessage"
                        value={firstMessage}
                        label={language==='EN' ? 'Message': language==='DE' ? 'Nachricht' : 'Message' }
                        onChange={onChange}
                        fullWidth
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      type="submit"
                      className={classes.submit}
                    >
                      {translate("Send Message")}
                    </Button>
                    <Button
                      onClick={handleClose}
                      style={{ backgroundColor: "#ff6262" }}
                    >
                      {translate("Cancel")}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </div>
          </Grid>
          <Grid item xs={10} sm={11} md={9}>
            {/* <Box
              bgcolor={grey[400]}
              borderBottom="1px solid #eeeeee"
              height="3rem"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box>
                <Typography>
                  {selectedUser?.client
                    ? selectedUser?.client?.first_name +
                      " " +
                      selectedUser?.client?.last_name
                    : selectedUser?.first_name &&
                      selectedUser?.first_name + " " + selectedUser?.last_name}
                </Typography>
              </Box>
            </Box> */}
            <Titlebar
              selectedUser={selectedUser}
              isLawyer={isLawyer!}
              openContract={() => setRequest(true)}
              thunkSetSelectedUser={thunkSetSelectedUser}
              thunkGetLawyerProfile={thunkGetLawyerProfile}
            />
            <Grid container className={classes.messageContainer}>
              <Grid item xs={12} className={classes.messagesRow}>
                {false && !selectedUser ? (
                  <Box pt="5vh" textAlign="center">
                    <CircularProgress />
                  </Box>
                ) : (
                  <List>
                    {messages?.map((m, i) => (
                      <ListItem
                        key={i}
                        className={classNames(classes.listItem, {
                          [`${classes.listItemRight}`]:
                            m.sender === currentUserId,
                        })}
                        alignItems="flex-start"
                      >
                        {/* <ListItemAvatar className={classes.avatar}>
                          <Avatar>
                            {m.sender === currentUserId
                              ? auth.user?.first_name[0]! +
                                auth.user?.last_name[0]!
                              : selectedUser?.client?.first_name[0] +
                                selectedUser?.client?.last_name[0]}
                          </Avatar>
                        </ListItemAvatar> */}
                        <ListItemText
                          classes={{
                            root: classNames(classes.messageBubble, {
                              [`${classes.messageBubbleRight}`]:
                                m.sender === currentUserId,
                            }),
                          }}
                          // primary={m.from && m.from}
                          secondary={
                            <React.Fragment>
                              <span
                                style={{
                                  color:
                                    m.sender === currentUserId
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {m.body}
                              </span>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                <div ref={chatBottom} />
              </Grid>

              <Grid item xs={12} className={classes.inputRow}>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <Box
                    // className={classes.newMessageRow}
                    // alignItems="flex-end"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    {false && <Box minWidth="3rem" mr={0}>
                      <Button onClick={handleOpenBrowser}>
                        <AttachFileIcon />
                      </Button>
                      <DropzoneDialog
                        open={openBrowser}
                        onSave={handleSave}
                        // acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                        showPreviews={true}
                        maxFileSize={5000000}
                        onClose={handleCloseBrowser}
                      />
                    </Box>}
                    {!isLawyer && (
                      <Box width="3rem" ml={2}>
                        <Link
                          to="/messages"
                          onClick={() => setRequest(true)}
                          style={{ outline: "none" }}
                        >
                          <img src={deal} width="70%" height="70%" alt="" />
                        </Link>
                      </Box>
                    )}
                    <Box width="calc(100% - 6rem)">
                      <TextField
                        id="message"
                        label={language==='EN' ? 'Message': language==='DE' ? 'Nachricht' : 'Message' }
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </Box>
                    <Box width="3rem" ml={1}>
                      <IconButton type="submit" style={{ outline: "none" }}>
                        {start ? (
                          <CircularProgress
                            size="2rem"
                            // style={{ marginLeft: "1rem" }}
                          />
                        ) : (
                          <Send style={{ outline: "none" }} />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </form>
                {/* {!isLawyer && (
                  <Box textAlign="right" p="3px 3rem">
                    <Button variant="outlined" onClick={() => setRequest(true)}>
                      Send Request
                    </Button>
                  </Box>
                )} */}
              </Grid>
              <Grid item xs={12} className={classes.inputRow}>
                {/* {files && files} */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {request && (
          <Request
            thunkSignContract={thunkSignContract}
            lawyer={
              selectedUser?.client
                ? selectedUser?.client?._id
                : selectedUser?._id
            }
            handleClose={() => setRequest(false)}
          />
        )}
      </Paper>
      <div className={classes.newroot}>
        <Snackbar
          open={status!}
          autoHideDuration={3000}
          onClose={handleToastClose}
        >
          <Alert onClose={handleToastClose} severity="error">
            Message not sent, please try again!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  clients: state.clients,
  lawyers: state.lawyers,
  conversations: state.conversations,
});
export default connect(mapStateToProps, {
  // thunkGetConversations,
  thunkSendMessage,
  // thunkGetSingleConversation,
  thunkSetSelectedUser,
  thunkGetClients,
  thunkGetAllLawyers,
  thunkSignContract,
  thunkGetLawyerProfile,
})(Messages);
