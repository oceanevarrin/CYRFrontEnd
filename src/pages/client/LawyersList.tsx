import React, { useEffect, useState } from "react";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@material-ui/core";
import { ILawyer, LawyersState } from "../../store/lawyers/types";
import { Link, useHistory } from "react-router-dom";
import {
  thunkGetLawyers,
  thunkSetSelectedUser,
} from "../../store/lawyers/actions";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Search } from "../chat/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import translate from "../../i18n/translate";
import AdvancedSearch from "./AdvancedSearch";

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
    container: {
      marginLeft: "4%",
      marginRight: "4%",
      marginTop: "1%",
      [theme.breakpoints.down("sm")]: {
        margin: "1%",
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    boxStyle: {
      minWidth: "29rem",
      [theme.breakpoints.down("sm")]: {
        minWidth: "23rem",
      },
    },
  })
);

export const filter = (list: ILawyer[], search: string) =>
  list?.filter((d) => {
    let values: string[] = [];
    values.push(d.lawyer.first_name);
    values.push(d.lawyer.last_name);
    values.push(...Object.values(d.legal_fields));
    console.log("values", values);
    
    for (let i = 0; i < values.length; i++) {
      if (
        values[i]
          ?.toString()
          .toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase()!)
      )
        return true;
    }
    return false;
  });

interface Props {
  lawyers: LawyersState;
  thunkSetSelectedUser: any;
  thunkGetLawyers: any;
}

const LawyersList: React.FC<Props> = ({
  lawyers: { lawyers, loading },
  thunkSetSelectedUser,
  thunkGetLawyers,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [buttonState, setButtonState] = useState(true);
  const [numberOfLawyers, setnumberOfLawyers] = useState(3);
  const [search, setSearch] = useState("");

  // const [filteredLawyers, setFilteredLawyers] = useState<ILawyer[]>(lawyers!);

  let filteredLawyers: ILawyer[] | undefined =
  search.length > 0
    ? lawyers?.filter(
        (i) => {
          let firstSearchValue = i?.lawyer.first_name.toLocaleLowerCase();
          let secondSearchValue = i?.lawyer.last_name.toLocaleLowerCase();
          
          let response = firstSearchValue.indexOf(search.toLocaleLowerCase()) !== -1 || secondSearchValue.indexOf(search.toLocaleLowerCase()) !== -1
          return response;
          // i?.lawyer.first_name.toLocaleLowerCase().match(search.toLocaleLowerCase())!;
          // i?.lawyer.last_name.toLocaleLowerCase().match(search)!;
          // i?.legal_fields.forEach(function (lf: string) {
          //   lf.toLocaleLowerCase().match(search)!;
          // })
          // return null;
        }
      )
    : lawyers!;
    
  // const [num, setNum] = useState(3);
  // useEffect(() => {
  //   setFilteredLawyers(filter(lawyers!, search));
  // }, [search, lawyers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  
  const getLawyer = (lawyer: ILawyer) => {
    thunkSetSelectedUser(lawyer);
    history.push("/lawyer-detail");
  };

  const showMore = () => {
    setnumberOfLawyers(lawyers!.length);
    setButtonState(false);
  };

  const showLess = () => {
    setnumberOfLawyers(3);
    setButtonState(true);
  };

  useEffect(() => {
    thunkGetLawyers();
  }, [thunkGetLawyers]);

  return (
    // Profiles
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <h3 className="display-6 text-center">{translate("Our Lawyers")}</h3>
      </Paper>
      <AdvancedSearch/>
      <div>
        <div className="row">
          <div className="col-md-12">
            <hr />
            <Grid container>
              <Grid item>
                <Box className={classes.boxStyle}>
                  <Search
                    name="userSearch"
                    handleSearchChange={handleSearchChange}
                  />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <p className="lead text-center">
                  {translate("Browse and connect with Lawyers")}
                </p>
              </Grid>
            </Grid>
            {loading ? (
              <Box pt="10vh" textAlign="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredLawyers?.map(
                  (lawyer: ILawyer, i) =>
                    i < numberOfLawyers && (
                      <Grid item xs={12} sm={6} md={4}>
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
                                {lawyer.lawyer.first_name +
                                  " " +
                                  lawyer.lawyer.last_name}
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
                                  defaultValue={Math.round(
                                    lawyer.lawyer.rating
                                  )}
                                  precision={0.5}
                                  readOnly
                                />
                                <span>
                                  {Math.round(lawyer.lawyer.rating)} / 5
                                </span>
                              </div>
                              <Link
                                to="/login"
                                onClick={() => getLawyer(lawyer)}
                                className="btn btn-info"
                              >
                                {translate("View Profile and Contact")}
                              </Link>
                            </div>
                            {/* </div> */}
                          </div>
                        </div>
                      </Grid>
                    )
                )}
              </Grid>
            )}
            <IconButton
              size="medium"
              color="primary"
              style={{
                outline: "none",
                marginLeft: "48%",
                textAlign: "center",
                marginTop: "5%",
              }}
              onClick={buttonState ? showMore : showLess}
            >
              {buttonState ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            {/* <Box textAlign="center" p={2}>
              <Button
                disabled={num >= lawyers?.length!}
                variant="contained"
                onClick={() => setNum(num + 3)}
              >
                More
              </Button>
            </Box> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  lawyers: state.lawyers,
});

export default connect(mapStateToProps, {
  thunkGetLawyers,
  thunkSetSelectedUser,
})(LawyersList);
