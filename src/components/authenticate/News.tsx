import React, { useState } from "react";
import { Cdivider } from "../../utils/Custum";
import { Button, Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { AppState } from "../../store";
import { connect } from "react-redux";
import { AuthState } from "../../store/authenticate/types";

interface Props {
  auth: AuthState;
}

const News = ({auth}: Props) => {
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
              <h4>News</h4>
              <Cdivider />
              <p className="font-italic text-muted mb-4">
                No news available currently.
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
export default connect(mapStateToProps, {})(News);
