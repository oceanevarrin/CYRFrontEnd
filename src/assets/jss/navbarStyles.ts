import { makeStyles, Theme } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import { themeColor } from "../../assets/jss/material-react";

export enum breakpoints {
  xs = 600,
  sm = 960,
  md = 1280,
  lg = 1920,
}
export const sidebarWidth = "17rem";
export const tabHeight = "4rem";
export const down: "sm" | "md" | "lg" = "sm";
export const up: "sm" | "md" | "lg" = "md";
export const navbarStyles = makeStyles((theme: Theme) => ({
  subscribe: {
    color: "white",
    backgroundColor: green[500],
    padding: theme.spacing(0.5, 2),
    minWidth: "6rem",
    margin: theme.spacing(0, 1),
    "&:hover": {
      backgroundColor: green[400],
    },
  },
  appbar: {
    left: 0,
    width: "100%",
    color: "black",
    height: tabHeight,
    backgroundColor: theme.palette.background.paper,
  },
  appbar2: {
    display: "initial",
    [theme.breakpoints.down(down)]: {
      width: sidebarWidth,
      height: "100vh",
    },
  },
  open: {
    boxShadow: theme.shadows[10],
  },
  flex: {
    [theme.breakpoints.up(up)]: {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  flex2: {
    maxWidth: "100%",
    [theme.breakpoints.up(up)]: {
      maxWidth: "calc(100% - 17rem)",
      display: "flex",
    },
  },
  logoDivider: {
    border: `1px solid ${grey[300]}`,
    margin: 15,
    marginLeft: 0,
    [theme.breakpoints.down(down)]: {
      margin: 0,
      width: "100%",
      height: 2,
      borderTop: "none",
    },
  },
  tabs_root: {
    maxWidth: "100%",
    [theme.breakpoints.down(down)]: {
      maxWidth: sidebarWidth,
    },
    outline: "none",
    "&:active": {
      outline: "none",
    },
  },
  tabs_scrollButtons: {
    width: 30,
    backgroundColor: grey[50],
    boxShadow: theme.shadows[5],
    "&:hover": {
      backgroundColor: grey[100],
    },
    [theme.breakpoints.down(down)]: {
      width: sidebarWidth,
    },
  },

  tabs_indicator: {
    backgroundColor: themeColor,
    height: 2,
    [theme.breakpoints.down(down)]: {
      width: 3,
    },
  },

  tab_root: {
    fontWeight: "normal",
    height: tabHeight,
    minWidth: "5rem",
    [theme.breakpoints.down(down)]: {
      minWidth: sidebarWidth,
    },
    "&:hover": {
      backgroundColor: themeColor + "11",
    },
  },

  tab_wrapper: {
    width: "auto",
    marginLeft: 10,
    marginRight: 10,
    height: tabHeight,
    [theme.breakpoints.down(down)]: {
      marginLeft: 50,
      marginRight: "auto",
    },
  },
  tab_bold: {
    fontWeight: "bold",
  },
  tabIcon: {
    position: "absolute",
    left: 20,
  },
  tabsWrapper: {
    maxWidth: "calc(100% - 145px)",
    [theme.breakpoints.down(down)]: {
      maxWidth: "100%",
      height: "calc(100vh - 5rem)",
      overflowY: "auto",
    },
  },

  logo: {
    height: "100%",
    minWidth: "8rem",
    padding: "0",
    [theme.breakpoints.down(down)]: {
      minWidth: "12rem",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  logoImage: {
    height: "4rem",
    [theme.breakpoints.down(down)]: {
      height: "4rem",
    },
  },
  closeSidebar: {
    width: "3rem",
    height: "2.5rem",
    borderRadius: 10,
    marginRight: 3,
    boxShadow: theme.shadows[1],
    backgroundColor: "#FFFFFF",
    color: "black",
    "&:hover": {
      boxShadow: theme.shadows[2],
      backgroundColor: "#EeEeeEe",
    },
  },

  backdrop: {
    position: "fixed",
    height: "100%",
    zIndex: 1100,
    left: sidebarWidth,
    width: `calc(100% - ${sidebarWidth})`,
    bgcolor: "#00000088",
  },
}));
