import React from "react";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import { ILawyer, LawyersState } from "../../store/lawyers/types";
import { Link, useHistory } from "react-router-dom";

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
      margin: "1%",
    },
  })
);

interface Props {
  lawyers: LawyersState;
  thunkSetSelectedUser: any;
}

const TopLayers: React.FC<Props> = ({ lawyers,thunkSetSelectedUser }) => {
  const classes = useStyles();
  const history = useHistory();
  const getLawyer = (lawyer:ILawyer) =>{
    thunkSetSelectedUser(lawyer);
    history.push('/login');
  }

  return (
    // Profiles
    <div className={classes.container} style={{ marginTop: "4%" }}>
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4 text-center">Our Top Lawyers</h1>
            <hr />
            <p className="lead text-center">Browse and connect with Lawyers</p>
            {lawyers.loading ? (
              <Box pt="10vh" textAlign="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {lawyers?.lawyers?.map((lawyer: ILawyer) => (
                  <Grid item xs={12} sm={4}>
                    <div className="card card-body bg-light mb-3" style={{ height: "100%" }}>
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
                            return <p>{fields}</p>;
                          })}

                          <div
                            className={classes.root}
                            style={{ display: "flex" }}
                          >
                            <Rating
                              name="half-rating-read"
                              defaultValue={Math.round(lawyer.lawyer.rating)}
                              precision={0.5}
                              readOnly
                            />
                            <span>{Math.round(lawyer.lawyer.rating)} / 5</span>
                          </div>
                          <Link to="/login" onClick={()=>getLawyer(lawyer)} className="btn btn-info">
                            View and Contact
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

export default TopLayers;
