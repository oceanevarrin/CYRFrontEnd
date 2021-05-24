import React, { useState } from "react";
import { fade, InputBase, makeStyles, Theme } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";


const searchStyles = makeStyles((theme: Theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.8),
    },
    marginLeft: 0,
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows[1],
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    height: 30,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
interface Props {
  handleSearchChange: any;
  name?: string;
}

export const Search = (props: Props) => {
  const classes = searchStyles();
  const [language, ] = useState(localStorage.getItem("locale") ===  null ? 'EN' : localStorage.getItem("locale") === 'en-us' ? 'EN' : localStorage.getItem("locale") === 'de-de'? 'DE' : 'FR');
  
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        name={props.name}
        onChange={props.handleSearchChange}
        placeholder={language==='EN' ? 'Search': language==='DE' ? 'Suchen' : 'Rechercher' }
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
};
