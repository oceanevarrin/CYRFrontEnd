import React, { useState } from "react";
import { Cdivider } from "../../utils/Custum";
import { Button, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { AuthState } from "../../store/authenticate/types";
import { AppState } from "../../store";
import translate from '../../i18n/translate';

interface Props {
  auth: AuthState;
}

const AboutUs = ({auth}: Props) => {
  const [path, setPath] = useState("");
  const [back, setBack] = useState(false);
  const goBack = () => {
    auth.isAuthenticated ? setPath("/dashboard") : setPath("/");
    setBack(true);
  }

  if(back){
    return <Redirect to={path}/>
  }

  return (
    <div>
      <div className="container py-5">
        <div style={{ width: "100%", marginLeft: "7%", marginRight: "7%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Button onClick={goBack}>Go back</Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <h4>{translate("aboutus title")}</h4>
              <Cdivider />
              <p className="font-italic text-muted mb-4">
                {translate("aboutus detail")}
              </p>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {})(AboutUs);
