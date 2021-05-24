import { Box, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { AxAsync } from "../../config";
import ResetPassword from "./ResetPassword";

interface Props extends RouteComponentProps<RouterProps> {}

interface RouterProps {
  // type for `match.params`
  token: string; // must be type `string` since value comes from the URL
}

const ConfirmResetPassword: React.FC<Props> = ({ match }) => {
  const token = match.params.token;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resetPassword() {
      const ax = await AxAsync();
      let res = await ax.post(`/api/lawyer/verify-password-reset/${token}`);

      if (res.data === "valid") {
        setLoading(false);
      }
    }
    resetPassword();
  }, [token]);

  return loading ? (
    <div>
      <Box pt="50vh" textAlign="center">
        <CircularProgress disableShrink />
      </Box>
    </div>
  ) : (
    <ResetPassword token={token} isLawyer={true} />
  );
};

export default ConfirmResetPassword;
