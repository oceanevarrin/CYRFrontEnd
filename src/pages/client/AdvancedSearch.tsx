import {
    createStyles,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    Theme,
  } from "@material-ui/core";
  import React, { useEffect } from "react";
  import { connect, useDispatch } from "react-redux";
  import { AppState } from "../../store";
  import { LawyersState, LawyersTypes } from "../../store/lawyers/types";
  import {
    thunkGetLawyers,
    thunkGetSearchResults,
    thunkSetSelectedUser,
  } from "../../store/lawyers/actions";
  import { LegalFields, services, locations, languages } from "../../pages/lawyer/data";
  import { Redirect } from "react-router-dom";
  import translate from '../../i18n/translate';
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        minWidth: "100%",
        marginTop: "-1rem",
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderRadius: "0 0 0 0",
        },
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
    })
  );
  
  interface Props {
    thunkGetLawyers: any;
    thunkGetSearchResults: any;
    thunkSetSelectedUser: any;
    lawyers: LawyersState;
  }
  
  const Landing: React.FC<Props> = ({
    thunkGetLawyers,
    thunkGetSearchResults,
  }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [lawyerServices, setServices] = React.useState<string>("");
    const [lawyerLanguages, setLanguages] = React.useState<string>("");
    const [legalfields, setLegalFields] = React.useState<string>("");
    const [location, setLocation] = React.useState<string>("");
    const [status, setStatus] = React.useState(false);
  
    useEffect(() => {
      thunkGetLawyers();
    }, [thunkGetLawyers]);
  
    const handleLanguagesChange = (
      event: React.ChangeEvent<{ value: unknown }>
    ) => {
      setLanguages(event.target.value as string);
    };
    const handleServicesChange = (
      event: React.ChangeEvent<{ value: unknown }>
    ) => {
      setServices(event.target.value as string);
    };
    const handleLegalFieldsChange = (
      event: React.ChangeEvent<{ value: unknown }>
    ) => {
      setLegalFields(event.target.value as string);
    };
  
    const handleLocationChange = (
      event: React.ChangeEvent<{ value: unknown }>
    ) => {
      setLocation(event.target.value as string);
    };
  
    const validataSearch = () => {
      let isValid = true;
      if (lawyerServices === "" && location === "" && legalfields === "" && lawyerLanguages === "") {
        isValid = false;
      }
      return isValid;
    };
  
    const onSubmit = async (e: any) => {
      e.preventDefault();
      let body = { lawyerServices, lawyerLanguages, location, legalfields};
      dispatch({
        type: LawyersTypes.SEARCH_KEY_SUCCESS,
        payload: body,
      });
      if (validataSearch())
        thunkGetSearchResults(
          lawyerServices === "" ? null : lawyerServices,
          lawyerLanguages === "" ? null : lawyerLanguages,
          location === "" ? null : location,
          legalfields === "" ? null : legalfields
        ).then((s: boolean) => {
          setStatus(s);
        });
    };
  
    if (status) {
      return <Redirect to="/search-result" />;
    }
  
    return (
      <div>
        <div className="s014">
          <form onSubmit={onSubmit}>
            <div className="inner-form ">
              <div className="input-wrap second">
                <div className="input-field second">
                  <label>{translate("Legal Fields")}</label>
                  <div className={classes.formControl}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={legalfields}
                      fullWidth
                      onChange={handleLegalFieldsChange}
                    >
                      {LegalFields?.map((field) => {
                        return (
                          <MenuItem value={field[0]!}>
                            {" "}
                            <IconButton>
                              <img
                                width={20}
                                height={20}
                                src={field[1]!}
                                alt={field[1]!}
                              />
                            </IconButton>{" "}
                            {translate(field[0]!)}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="input-wrap second">
                <div className="input-field second">
                  <label>{translate("Services")}</label>
                  <div className={classes.formControl}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={lawyerServices}
                      fullWidth
                      onChange={handleServicesChange}
                    >
                      {services?.map((service) => {
                        return <MenuItem value={service}>{translate(service)}</MenuItem>;
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              {/* </div> */}
              <div className="input-wrap second">
                <div className="input-field second">
                  <label>{translate("Where")}</label>
                  <div className={classes.formControl}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={location}
                      fullWidth
                      onChange={handleLocationChange}
                    >
                      {locations?.map((location) => {
                        return <MenuItem value={location}>{location}</MenuItem>;
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="input-wrap second">
                <div className="input-field second">
                  <label>{translate("Language")}</label>
                  <div className={classes.formControl}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={lawyerLanguages}
                      fullWidth
                      onChange={handleLanguagesChange}
                    >
                      {languages?.map((language) => {
                        return <MenuItem value={language}>{language}</MenuItem>;
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              <button
                className="btn-search"
                type="submit"
                style={{ outline: "none" }}
              >
                {translate("Go")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const mapStateToProps = (state: AppState) => ({
    lawyers: state.lawyers,
  });
  
  export default connect(mapStateToProps, {
    thunkGetLawyers,
    thunkGetSearchResults,
    thunkSetSelectedUser,
  })(Landing);
  