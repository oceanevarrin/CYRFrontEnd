import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import { customPathes } from "./CustomRoutes";
import { CustomReactLoading } from "./Loading";
import NotFound from "./NotFound";
import { pathes } from "./Routes";

interface Props {
  auth: AuthState;
  exact?: boolean;
  path?: string;
  component: any;
  setLocale: any;
}



const PrivateRoute = ({ auth: { isAuthenticated, loading }, component: Component,   setLocale,...rest }: Props) => {
    const validRoute = () => {
        // const location = useLocation();
        const cp: string[] = window.location.href.split('//')[1].split('/');

        let cpp = '';
        cp.forEach((c, i) => {
            if (i > 0) {
                if (c !== '#') cpp += '/' + c;
            }
        });

        return pathes.includes(cpp);
    };

    const validCustomRoute = () => {
        // const location = useLocation();
        const cp: string[] = window.location.href.split('//')[1].split('/');

        let cpp = '';
        cp.forEach((c, i) => {
            if (i > 0) {
                if (c !== '#') cpp += '/' + c;
            }
        });

        return customPathes.includes(cpp);
    };

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} setLocale={setLocale}/>
                ) : validRoute() || validCustomRoute() ? (
                    loading === false && <Redirect to="/login" />
                ) : (
                    <Route component={NotFound} />
                )
            }
        />
    );
};

const mapStateToProps = (state: AppState) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
