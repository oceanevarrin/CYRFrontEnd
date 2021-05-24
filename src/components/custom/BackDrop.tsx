import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 1300,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#00000088',
            // width: window.innerWidth,
            height: '100%',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    }),
);

const BackDrop = (props: any) => {
    const { children, ...rest } = props;
    const classes = useStyles();
    return (
        <Container maxWidth={false} className={classes.root} {...rest}>
            {children}
        </Container>
    );
};

export default BackDrop;
