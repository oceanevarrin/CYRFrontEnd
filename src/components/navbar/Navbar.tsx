import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  createStyles,
  Dialog,
  FormControl,
  Hidden,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  Slide,
  Tab,
  Tabs,
  Theme,
  Typography,
  Snackbar,
  DialogContentText,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import SettingsIcon from "@material-ui/icons/Settings";
import Popover from "@material-ui/core/Popover";
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import {
  breakpoints,
  down,
  navbarStyles,
  tabHeight,
  up,
} from "../../assets/jss/navbarStyles";
import { AppState } from "../../store";
import { logout, thunkLoadUser } from "../../store/authenticate/actions";
import { IErrorMessage } from "../../store/payment/types";
import {
  thunkCancelSubscription,
  thunkGetSubscriptionDetail,
} from "../../store/payment/actions";
import { AuthState } from "../../store/authenticate/types";
import { Text } from "../../utils/Custum";
import Routes from "../routing/Routes";
import translate from "../../i18n/translate";
import { LOCALES } from "../../i18n";
// import { Notification } from "./Notification";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const HideDown = (props: any) => (
  <Hidden smDown={down === "sm"} mdDown={down === "md"}>
    {props.children}
  </Hidden>
);

const HideUp = (props: any) => (
  <Hidden mdUp={up === "md"} lgUp={up === "lg"}>
    {props.children}
  </Hidden>
);
interface Props {
  auth: AuthState;
  // layout: string;
  logout: any;
  setLocale: any;
  thunkLoadUser: any;
  thunkCancelSubscription: any;
  thunkGetSubscriptionDetail: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 20,
      marginRight: "13%",
    },
    selectEmpty: {
      // marginTop: theme.spacing(2),
    },
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: theme.spacing(1),
    },
  })
);

interface responseType {
  status: boolean;
  data: IErrorMessage;
}

