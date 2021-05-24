import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { AxAsync } from '../../config';
import ResetPassword from './ResetPassword';

interface Props extends RouteComponentProps<RouterProps> {
}

interface RouterProps {
    // type for `match.params`
    token: string; // must be type `string` since value comes from the URL
}

const ClientConfirmResetPassword: React.FC<Props> = ({ match }) => {
    const token = match.params.token;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function resetPassword() {
            const ax = await AxAsync();
            let res = await ax.post(`/api/client/verify-password-reset/${token}`);
            if(res.data === 'valid'){
                setLoading(false);
            }
        }
        resetPassword();
    }, [token]);
    if (loading) {
        return (
            <div>
                <Box pt="50vh" textAlign="center">
                    <CircularProgress disableShrink />
                </Box>
            </div>
        );
        // return <Redirect to= "/register-user" />
    } else {
        return <ResetPassword token={token} isLawyer={false}/>
    }
};

export default ClientConfirmResetPassword;
