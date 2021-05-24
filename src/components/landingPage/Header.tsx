import { createStyles, FormControl, makeStyles, MenuItem, Select, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { transparentLogo } from "../../assets/img";
import { LOCALES } from '../../i18n';
import translate from '../../i18n/translate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 20,
      marginRight:'13%'
    },
    selectEmpty: {
      // marginTop: theme.spacing(2),
    },
  })
);

interface Props {
  setLocale: any;
}

const Header = ({ setLocale }: Props) => {
  const classes = useStyles();
  
  const [language, setLanguage] = useState(localStorage.getItem("locale") === 'en-us' ? 'EN' : localStorage.getItem("locale") === 'de-de'? 'DE' : 'FR');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLanguage(event.target.value as string);
  };
  console.log("Locale",language);
  return (
    // Navbar
    <nav className="navbar navbar-expand-sm navbar-light bg-light mb-4">
      <div className="container">
        <div className="logo">
          <img
            src={transparentLogo}
            alt="logo desktop"
            className="logo-standard"
            height="65"
            width="120"
          />
        </div>
        {/* <a className="navbar-brand" href="landing.html">
          Claim Your Rights
        </a> */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
          style={{ color: "black" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item" style={{marginRight:'10%', marginTop:'3%'}}>
            <FormControl className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                displayEmpty
                onChange={handleChange}
              >
                <MenuItem value="en-us" selected={language === "EN" ? true : false} onClick={()=> setLocale(LOCALES.ENGLISH)}>EN</MenuItem>
                <MenuItem value="de-de" selected={language === "DE" ? true : false} onClick={()=> setLocale(LOCALES.GERMAN)}>DE</MenuItem>
                <MenuItem value="fr-ca" selected={language === "FR" ? true : false} onClick={()=> setLocale(LOCALES.FRENCH)}>FR</MenuItem>
              </Select></FormControl>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                style={{ color: "black", marginRight: "2rem" }}
              >
                {translate("Login")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/register"
                style={{ color: "black", marginRight: "-10rem" }}
              >
                {translate("Create account")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