const Navbar = ({
  auth,
  logout,
  setLocale,
  thunkLoadUser,
  thunkCancelSubscription,
  thunkGetSubscriptionDetail,
}: Props) => {
  const classes = navbarStyles();
  const customClasses = useStyles();
  const [language, setLanguage] = useState(
    localStorage.getItem("locale") === null
      ? "EN"
      : localStorage.getItem("locale") === "en-us"
      ? "EN"
      : localStorage.getItem("locale") === "de-de"
      ? "DE"
      : "FR"
  );

  const history = useHistory();
  const location = useLocation();
  const [start, setStart] = useState<boolean | null>(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const layout = auth.isLawyer ? auth.user?.role : "user";
  const { pathname } = location;
  const [value, setValue] = useState(0);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < breakpoints[down]);
  const [counter, setCounter] = useState(0);
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLanguage(event.target.value as string);
  };
  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setCounter(counter + 1);
        setMobile(window.innerWidth < breakpoints[down]);
      }
    }, 500);
    return () => {
      mounted = false;
    };
  }, [counter]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const rts = Routes.filter((r) => r.layout === "");
      rts.forEach((r, i) => {
        if (r.path === pathname) setValue(i);
      });
    }
    return () => {
      mounted = false;
    };
  }, [pathname]);
  const handleTab = (path: string) => {
    if (path !== pathname) history.push(path);
  };
  const subscribe = () => {
    history.push("/setup-payment");
  };

  const handleClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
  };

  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    event?.preventDefault();
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
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

  const cancelSubscription = () => {
    setStart(true);
    thunkCancelSubscription().then((response: responseType) => {
      setOpen(response.status);
      if (response.status && response.data.success) {
        setSuccessMessage(response.data.message);
        setStart(false);
        thunkLoadUser();
        thunkGetSubscriptionDetail();
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        setErrorMessage(response.data.message);
        setOpenError(true);
        setStart(false);
      }
    });
  };

  const logoButton = (
    <Button
      disableRipple
      component={Link}
      to="/dashboard"
      className={classes.logo}
    >
      <Box display="flex" width="100%" alignItems="center">
        <img src={transparentLogo} alt="logo" className={classes.logoImage} />
      </Box>
    </Button>
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <HideUp>
          <AppBar
            style={{ zIndex: 4 }}
            elevation={0}
            position="fixed"
            color="inherit"
            className={classes.appbar}
          >
            <Box
              hidden={!open}
              position="fixed"
              height="100%"
              zIndex={1100}
              width="100%"
              bgcolor="#00000044"
              onClick={() => setOpen(false)}
            />
            <Box height="100%" display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Button
                  onClick={() => setOpen(!open)}
                  style={{ height: "100%" }}
                >
                  <MenuIcon />
                </Button>
                {logoButton}
              </Box>
              <Box display="flex" alignItems="center">
                {/* <Notification notifications={[]} /> */}
                <Button onClick={logout}>Logout</Button>
              </Box>
            </Box>
          </AppBar>
        </HideUp>
        <Slide
          in={open || !mobile}
          direction={mobile ? "right" : "down"}
          timeout={mobile ? 400 : 0}
        >
          <AppBar
            elevation={0}
            position="fixed"
            color="inherit"
            className={clsx(classes.appbar, classes.appbar2, {
              [classes.open]: open && mobile,
            })}
          >
            <Box className={classes.flex}>
              <Box className={classes.flex2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  height={tabHeight}
                >
                  {logoButton}
                  <HideUp>
                    <IconButton
                      onClick={() => setOpen(!open)}
                      className={classes.closeSidebar}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </HideUp>
                </Box>
                <Box className={classes.logoDivider} />
                <div className={classes.tabsWrapper}>
                  <Tabs
                    value={value}
                    indicatorColor="primary"
                    onChange={handleChange}
                    aria-label="navbar using tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    orientation={mobile ? "vertical" : "horizontal"}
                    classes={{
                      root: classes.tabs_root,
                      scrollButtons: classes.tabs_scrollButtons,
                      indicator: classes.tabs_indicator,
                    }}
                  >
                    {Routes.filter((ur) => ur.layout === layout).map((r, i) => (
                      <Tab
                        disableRipple
                        textColor="inherit"
                        onClick={() => handleTab(r.path)}
                        label={<Text>{translate(r.name)}</Text>}
                        icon={
                          mobile && r.icon !== null ? (
                            <r.icon className={classes.tabIcon} />
                          ) : undefined
                        }
                        {...a11yProps(i)}
                        key={i}
                        classes={{
                          root: classes.tab_root,
                          wrapper: clsx(classes.tab_wrapper, {
                            [classes.tab_bold]: i === value,
                          }),
                        }}
                      />
                    ))}
                  </Tabs>
                </div>
              </Box>
              <Box alignItems="center" ml={1} mt={1}>
                <FormControl className={customClasses.formControl}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={language}
                    onChange={handleSelectChange}
                  >
                    <MenuItem
                      value="EN"
                      selected={
                        localStorage.getItem("locale") === "EN" ? true : false
                      }
                      onClick={() => setLocale(LOCALES.ENGLISH)}
                    >
                      EN
                    </MenuItem>
                    <MenuItem
                      value="DE"
                      selected={
                        localStorage.getItem("locale") === "DE" ? true : false
                      }
                      onClick={() => setLocale(LOCALES.GERMAN)}
                    >
                      DE
                    </MenuItem>
                    <MenuItem
                      value="FR"
                      selected={
                        localStorage.getItem("locale") === "FR" ? true : false
                      }
                      onClick={() => setLocale(LOCALES.FRENCH)}
                    >
                      FR
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" alignItems="center" mr={20}>
                <HideDown>
                  {!auth.isLawyer &&
                    (!auth.user?.is_subscribed! ? (
                      <Box display="flex">
                        <h6
                          style={{
                            marginTop: "3%",
                            marginLeft: "-10%",
                            color: "red",
                          }}
                        >
                          {translate("Account expires in ")}
                          {auth.trialPeriod && auth.trialPeriod + 1}{" "}
                          {translate("day(s)")}{" "}
                        </h6>
                        <Button
                          onClick={subscribe}
                          // className={classes.button}
                          style={{ outline: "none" }}
                        >
                          {translate("Subscribe")}
                        </Button>
                      </Box>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          // marginTop: "2%",
                          width: "100%",
                        }}
                      >
                        <Typography
                          aria-owns={openPop ? "mouse-over-popover" : undefined}
                          aria-haspopup="true"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                          style={{ color: "green" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              marginTop: "-4%",
                              marginLeft: "-10%",
                            }}
                          >
                            <BeenhereIcon />
                            {translate("Subscribed")}
                          </div>
                        </Typography>
                        <Popover
                          id="mouse-over-popover"
                          className={customClasses.popover}
                          classes={{
                            paper: customClasses.paper,
                          }}
                          open={openPop}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          onClose={handlePopoverClose}
                          disableRestoreFocus
                        >
                          <Typography>
                            {translate("You have")} {translate("Subscribed")}
                          </Typography>
                        </Popover>
                        <Button
                          onClick={handleClickOpen}
                          // className={classes.button}
                          style={{
                            outline: "none",
                            marginTop: "-4%",
                            marginLeft: "3%",
                          }}
                        >
                          {translate("Subscription")}
                          <SettingsIcon />
                        </Button>
                      </div>
                    ))}
                  {/* {!auth.isLawyer && auth.user?.has_card && (
                    <Box display="flex" ml={-25} mr={5} mt={-1.5}>
                      <Typography>Payment</Typography>
                      <BeenhereIcon style={{ color: "green" }} />
                    </Box>
                  )} */}
                  {/* <h6 style={{ }}>{auth.user?.email}</h6> */}
                  {/* <Notification notifications={[]} /> */}
                  <Button
                    style={{ marginLeft: "0%", marginBottom: "2%" }}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </HideDown>
              </Box>
            </Box>
            <Dialog
              open={deleteOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
              {translate("Confirmation")}?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {translate(
                    "Are you sure you want to cancel your subscription"
                  )}?
                </DialogContentText>
              </DialogContent>
              {start && (
                <Box mt={1} style={{ marginLeft: "50%" }}>
                  <CircularProgress size="2rem" />
                </Box>
              )}
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {translate("No")}
                </Button>
                <Button onClick={cancelSubscription} color="primary" autoFocus>
                  {translate("Yes")}
                </Button>
              </DialogActions>
            </Dialog>
            <div>
              <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={handleToastClose}
              >
                <Alert onClose={handleToastClose} severity="success">
                  {successMessage}
                </Alert>
              </Snackbar>
            </div>
            <div>
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
          </AppBar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
};
const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {
  logout,
  thunkLoadUser,
  thunkCancelSubscription,
  thunkGetSubscriptionDetail,
})(Navbar);
