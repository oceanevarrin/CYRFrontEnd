import React from "react";
import { pdfjs } from "react-pdf";
import samplePDF from "./tos.pdf";
import { Cdivider } from "../../utils/Custum";
import { Button, Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { useState } from "react";
import { AuthState } from "../../store/authenticate/types";
import { AppState } from "../../store";
import { connect } from "react-redux";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  auth: AuthState;
}

const TermsOfServices = ({auth}: Props) => {

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
        <div style={{ width: "100%", marginLeft: "10%",marginRight: "10%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <Button onClick={goBack}>
                Go back
              </Button>
            </Grid>
            <Grid item xs={12} sm={10}>
            <h4 >Terms of Services</h4>
            </Grid>
          </Grid>
          
          <Cdivider />

          <iframe title="termsofservice" src={samplePDF} style={{width:"1000px", height:"1000px"}} frameBorder="0"></iframe>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {})(TermsOfServices);
