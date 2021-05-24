import { makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { dangerColor, whiteColor } from './material-react';

export const navbarLinkStyles = makeStyles(() => ({
    button: {
        height: '100%',
        padding: 20,
    },
    notifications: {
        position: 'absolute',
        top: 13,
        right: 16,
        background: dangerColor[0],
        borderRadius: 20,
        width: '1.1rem',
        height: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid ' + whiteColor,
        color: whiteColor,
        fontSize: 11,
    },
    noNotification: {
        backgroundColor: grey[500],
        height: 10,
        width: 10,
        top: '1.15rem',
        right: '1.3rem',
    },
    menuList: {
        minWidth: '16rem',
    },
    icon: {
        marginRight: 10,
    },
}));
