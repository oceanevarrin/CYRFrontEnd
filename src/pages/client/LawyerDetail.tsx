import React, { useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { LawyersState } from "../../store/lawyers/types";
import {
  thunkGetSearchResults,
  removeSearch,
} from "../../store/lawyers/actions";
import { AppState } from "../../store";
import { connect, useDispatch } from "react-redux";
import { Rating } from "@material-ui/lab";
import { Cdivider } from "../../utils/Custum";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { ConversationTypes } from "../../store/conversations/types";
import { thunkRateLawyer } from "../../store/lawyers/actions";
import { thunkGetLawyerProfile } from "../../store/profile/actions";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ProfileState } from "../../store/profile/types";
import translate from "../../i18n/translate";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  toastRoot: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  createProfile: {
    padding: theme.spacing(2, 8),
    margin: theme.spacing(4),
    boxShadow: theme.shadows[1],
    background: "#40A9E3",
    color: "white",
    "&:hover": {
      background: "#40A9E3cc",
      color: "white",
      boxShadow: theme.shadows[3],
    },
  },
  container: {
    paddingTop: "3rem",
    height: "100%",
    width: "120%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  ratingRoot: {
    width: 200,
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
  },
  grid: {
    marginTop: 3,
  },
  detail: {
    padding: theme.spacing(2, 3),
    margin: theme.spacing(1, 0),
  },
  profile: {
    display: "flex",
    // maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  root: {
    display: "flex",
    marginBottom: "4%",
    flexDirection: "column",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  profileContainer: {
    margin: 20,
    [theme.breakpoints.down("sm")]: {
      margin: 10,
    },
  },
  buttons: {
    [theme.breakpoints.down("sm")]: {
      margin: 10,
    },
  },
  submit: {
    borderRadius: 3,
    width: "9rem",
    height: 40,
    color: "white",
    backgroundColor: "orange",
    "&:hover": {
      background: "orange",
      color: "white",
      boxShadow: theme.shadows[3],
    },
  },
}));

interface Props {
  lawyers: LawyersState;
  profile: ProfileState;
  removeSearch: any;
  thunkRateLawyer: any;
  thunkGetSearchResults: any;
  thunkGetLawyerProfile: any;
}

