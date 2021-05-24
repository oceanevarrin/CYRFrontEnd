import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import { Cdivider } from "../../utils/Custum";
import { thunkDeleteAccount, thunkTrialPeriod } from "../../store/authenticate/actions";
import { AuthState } from "../../store/authenticate/types";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import translate from '../../i18n/translate';

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const tiers = [
  {
    title: "Legal Fields",
    // price: '0',
    description: [
      "Tax Law",
      "Banking and Financial Law",
      "Corporate and Business Law",
      "More…",
    ],
    buttonText: "Browse lawyers",
    buttonVariant: "outlined",
  },
  {
    title: "Services",
    // price: '15',
    description: [
      "Contract drafting",
      "Claim & objection",
      "Other services",
      "More…",
    ],
    buttonText: "Browse lawyers",
    buttonVariant: "contained",
  },
  {
    title: "Location",
    // price: '30',
    description: [
      "Zürich (ZH)",
      "Bern / Berne (BE)",
      "Luzern (LU)",
      "More…",
    ],
    buttonText: "Browse lawyers",
    buttonVariant: "outlined",
  },
];

interface Props {
  auth: AuthState;
  thunkDeleteAccount: any;
  thunkTrialPeriod: any;
}

const ClientDashboard = ({
  auth: { user, isLawyer },
  thunkDeleteAccount,
  thunkTrialPeriod,
}: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    thunkTrialPeriod()
  }, [thunkTrialPeriod]);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {    
    thunkDeleteAccount(isLawyer,user.id).then((s:boolean)=>{
      if(s)history.push("/login");
    });
  }

  return (
    <React.Fragment>
      <CssBaseline />

      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h3"
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          {translate("Welcome ")} {translate("to Claim your Rights")}
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          {translate("Quickly find the right jurist at reduced costs")}
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={translate(tier.title)}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    {/* <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography> */}
                    {/* <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography> */}
                  </div>
                  <ul>
                    {tier.description.map((line: any) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {translate(line)}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Link
                    to="/lawyers-list"
                    style={{ width: "100%", margin: "3%", marginLeft: "30%" }}
                  >
                    {translate(tier.buttonText)}
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={4}>
            <Cdivider />
            <div style={{ marginBottom: "20px" }}>
              <button
                style={{ width: "100%" }}
                onClick={handleClickOpen}
                className="btn btn-danger"
              >
                {translate("Delete My Account")}
              </button>
            </div>
          </Grid>
        </Grid>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {translate("Do you really want to delete your account?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {translate("No")}
          </Button>
          <Button onClick={deleteAccount} color="primary" autoFocus>
            {translate("Yes")}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { thunkDeleteAccount, thunkTrialPeriod })(
  ClientDashboard
);
