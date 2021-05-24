import { makeStyles, Theme } from '@material-ui/core';
import { transition } from './material-react';
import { tabHeight } from './navbarStyles';

export const userStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        position: 'relative',
        top: '0',
        height: '100vh',
    },
    mainPanel: {
        backgroundColor: '#EFF0F5',
        paddingTop: tabHeight,
        overflow: 'auto',
        height: '100%',
        float: 'right',
        color: theme.palette.grey[800],
        ...transition,
        maxHeight: '100%',
        width: '100%',
        overflowScrolling: 'touch',
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
}));