const LawyerDetail: React.FC<Props> = ({
  lawyers,
  profile,
  thunkRateLawyer,
  thunkGetLawyerProfile,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState<number | null>(
    lawyers.selectedLawyer?.lawyer.rating!
  );
  // const [hover, setHover] = React.useState(-1);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [lawyerRating, setLawyerRating] = React.useState(
    lawyers.selectedLawyer?.lawyer.rating!
  );

  useEffect(() => {
    thunkGetLawyerProfile(lawyers.selectedLawyer?.lawyer._id);
  }, [thunkGetLawyerProfile, lawyers.selectedLawyer]);

  // Languages List
  const languages = profile.profile?.languages.map((language, index) => (
    <div key={index} className="p-3">
      <i className="fa fa-check" />
      {translate(language)}
    </div>
  ));

  // LegalFields List
  const legalfields = profile.profile?.legal_fields.map((fields, index) => (
    <div key={index} className="p-3">
      <i className="fa fa-check" />
      {translate(fields)}
    </div>
  ));
  // Services List
  const services = profile.profile?.services.map((service, index) => (
    <div key={index} className="p-3">
      <i className="fa fa-check" />
      {translate(service)}
    </div>
  ));

  const contactLawyer = () => {
    dispatch({
      type: ConversationTypes.SET_USER,
      payload: lawyers?.selectedLawyer?.lawyer,
    });
    history.push("/messages");
  };

  const rateLawyer = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rate = (e: any) => {
    e.preventDefault();
    let newRating = Math.round((lawyerRating + value!) / 2);
    console.log("new rating", newRating);
    setLawyerRating(newRating);
    thunkRateLawyer(lawyers?.selectedLawyer?.lawyer._id, value).then(
      (s: boolean) => {
        if (s) {
          setOpen(false);
          setToastOpen(true);
        }
      }
    );
  };

  useEffect(() => {}, [lawyerRating]);

  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  return (
    <Container className={classes.container}>
      <Box mb={4}>
        <div className="row ">
          <div className="col-md-6">
            <div className="card card-body bg-info text-white mb-3">
              <div className="col-md-5 d-none d-lg-block">
                <img
                  className="rounded-circle"
                  src="https://www.gravatar.com/avatar/anything?s=173&d=mm"
                  alt=""
                  style={{ marginLeft: "90%" }}
                />
              </div>
              <div className="text-center">
                <h1 className="display-5 text-center">
                  {lawyers.selectedLawyer?.lawyer.first_name +
                    " " +
                    lawyers.selectedLawyer?.lawyer.last_name}
                </h1>
                <h6 className=" dish5play-6 lead text-center">
                  {profile.profile?.short_description}
                </h6>
                <p className="lead text-center">
                  {<p>{profile.profile?.location}</p>}
                </p>
                <p>{profile.profile?.tariff} CHF / Hr</p>
                <Rating
                  name="half-rating-read"
                  defaultValue={Math.round(lawyerRating)}
                  precision={0.5}
                  readOnly
                />
                {/* <span>{Math.round(lawyerRating)} / 5</span> */}
              </div>
            </div>
            <div></div>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Link
                  to="/messages"
                  onClick={contactLawyer}
                  className="btn "
                  style={{
                    width: "100%",
                    backgroundColor: "#32a875",
                    color: "white",
                  }}
                >
                  {translate("Contact")}
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link
                  to="/lawyer-detail"
                  onClick={rateLawyer}
                  className="btn "
                  style={{ width: "100%", backgroundColor: "orange" }}
                >
                  {translate("Rate")}
                </Link>
              </Grid>
            </Grid>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <div className="card card-body bg-light mb-3">
                  <h3 className="text-center text-info">
                    {translate("About")}{" "}
                    {lawyers.selectedLawyer?.lawyer.first_name}
                  </h3>
                  <p className="lead">
                    {<span>{profile.profile?.description}</span>}
                  </p>
                  <Cdivider />
                  <h3 className="text-left text-info">
                    {translate("Career path")}
                  </h3>
                  <p className="lead">
                    {<span>{profile.profile?.career_path}</span>}
                  </p>
                  <Cdivider />
                  <h3 className="text-left text-info">
                    {translate("Languages")}
                  </h3>
                  <div className="row">
                    <div className=" justify-content-left align-items-left">
                      {languages}
                    </div>
                  </div>
                  <Cdivider />
                  <h3 className="text-left text-info">
                    {translate("Legal Fields")}
                  </h3>
                  <div className="row">
                    <div className=" justify-content-left align-items-left ">
                      <text>{legalfields}</text>
                      {/* <div className="p-3">
                        <i className="fa fa-check" />
                        fields
                      </div> */}
                    </div>
                  </div>
                  <Cdivider />
                  <h3 className="text-left text-info">
                    {translate("Services")}
                  </h3>
                  <div className="row">
                    <div className="justify-content-center align-items-center">
                      {services}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog box */}
        <Dialog
          open={open}
          fullWidth
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={rate}>
            <DialogTitle id="form-dialog-title">
              Rate{" "}
              {lawyers.selectedLawyer?.lawyer.first_name +
                " " +
                lawyers.selectedLawyer?.lawyer.last_name}
            </DialogTitle>
            <DialogContent>
              <Box display="flex" alignItems="center">
                {/* <div className={classes.ratingRoot}> */}
                <Rating
                  // name="hover-feedback"
                  value={value}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setValue(newValue);
                  }}
                />
                {/* </div> */}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="primary" type="submit" className={classes.submit}>
                {translate("Rate")}
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

        <div className={classes.toastRoot}>
          <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={handleToastClose}
          >
            <Alert onClose={handleToastClose} severity="success">
              Lawyer Rated successfully!
            </Alert>
          </Snackbar>
        </div>
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  lawyers: state.lawyers,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  thunkGetSearchResults,
  thunkRateLawyer,
  thunkGetLawyerProfile,
  removeSearch,
})(LawyerDetail);
