import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { userStyles } from "../../assets/jss/userStyles";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import { UsersState } from "../../store/users/types";
import Navbar from "../navbar/Navbar";
import CRoutes from "../routing/CustomRoutes";
import NotFound from "../routing/NotFound";
import Routes from "../routing/Routes";
const switchRoutes = (layout: string) => (
  <Switch>
    {Routes.map(
      (prop, key) =>
        prop.layout === layout && (
          <Route exact path={prop.path} component={prop.component} key={key} />
        )
    )}
    {CRoutes.map((prop) => {
      if (prop.layout === layout) {
        return <Route exact path={prop.path} component={prop.component} />;
      }
      return null;
    })}
    <Redirect exact from="/" to="/dashboard" />
    <Route component={NotFound} />
  </Switch>
);

interface Props {
  users: UsersState;
  auth: AuthState;
  setLocale: any;
}
const User: React.FC<Props> = ({ auth, users: { changePassword }, setLocale }) => {
  const classes = userStyles();
  const layout = auth.isLawyer ? auth.user?.role : "user";
  const mainPanel = React.createRef<HTMLDivElement>();

  return (
    <div className={classes.wrapper}>
      <Navbar setLocale={setLocale} />
      <div className={classes.mainPanel} ref={mainPanel}>
        {switchRoutes(layout)}
        {/* <Chat /> */}
      </div>
    </div>
  );
};
const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  users: state.users,
  auth: state.auth,
});
export default connect(mapStateToProps, {})(User);
