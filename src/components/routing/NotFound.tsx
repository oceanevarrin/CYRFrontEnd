import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "../../store";
interface Props {
  isAuthenticated: boolean | null;
}
const useStyles = makeStyles(() => ({
  message: {
    border: "1px solid" + grey[300],
    margin: "10%",
    fontSize: "18px",
    paddingTop: "2rem",
    textAlign: "center",
    backgroundColor: "transparent",
  },
}));
const NotFound = ({ isAuthenticated = false }: Props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.message}>
      <ReportProblemIcon fontSize="large" />
      <Typography variant="h3">Page Not Found</Typography>
      <Typography variant="h4">Sorry, this page does not exist</Typography>
      <Box m={4} pt={4} style={{ fontWeight: "bold", color: "#2196f3" }}>
        {isAuthenticated ? (
          <Link to="/">Go to Dashboard</Link>
        ) : (
          <Link to="/login">Go to sign in page</Link>
        )}
      </Box>
    </Paper>
  );
};
const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(NotFound);
