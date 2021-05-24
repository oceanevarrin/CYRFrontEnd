import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./assets/css/app.css";
import AboutUs from "./components/authenticate/AboutUs";
import ForgotPassword from "./components/authenticate/ForgotPassword";
import Login from "./components/authenticate/Login";
import News from "./components/authenticate/News";
import Register from "./components/authenticate/Register";
import ResetPassword from "./components/authenticate/ResetPassword";
import TermsOfServices from "./components/authenticate/TermsOfServices";
import Landing from "./components/landingPage/Landing";
import User from "./components/layouts/User";
import PrivateRoute from "./components/routing/PrivateRoute";
import SearchResults from "./pages/search/SearchResults";
import { AppState } from "./store";
import { thunkLoadUser } from "./store/authenticate/actions";
import { AuthState } from "./store/authenticate/types";
import { I18nProvider } from "./i18n";
import Footer from "./components/landingPage/Footer";
import Header from "./components/landingPage/Header";
import setLanguage from "./utils/setLanguage";
import ConfirmResetPassword from "./pages/ResetPassword/ConfirmResetPassword";
import ClientConfirmResetPassword from "./pages/ResetPassword/ClientConfirmResetPassword";
import ActivationPayment from "./components/authenticate/ActivationPayment";

interface Props {
  thunkLoadUser: any;
  auth: AuthState;
}
const App: React.FC<Props> = ({ thunkLoadUser }) => {
  const [locale, setLocale] = useState(
    localStorage.getItem("locale") === null
      ? "en-us"
      : localStorage.getItem("locale")
  );
  useEffect(() => {
    let mounted = true;
    setLanguage(locale);
    if (mounted) {
      thunkLoadUser(localStorage.isLawyer);
    }
    return () => {
      mounted = false;
    };
  }, [thunkLoadUser, locale]);
  //
  return (
    <Fragment>
      <I18nProvider locale={locale}>
        <HashRouter>
          <Header setLocale={setLocale} />
          <div style={{ marginTop: "-5%" }}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/terms-of-services"
                component={TermsOfServices}
              />
              <Route exact path="/about-us" component={AboutUs} />
              <Route exact path="/subscribe" component={ActivationPayment} />
              <Route exact path="/news" component={News} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route
                exact
                path="/lawyer/verify-password-reset/:token"
                component={ConfirmResetPassword}
              />
              <Route
                exact
                path="/client/verify-password-reset/:token"
                component={ClientConfirmResetPassword}
              />
              <Route exact path="/search-result" component={SearchResults} />
              <Route exact path="/reset-password" component={ResetPassword} />
              {/* <Route exact path="/test" component={TestPage} /> */}
              <PrivateRoute component={User} setLocale={setLocale} />
            </Switch>
          </div>
          <Footer locale={locale!} />
        </HashRouter>
      </I18nProvider>
    </Fragment>
  );
};
const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { thunkLoadUser })(App);
