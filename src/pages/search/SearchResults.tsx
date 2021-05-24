import React, { useEffect, useState } from "react";
// import Rating from "@material-ui/lab/Rating";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
// import { Box, CircularProgress, Grid } from "@material-ui/core";
// import { ILawyer, LawyersState } from "../../store/lawyers/types";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Box, Button, Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { ILawyer, LawyersState } from "../../store/lawyers/types";
import {
  thunkGetSearchResults,
  thunkSetSelectedUser,
  removeSearch,
} from "../../store/lawyers/actions";
import { AppState } from "../../store";
import { connect } from "react-redux";
import { Rating } from "@material-ui/lab";
import { Cdivider } from "../../utils/Custum";
import { Link, useHistory } from "react-router-dom";
import { AuthState } from "../../store/authenticate/types";
import translate from '../../i18n/translate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      marginBottom: "4%",
      flexDirection: "column",
      "& > * + *": {
        marginTop: theme.spacing(1),
      },
    },
    backButton: {
      outline: "none",
      background: "#40A9E3",
      color: "white",
      "&:hover": {
        background: "#40A9E3cc",
        color: "white",
        boxShadow: theme.shadows[3],
      },
      //   color: "white",
      margin: "7%",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0.5rem",
      },
    },

    container: {
      
      margin: "1%",
      // [theme.breakpoints.down("sm")]: {
      //   marginLeft: "0",
      // },
    },
  })
);

interface Props {
  auth: AuthState;
  lawyers: LawyersState;
  removeSearch: any;
  thunkGetSearchResults: any;
  thunkSetSelectedUser: any;
}

const SearchResults: React.FC<Props> = ({
  thunkGetSearchResults,
  thunkSetSelectedUser,
  removeSearch,
  lawyers,
  auth,
}) => {
  const classes = useStyles();
  const [back, setBack] = useState(false);
  const history = useHistory();
  const buttonText = auth.isAuthenticated && !auth.isLawyer ? 'lawyers list' : auth.isAuthenticated && auth.isLawyer ? 'dashboard' : 'home';
  const getLawyer = (lawyer: ILawyer) => {
    thunkSetSelectedUser(lawyer);
    history.push("/login");
  };

  console.log(lawyers?.searchKey);

  useEffect(() => {
    thunkGetSearchResults();
  }, [thunkGetSearchResults]);

  if (back){
    if(auth.isAuthenticated && !auth.isLawyer){
      return <Redirect to="/lawyers-list" />
    }else if(auth.isAuthenticated && auth.isLawyer){
      return <Redirect to="/dashboard" />
    }else{
      return <Redirect to="/" />
    }
  } 
  const goBack = () => {
    setBack(true);
    removeSearch();
  };
  return (
    // Profiles
    <div className={classes.container} style={{ marginTop: "6%" }}>
      <div>
        <div className="row">
          <div className="col-md-12">
            <div style={{ display: "flex" }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  <Button onClick={goBack} className={classes.backButton}>
                    <ArrowBackIcon style={{ marginRight: "0.5rem" }} /> {translate("Back to")} {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <p className="lead text-left display-6">
                    {translate("Search results for")}{" "}
                    <b>
                      {lawyers?.searchKey?.legalfields !== "" &&
                        lawyers?.searchKey?.legalfields! + " "}{" "}
                      {" " + lawyers?.searchKey?.lawyerServices !== "" &&
                        lawyers?.searchKey?.lawyerServices! + " "}{" "}
                      {" " + lawyers?.searchKey?.lawyerLanguages !== "" &&
                        lawyers?.searchKey?.lawyerLanguages! + " "}{" "}
                      {" " + lawyers?.searchKey?.location !== "" &&
                        lawyers?.searchKey?.location!}
                    </b>
                  </p>
                </Grid>
              </Grid>
            </div>
            <Cdivider />
            {lawyers?.sarchResults?.length === 0 ? (
              <Box pt="20vh" textAlign="center">
                <p className="lead text-center">{translate("No search results found")}</p>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {lawyers?.sarchResults?.map((lawyer: ILawyer) => (
                  <Grid item xs={12} sm={4}>
                    <div
                      className="card card-body bg-light mb-3"
                      style={{ height: "100%" }}
                    >
                      <div className="row ">
                        <div className="col-md-5 d-none d-lg-block">
                          <img
                            className="rounded-circle"
                            src="https://www.gravatar.com/avatar/anything?s=150&d=mm"
                            alt=""
                          />
                        </div>
                        <div className="col-md-7 mb-4">
                          <h3>
                            {lawyer?.lawyer?.first_name +
                              " " +
                              lawyer?.lawyer?.last_name}
                          </h3>
                          {lawyer.legal_fields.map((fields) => {
                            return <p>{translate(fields)}</p>;
                          })}

                          <div
                            className={classes.root}
                            style={{ display: "flex" }}
                          >
                            <Rating
                              name="half-rating-read"
                              defaultValue={lawyer?.lawyer?.rating}
                              precision={0.5}
                              readOnly
                            />
                            <span>{lawyer?.lawyer?.rating} / 5</span>
                          </div>
                          <Link
                            to="/login"
                            onClick={() => getLawyer(lawyer)}
                            className="btn btn-info"
                          >
                            View Profile and Contact
                          </Link>
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  lawyers: state.lawyers,
});

export default connect(mapStateToProps, {
  thunkGetSearchResults,
  thunkSetSelectedUser,
  removeSearch,
})(SearchResults);
