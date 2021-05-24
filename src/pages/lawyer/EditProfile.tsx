import {
    Box,
    Button,
    InputLabel,
    makeStyles,
    Paper,
    Slide,
    TextField,
    Theme,
  } from "@material-ui/core";
  import SaveIcon from "@material-ui/icons/Save";
  import { ArrowBackSharp } from "@material-ui/icons";
  import React, { useEffect, useState } from "react";
  import Select from "react-select";
  import Creatable from "react-select/creatable";
  import { components } from "react-select";
  import { selectColourStyles } from "../../utils/utils";
  import { languages, LegalFields, services, locations } from "./data";
  import { FrenchLegalFields, FrenchServices } from "./frenchData";
  import { GermanLegalFields, GermanServices } from "./germanData";
  import NumericInput from "react-numeric-input";
  import { Cdivider } from "../../utils/Custum";
  import Snackbar from "@material-ui/core/Snackbar";
  import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
  import translate from '../../i18n/translate';
import { connect } from "react-redux";
import { AppState } from "../../store";
import { LawyersState } from "../../store/lawyers/types";
import { ProfileState } from "../../store/profile/types";
import { thunkUpdateProfile } from "../../store/profile/actions";
import {
  thunkLoadUser,
} from "../../store/authenticate/actions";
import { useHistory } from "react-router";
  
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
    label: {
      width: "13rem",
      textAlign: "left",
      marginTop: 5,
    },
    inputWraper: {
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      marginBottom: "2rem",
    },
    submit: {
      padding: theme.spacing(1, 8),
      background: "#40A9E3",
      color: "white",
      "&:hover": {
        background: "#40A9E3cc",
        color: "white",
        boxShadow: theme.shadows[3],
      },
    },
    paper: {
      background: "#ffffff99",
      padding: theme.spacing(2, 8),
      minWidth: "30rem",
      maxWidth: "70%",
      marginTop:'2%',
      textAlign: "left",
      marginBottom: "10%",
      marginLeft: "20%",
      marginRight: "20%",
    },
  }));
  
  export interface IOption {
    value: string ;
    label: string;
  }
  
  interface Props {
    lawyers: LawyersState;
    profile: ProfileState;
    thunkUpdateProfile: any;
    thunkLoadUser: any;
  }
  
 const EditProfile = ({lawyers, profile, thunkUpdateProfile, thunkLoadUser} :Props) => {
    const classes = useStyles();
    const history = useHistory();
    const CHARACTER_LIMIT = 20;
    const [open, setOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    let [errorField, setErrorField] = React.useState("");
    const [address, setAddress] = useState<any>(profile?.selectedLocation);
    const [addressOptions, setAddressOptions] = useState<IOption[]>([]);
  
    const [legalOptions, setLegalOptions] = useState<IOption[]>([]);
    const [legalFields, setLegalFields] = useState<any>(profile.selectedLegalFields);
  
    const [serviceOptions, setServiceOptions] = useState<IOption[]>([]);
    const [service, setServices] = useState<any>(profile.selectedServices);
  
    const [languageOptions, setLanguageOptions] = useState<IOption[]>([]);
    const [language, setLanguages] = useState<any>(profile.selectedLanguages);

    // console.log("Selected profile ",lawyers.selectedProfile);
    
    const [formData, setFormData] = useState({
      tariff: lawyers.selectedProfile?.tariff!,
      short_description: lawyers.selectedProfile?.short_description!,
      description: lawyers.selectedProfile?.description!,
      career_path: lawyers.selectedProfile?.career_path!,
    });
    const { tariff, short_description, description, career_path } = formData;

    useEffect(() => {
      let lfs = localStorage.getItem("locale") === 'en-us' ? LegalFields : localStorage.getItem("locale") === 'de-de' ? GermanLegalFields : FrenchLegalFields; 
      let ser = localStorage.getItem("locale") === 'en-us' ? services : localStorage.getItem("locale") === 'de-de' ? GermanServices : FrenchServices; 
      const lgs: IOption[] = lfs.map((ls, i) => {
        return { label: ls[0], value: i.toString() };
      });
      const os: IOption[] = ser.map((s, i) => {
        return { label: s, value: i.toString() };
      });
      const lang: IOption[] = languages.map((l, i) => {
        return { label: l, value: i.toString() };
      });
      const loc: IOption[] = locations.map((lc, i) => {
        return { label: lc, value: i.toString() };
      });
      setAddressOptions(loc);
      setLegalOptions(lgs);
      setServiceOptions(os);
      setLanguageOptions(lang);
    }, []);
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let e = event.target;
      setFormData({ ...formData, [e.name]: e.value });
    };
    const handleChange = (
      value: number | null,
      stringValue: string,
      input: HTMLInputElement
    ) => {
      setFormData({ ...formData, tariff: value! });
    };
  
    // const servicesIndex =  () => {
    //     let index:number[] = [];
    //     serviceOptions?.map((ser,i)=>{
    //         lawyers.selectedProfile?.services.map((service)=>{
    //             if(ser.label === service){
    //                 index.push(i);
    //             }
    //         })
    //     });
    //     return index;
    // }

    const prepareData = (dict: any) => {
      let temp1 = Object.keys(dict).map((data, key) => {
        return dict[data];
      });
  
      let temp2 = temp1.map((temp) => {
        return temp["label"];
      });
  
      return temp2;
    };

    const validateFields = () => {
      let status = false;
      if(language === null || language === "" || language.length === 0){
        status = false;
        setErrorField("languages");
        return status;
      }else if(legalFields === null || legalFields.length === 0){
        status = false;
        setErrorField("legal fields");
        return status;
      }else if(service === null || service.length === 0){
        status = false;
        setErrorField("services");
        return status;
      }else if(address === null ){ 
        status = false;
        setErrorField("location");
        return status;
      }else{
        status = true;
        return status;
      }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if(validateFields()){
        let location: string = "";
        let legalfields: string[] = [];
        let serv: string[] = [];
        let lang: string[] = [];
        let loc = Object.keys(address!).map((data, key) => {
          return address[data];
        });
        location = loc[0];
        lang = prepareData(language);
        legalfields = prepareData(legalFields);
        serv = prepareData(service);
      
        thunkUpdateProfile(
            location,
            legalfields,
            serv,
            lang,
            tariff,
            description,
            short_description,
            career_path
          )
          .then((s: boolean) => {
            setOpen(s);
            setTimeout(() => {
              s && thunkLoadUser(true);
            }, 5000);
          });
        setTimeout(() => {
          history.push("/dashboard")
        }, 5000);
      }else{
        setErrorOpen(true);
      }

    };
    const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    const handleErrorToastClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setErrorOpen(false);
    };
  
    
    // console.log("languageOptions",languageOptions);
    
    
    // Set number of options for leagl fields
    const Menu = (props: any) => {
      const optionSelectedLength = props.getValue().length || 0;
      return (
        <components.Menu {...props}>
          {optionSelectedLength < 4 ? (
            props.children
          ) : (
            <div style={{ margin: 15 }}>{translate("Max limit achieved")}</div>
          )}
        </components.Menu>
      );
    };
    const isValidNewOption = (inputValue: any, selectValue: any) =>
      inputValue.length > 0 && selectValue.length < 5;
    return (
      <Slide in direction="left">
        <Paper className={classes.paper}>
          <Box mb="2rem" ml={-4} display="flex">
            <Button style={{ marginRight: "30%" }}>
              <ArrowBackSharp />
            </Button>
            <h4 style={{ textAlign: "center", float: "right" }}>
              {translate("Edit your profile")}
            </h4>
          </Box>
          <Cdivider />
          <Box>
            <form onSubmit={onSubmit}>
              <Box className={classes.inputWraper}>
                <InputLabel className={classes.label}>
                  <b>{translate("Short description")}</b>
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="Describe yourself with 20 characters..."
                  size="small"
                  margin="dense"
                  type="text"
                  name="short_description"
                  id="short_description"
                  value={short_description}
                  inputProps={{
                    maxlength: CHARACTER_LIMIT
                  }}
                  helperText={`${short_description.length}/${CHARACTER_LIMIT}`}
                  autoFocus
                  onChange={onChange}
                  rows={5}
                />
              </Box>
              <Box mt="2rem" display="flex" alignItems="center">
                <InputLabel className={classes.label}>
                  <b>{translate("Address")}</b>
                </InputLabel>
                <Box width="100%">
                  <Select
                    required
                    styles={selectColourStyles}
                    closeMenuOnSelect={true}
                    defaultValue={profile.selectedLocation}
                    onChange={setAddress}
                    options={addressOptions}
                    isClearable={true}
                  />
                </Box>
              </Box>
              <Box mt="2rem" display="flex" alignItems="center">
                <InputLabel className={classes.label}>
                  <b>{translate("Legal Fields")}</b>
                </InputLabel>
                <Box width="100%">
                  <Creatable
                    required
                    styles={selectColourStyles}
                    defaultValue={profile.selectedLegalFields}
                    components={{ Menu }}
                    onChange={setLegalFields}
                    isValidNewOption={isValidNewOption}
                    options={legalOptions}
                    isMulti
                  />
                </Box>
              </Box>
              <Box mt="2rem" display="flex" alignItems="center">
                <InputLabel className={classes.label}>
                  <b>{translate("Services")}</b>
                </InputLabel>
                <Box width="100%">
                  <Select
                    required
                    styles={selectColourStyles}
                    closeMenuOnSelect={true}
                    defaultValue={profile.selectedServices}
                    onChange={setServices}
                    options={serviceOptions}
                    isMulti
                  />
                </Box>
              </Box>
              <Box mt="2rem" display="flex" alignItems="center">
                <InputLabel className={classes.label}>
                  <b>{translate("Languages spoken")}</b>
                </InputLabel>
                <Box width="100%">
                  <Select
                    required
                    styles={selectColourStyles}
                    closeMenuOnSelect={true}
                    defaultValue={profile.selectedLanguages}
                    onChange={setLanguages}
                    options={languageOptions}
                    isMulti
                  />
                </Box>
              </Box>
  
              <Box className={classes.inputWraper} mt="2rem">
                <InputLabel className={classes.label}>
                  <b>{translate("Tariff/hr (CHF)")}</b>
                </InputLabel>
                <NumericInput
                  required
                  onChange={handleChange}
                  min={0}
                  max={1000000}
                  value={tariff}
                />
              </Box>
              <Box className={classes.inputWraper}>
                <InputLabel className={classes.label}>
                  <b>{translate("Career path")}</b>
                </InputLabel>
                <TextField
                  fullWidth
                  multiline
                  required
                  variant="outlined"
                  placeholder="Tell us something about your career path..."
                  size="small"
                  margin="dense"
                  type="text"
                  name="career_path"
                  id="career_path"
                  value={career_path}
                  autoFocus
                  onChange={onChange}
                  rows={5}
                />
              </Box>
              <Box className={classes.inputWraper}>
                <InputLabel className={classes.label}>
                  <b>{translate("Description")}</b>
                </InputLabel>
                <TextField
                  fullWidth
                  multiline
                  required
                  variant="outlined"
                  placeholder="Description about yourself..."
                  size="small"
                  margin="dense"
                  type="text"
                  name="description"
                  id="description"
                  value={description}
                  autoFocus
                  onChange={onChange}
                  rows={5}
                />
              </Box>
              <Box textAlign="center" mb={4}>
                <Button
                  variant="contained"
                  type="submit"
                  className={classes.submit}
                >
                  <SaveIcon style={{ marginRight: "1rem" }} /> {translate("Save")}
                </Button>
              </Box>
            </form>
            <div className={classes.root}>
              <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleToastClose}
              >
                <Alert onClose={handleToastClose} severity="success">
                  {translate("Profile Updated Successfully!")}
                </Alert>
              </Snackbar>
            </div>

            <div className={classes.root}>
              <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={handleErrorToastClose}
              >
                <Alert onClose={handleErrorToastClose} severity="error">
                  {translate(`Please select value for ${errorField}!`)}
                </Alert>
              </Snackbar>
            </div>
          </Box>
        </Paper>
      </Slide>
    );
  };

  const mapStateToProps = (state: AppState) => ({
    lawyers: state.lawyers,
    profile: state.profile,
  });

  export default connect(mapStateToProps, { thunkUpdateProfile, thunkLoadUser })(EditProfile);
  