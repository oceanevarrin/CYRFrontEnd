import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";
import { Container, Grid, makeStyles, Paper, Theme } from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { AuthState } from "../../../store/authenticate/types";
import { thunkLoadUser } from "../../../store/authenticate/actions";
import { baseURL } from "../../../config";
import translate from '../../../i18n/translate';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: "7%",
    paddingLeft: "15%",
    paddingRight: "15%",
    [theme.breakpoints.down("sm")]: {
      padding: "3%",
    },
  },
  submit: {
    backgroundColor: "#2196f3",
    "&:hover": {
      background: "#40A9E3cc",
      color: "white",
      boxShadow: theme.shadows[3],
    },
  },
}));

interface Props {
  auth: AuthState;
  thunkLoadUser: any;
}

const FileUpload = ({
  auth: { isLawyer },
  thunkLoadUser
}: Props) => {
  const classes = useStyles();
  const [file, setFile] = useState("");
 
  const [filename, setFilename] = useState((localStorage.getItem("locale") ===  null || localStorage.getItem("locale") ===  'en-us') ? "Choose File" : localStorage.getItem("locale") ===  'de-de' ? 'Datei auswählen' : "Sélectionner un fichier");
  const [uploadedFile, setUploadedFile] = useState<any>({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e: any) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseURL}/api/lawyer/request-activation`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
          onUploadProgress: (progressEvent: any) => {
            setUploadPercentage(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          },
        }
      );

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage("File Uploaded");
      thunkLoadUser(isLawyer);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Link
            to="/dashboard"
            className="btn"
            style={{
              color: "white",
              backgroundColor: "#32a875",
            }}
          >
            <ArrowBack style={{ marginRight: "0" }} />
            {translate("Back to dashboard")}
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Fragment>
            <Paper elevation={3} style={{padding:'5%'}}>
              {message ? <Message msg={message} /> : null}
              <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="customFile"
                    onChange={onChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    {filename}
                  </label>
                </div>

                <Progress percentage={uploadPercentage} />
                <h6 style={{marginTop:'5%', fontWeight:'normal'}}>{translate("Please upload files in pdf format")}</h6>
                <input
                  type="submit"
                  value={(localStorage.getItem("locale") ===  null || localStorage.getItem("locale") ===  'en-us') ? "Request for approval" : localStorage.getItem("locale") ===  'de-de' ? "Antrag auf Zulassung" : "Demande d’approbation"}
                  className="btn btn-primary mt-4"
                />
              </form>
              {uploadedFile ? (
                <div className="row mt-5">
                  <div className="col-md-6 m-auto">
                    <h3 className="text-center">{uploadedFile.fileName}</h3>
                    <img
                      style={{ width: "100%" }}
                      src={uploadedFile.filePath}
                      alt=""
                    />
                  </div>
                </div>
              ) : null}
            </Paper>
          </Fragment>
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  thunkLoadUser
})(FileUpload);
