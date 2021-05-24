import {
  Box,
  Avatar,
  Button,
  Container,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Rating } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import {
  thunkCreateProfile,
  thunkGetProfile,
  thunkSetSelectedLocation,
  thunkSetSelectedServices,
  thunkSetSelectedLegalFields,
  thunkSetSelectedLanguage,
} from "../../store/profile/actions";
import {
  thunkGetProfilePicture,
  thunkSetSelectedProfile,
} from "../../store/lawyers/actions";
import { ProfileState } from "../../store/profile/types";
import { Cdivider } from "../../utils/Custum";
import { CreateProfile, IOption } from "./CreateProfile";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { Link, Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { LawyersState } from "../../store/lawyers/types";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import {
  thunkLoadUser,
  thunkDeleteAccount,
} from "../../store/authenticate/actions";
import { baseURL } from "../../config";
import translate from "../../i18n/translate";
import { languages as languagesList, LegalFields as lfs, services as ser, locations as add } from "./data";

interface Props {
  auth: AuthState;
  lawyers: LawyersState;
  profile: ProfileState;
  thunkSetSelectedProfile: any;
  thunkCreateProfile: any;
  thunkGetProfile: any;
  thunkLoadUser: any;
  thunkGetProfilePicture: any;
  thunkDeleteAccount: any;
  thunkSetSelectedLocation: any;
  thunkSetSelectedServices: any;
  thunkSetSelectedLegalFields: any;
  thunkSetSelectedLanguage: any;
}
const useStyles = makeStyles((theme: Theme) => ({
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
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
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
  paymentForm: {
    width: "70%",

    backgroundColor: "#32a875",
    marginBottom: "2%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "&:hover": {
      backgroundColor: "#32a875",
      boxShadow: theme.shadows[3],
    },
  },
}));
const Dashboard = ({
  auth: { user, isLawyer },
  profile,
  lawyers,
  thunkSetSelectedProfile,
  thunkCreateProfile,
  thunkLoadUser,
  thunkGetProfile,
  thunkGetProfilePicture,
  thunkDeleteAccount,
  thunkSetSelectedLocation,
  thunkSetSelectedServices,
  thunkSetSelectedLegalFields,
  thunkSetSelectedLanguage,
}: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const [languageOptions, setLanguageOptions] = useState<IOption[]>([]);
    const [serviceOptions, setServiceOptions] = useState<IOption[]>([]);
  const [legalOptions, setLegalOptions] = useState<IOption[]>([]);
  const [addressOptions, setAddressOptions] = useState<IOption[]>([]);

  const [open, setOpen] = React.useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(
    user?.profile_built
  );
  const [createProfile, setCreateProfile] = useState(false);

  useEffect(() => {

    const lgs: IOption[] = lfs.map((ls, i) => {
      return { label: ls[0], value: i.toString() };
    });

    const os: IOption[] = ser.map((s, i) => {
      return { label: s, value: i.toString() };
    });

    const lang: IOption[] = languagesList.map((l, i) => {
      return { label: l, value: i.toString() };
    });

    const loc: IOption[] = add.map((lc, i) => {
      return { label: lc, value: i.toString() };
    });

    setLanguageOptions(lang);
    setAddressOptions(loc);
    setServiceOptions(os);
    setLegalOptions(lgs);

  }, []);
  const onChange = async (e: any) => {
    onSubmit(e, e.target.files[0]);
  };

  const onSubmit = async (e: any, file: string) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/lawyer/profile-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      console.log("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  useEffect(() => {
    thunkGetProfilePicture();
    thunkGetProfile();
    // thunkLoadUser(isLawyer);
  }, [
    thunkGetProfile,
    isProfileComplete,
    createProfile,
    lawyers?.profilePicture,
    // thunkLoadUser,
    thunkGetProfilePicture,
  ]);

  const handleProfileClose = () => {
    setCreateProfile(false);
    setIsProfileComplete(true);
  };

  if (editProfile) {
    return <Redirect to="edit-profile" />;
  }
  // Languages List
  const languages =
    isProfileComplete &&
    profile.profile?.languages?.map((language, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" />
        {language}
      </div>
    ));
  // LegalFields List
  const legalfields =
    isProfileComplete &&
    profile.profile?.legal_fields?.map((fields, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" />
        {translate(fields)}
      </div>
    ));
  // Services List
  const services =
    isProfileComplete &&
    profile.profile?.services?.map((service, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" />
        {translate(service)}
      </div>
    ));

  const setupPayment = () => {
    history.push("/setup-payment");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const prepareSelectedLanguage = () => {
    let tempLanguage: IOption;
    let selLanguage: IOption[] = [];

    languageOptions.forEach(function (lang) {
      profile.profile?.languages && profile.profile?.languages!.map((selLang)=>{
        let tempValue = "";
        let tempLabel = "";
        if(lang.label === selLang){
          tempValue = lang.value;
          tempLabel = lang.label;
          tempLanguage = {label: tempLabel, value: tempValue};
          selLanguage.push(tempLanguage);
        }
      });
    });

    thunkSetSelectedLanguage(selLanguage);
  }

  const prepareSelectedLegalFields = () => {
    let tempLegalFields: IOption;
    let selLegalFields: IOption[] = [];

    legalOptions.forEach(function (legal) {
      profile.profile?.legal_fields && profile.profile?.legal_fields!.map((selLegalFlds)=>{
        let tempValue = "";
        let tempLabel = "";
        if(legal.label === selLegalFlds){
          tempValue = legal.value;
          tempLabel = legal.label;
          tempLegalFields = {label: tempLabel, value: tempValue};
          selLegalFields.push(tempLegalFields);
        }
      });
    });

    thunkSetSelectedLegalFields(selLegalFields);
  }

  const prepareSelectedServices = () => {
    let tempServices: IOption;
    let selServices: IOption[] = [];

    serviceOptions.forEach(function (service) {
      profile.profile?.services && profile.profile?.services!.map((selServ)=>{
        let tempValue = "";
        let tempLabel = "";
        if(service.label === selServ){
          tempValue = service.value;
          tempLabel = service.label;
          tempServices = {label: tempLabel, value: tempValue};
          selServices.push(tempServices);
        }
      });
    });

    thunkSetSelectedServices(selServices);
  }

  const prepareSelectedLocation = () => {
    let tempLocation: IOption = {value:"", label:""};
    // let selLocations: IOption[] = [];

    addressOptions.forEach(function (address) {
      let tempValue = "";
      let tempLabel = "";
      if(address.label === profile.profile?.location){
          tempValue = address.value;
          tempLabel = address.label;
          tempLocation = {label: tempLabel, value: tempValue};
          // selLocations.push(tempLocations);
        }
    });

    thunkSetSelectedLocation(tempLocation);
  }


  const handleEditProfile = () => {
    prepareSelectedLanguage();
    prepareSelectedLegalFields();
    prepareSelectedServices();
    prepareSelectedLocation();
    
    thunkSetSelectedProfile(profile.profile!);
    setEditProfile(true);
  };

  
  const deleteAccount = () => {
    thunkDeleteAccount(isLawyer, user.id).then((s: boolean) => {
      if (s) history.push("/login");
    });
  };

  return (
    <Container className={classes.container}>
      {isProfileComplete ? (
        <Box mb={4}>
          <div className="row ">
            <div className="col-md-12">
              <div className="card card-body bg-info text-white mb-3">
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-md-2 m-auto d-none d-lg-block">
                      {lawyers?.profilePicture! ? (
                        <Avatar
                          className={classes.avatar}
                          // style={{height:{100},width{100}}
                          alt="profilePicture"
                          src={`data:image/png;base64,${lawyers?.profilePicture!}`}
                        />
                      ) : (
                        // prepareImage()
                        <IconButton style={{ outline: "none" }}>
                          <input
                            accept="image/*"
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            onChange={onChange}
                          />
                          <Avatar
                            className={classes.avatar}
                            alt="profilePicture"
                          ></Avatar>
                        </IconButton>
                      )}
                    </div>
                    {/* <div>
                      <p>
                        {" "}
                        {translate("Balance")}:{" "}
                        {Boolean(user?.balance) ? user?.balance : 0} CHF
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-center">
                    {user?.first_name + " " + user?.last_name}
                  </h1>
                  <p className="lead text-center">
                    {profile.profile?.short_description}
                  </p>
                  <p>{profile.profile?.location}</p>
                  <p>{profile.profile?.tariff} CHF / Hr</p>
                  <Rating
                    name="half-rating-read"
                    defaultValue={user?.rating}
                    precision={0.5}
                    readOnly
                  />
                  {/* <div className="container mt-2  ">
                    <div className="row">
                      <div className="col-md-3"></div>
                      <div className="col-md-6">
                        <Button
                          onClick={setupPayment}
                          className={classes.paymentForm}
                          style={{ color: "white" }}
                        >
                          {translate("Billing Methods")}
                        </Button>
                      </div>
                      {user.has_card && (
                        <div className="col-md-3">
                          <Typography>
                            {translate("Payment Verified")}
                          </Typography>
                          <BeenhereIcon style={{ marginLeft: "2%" }} />
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Grid container>
                <Grid item xs={12} sm={9}></Grid>
                <Grid item xs={12} sm={3}>
                  <div style={{ marginBottom: "20px" }}>
                    <button
                      style={{ width: "100%" }}
                      onClick={handleEditProfile}
                      className="btn btn-primary"
                    >
                      {translate("Edit Profile")}
                    </button>
                  </div>
                </Grid>
              </Grid>
              <div className="card card-body bg-light mb-3">
                <h3 className="text-center text-info">
                  {translate("About")} {user?.first_name}
                </h3>
                <p className="lead">
                  {<span>{profile.profile?.description}</span>}
                </p>
                <Cdivider />
                <h3 className="text-left text-info">
                  {translate("Languages")}
                </h3>
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-left align-items-left">
                    {languages}
                  </div>
                </div>
                <Cdivider />
                <h3 className="text-left text-info">
                  {translate("Career path")}
                </h3>
                <p className="lead">
                  {<span>{profile.profile?.career_path}</span>}
                </p>
                <Cdivider />
                <h3 className="text-left text-info">
                  {translate("Legal Fields")}
                </h3>
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-left align-items-left">
                    {legalfields}
                  </div>
                </div>
                <Cdivider />
                <h3 className="text-left text-info">{translate("Services")}</h3>
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-left align-items-left">
                    {services}
                  </div>
                </div>
                <Cdivider />
                <h3 className="text-left text-info">
                  {translate("Approval Status")}
                </h3>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                    {/* <div className="d-flex flex-wrap justify-content-left align-items-left"> */}
                    <div className="p-3">
                      {!user?.approval_requested &&
                      user?.status === "inactive" ? (
                        <text>
                          <ThumbUpIcon />
                          {translate(
                            "You have not requested for approval yet."
                          )}
                        </text>
                      ) : user?.approval_requested &&
                        user?.status === "inactive" ? (
                        <text>
                          <ThumbDownIcon style={{ marginRight: "2%" }} />
                          {translate("You have requested for approval.")}
                        </text>
                      ) : (
                        <text>
                          <ThumbUpIcon style={{ marginRight: "2%" }} />
                          {translate("Your have been approved.")}
                        </text>
                      )}
                    </div>
                    {/* </div> */}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div>
                      {!user?.approval_requested &&
                      user?.status === "inactive" ? (
                        <Link
                          to="/request-approval"
                          className="btn"
                          style={{
                            width: "100%",
                            color: "white",
                            backgroundColor: "#32a875",
                          }}
                        >
                          {translate("Request for Approval")}
                        </Link>
                      ) : user?.approval_requested &&
                        user?.status === "inactive" ? (
                        <Button
                          disabled
                          style={{
                            width: "100%",
                            color: "white",
                            backgroundColor: "#cc0066",
                          }}
                        >
                          {translate("Approval Pending")}
                        </Button>
                      ) : (
                        <Button
                          disabled
                          style={{
                            width: "100%",
                            color: "white",
                            backgroundColor: "#32a875",
                          }}
                        >
                          {translate("Approved")}
                        </Button>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Cdivider />
                    <div style={{ marginBottom: "30px" }}>
                      <button
                        style={{ width: "100%" }}
                        onClick={handleClickOpen}
                        className="btn btn-danger"
                      >
                        {translate("Delete My Account")}
                      </button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Box>
      ) : (
        <Box textAlign="center">
          {!createProfile ? (
            <div>
              <Typography variant="inherit" display="block">
                {translate("Welcome")} <b>{user?.first_name}</b>{" "}
                {translate("to")} Claimyourrights
              </Typography>
              <Button
                onClick={() => setCreateProfile(true)}
                variant="contained"
                className={classes.createProfile}
              >
                <AddIcon /> {translate("Create Profile")}
              </Button>
            </div>
          ) : (
            <CreateProfile
              thunkCreateProfile={thunkCreateProfile}
              handleClose={handleProfileClose}
              thunkLoadUser={thunkLoadUser}
              isLawyer={isLawyer}
            />
          )}
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {translate("Do you really want to delete your account?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {translate("No")}
          </Button>
          <Button onClick={deleteAccount} color="primary" autoFocus>
            {translate("Yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  lawyers: state.lawyers,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  thunkCreateProfile,
  thunkGetProfile,
  thunkLoadUser,
  thunkSetSelectedProfile,
  thunkGetProfilePicture,
  thunkDeleteAccount,
  thunkSetSelectedLocation,
  thunkSetSelectedServices,
  thunkSetSelectedLegalFields,
  thunkSetSelectedLanguage,
})(Dashboard);
