import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import ClientDashboard from "../client/ClientDashboard";
import LawyerDashboard from "../lawyer/LawyerDashboard";

interface Props {
  auth: AuthState;
}

const Dashboard = ({ auth: { isLawyer } }: Props) => {
  return Boolean(isLawyer) ? <LawyerDashboard /> : <ClientDashboard />;
};
const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {})(Dashboard);
