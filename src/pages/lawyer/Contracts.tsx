import React, { useEffect, useState } from "react";
import {
  thunkGetContracts,
  thunkDecideOnContracts,
} from "../../store/lawyers/actions";
import { connect } from "react-redux";
import MaterialTable, { Column } from "material-table";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Snackbar,
  Theme,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { LawyersState } from "../../store/lawyers/types";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import translate from "../../i18n/translate";
import { useHistory } from "react-router-dom";
export interface ContractType {
  _id: string;
  contract_title: string;
  payment_amount: number;
  client_agreed: string;
  lawyer_agreed: string;
  status: string;

  // deadline : Date;
}

interface TableState {
  columns: Array<Column<ContractType>>;
  data: ContractType[];
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {
  auth: AuthState;
  lawyers: LawyersState;
  thunkGetContracts: any;
  thunkDecideOnContracts: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridRoot: {
      margint: "2rem",
    },
    detailPaper: {
      padding: theme.spacing(2),
      textAlign: "center",
      height: "auto",
      color: theme.palette.text.secondary,
    },
    cardRoot: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    inline: {
      display: "inline",
    },
    root: {
      flexGrow: 1,
      marginLeft: "9%",
      marginRight: "9%",
      marginTop: "2%",
      [theme.breakpoints.down("sm")]: {
        margin: "1%",
      },
    },
    newroot: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);
const Contracts: React.FC<Props> = ({
  auth,
  lawyers: { contracts },
  thunkGetContracts,
  thunkDecideOnContracts,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [dialogueOpen, setDialogueOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogueOpen(true);
  };

  const handleDialogueClose = () => {
    setDialogueOpen(false);
  };

  const [agreedText] = useState<string>(
    localStorage.getItem("locale") === "en-us"
      ? "Agreed"
      : localStorage.getItem("locale") === "de-de"
      ? "Vereinbart"
      : "Accepté"
  );
  const [pendingText] = useState<string>(
    localStorage.getItem("locale") === "en-us"
      ? "Pending"
      : localStorage.getItem("locale") === "de-de"
      ? "Ausstehende Genehmigung"
      : "En attente"
  );
  const [incompleteText] = useState<string>(
    localStorage.getItem("locale") === "en-us"
      ? "Incomplete"
      : localStorage.getItem("locale") === "de-de"
      ? "Unvollständig"
      : "Incomplet"
  );
  const [completeText] = useState<string>(
    localStorage.getItem("locale") === "en-us"
      ? "Completed"
      : localStorage.getItem("locale") === "de-de"
      ? "Abgeschlossen"
      : "Terminé"
  );
  const [rejectedText] = useState<string>(
    localStorage.getItem("locale") === "en-us"
      ? "Rejected"
      : localStorage.getItem("locale") === "de-de"
      ? "Abgelehnt"
      : "Rejeté"
  );

  const [tempContracts, settempContracts] = useState<ContractType[]>([]);
  useEffect(() => {
    thunkGetContracts(auth.isLawyer);
  }, [auth, thunkGetContracts]);

  useEffect(() => {
    let cnt: ContractType;
    let temp: ContractType[] = [];
    if (contracts) {
      contracts?.forEach(function (c) {
        cnt = {
          _id: c["_id"],
          contract_title: c["contract_title"],
          client_agreed:
            c["client_agreed"] === "agreed" ? agreedText : "Not Agreed",
          lawyer_agreed:
            c["lawyer_agreed"] === "none"
              ? pendingText
              : c["lawyer_agreed"] === "not agreed"
              ? rejectedText
              : agreedText,
          status:
            c["status"] === "incomplete"
              ? incompleteText
              : c["status"] === "started"
              ? "In progress"
              : completeText,
          payment_amount: c["payment_amount"],
        };

        temp.push(cnt);
      });
    }
    settempContracts(temp);
  }, [
    contracts,
    agreedText,
    completeText,
    incompleteText,
    rejectedText,
    pendingText,
  ]);

  const [contractState] = React.useState<TableState>({
    columns: [
      { title: translate("Title"), field: "contract_title" },
      { title: translate("Amount (in CHF)"), field: "payment_amount" },
      { title: translate("Your Status"), field: "lawyer_agreed" },
      { title: translate("Client Status"), field: "client_agreed" },
      { title: translate("Job Status"), field: "status" },
    ],
    data: tempContracts,
  });

  const AcceptContract = (rowData: ContractType) => {
    thunkDecideOnContracts(rowData?._id, true).then((s: boolean) => {
      if (s) {
        setSuccessMessage("Contract signed successfully!");
        thunkGetContracts(auth.isLawyer);
        setSuccessOpen(true);
      } else {
        setOpen(true);
      }
    });
  };
  const RejectContract = (rowData: ContractType) => {
    thunkDecideOnContracts(rowData?._id, false).then((s: boolean) => {
      if (s) {
        setSuccessMessage("Contract rejected successfully!");
        thunkGetContracts(auth.isLawyer);
        setSuccessOpen(true);
      } else {
        setOpen(true);
      }
    });
  };

  const handleToastClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSuccessToastClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const setupPayment = () => {
    history.push("/setup-payment");
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h5 style={{ textAlign: "left" }}>{translate("Your Contracts")}</h5>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            title=""
            columns={contractState.columns}
            data={tempContracts}
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              toolbar: {
                nRowsSelected: "{0} row(s) selected",
                exportCSVName: translate("Export as CSV"),
                exportPDFName: translate("Export as PDF"),
              },
              header: {
                actions: "Actions",
              },
              body: {
                emptyDataSourceMessage: translate("No contracts to display"),
                filterRow: {
                  filterTooltip: "Filter",
                },
                deleteTooltip: translate("Delete Contract"),
                editRow: {
                  deleteText: translate(
                    "Are you sure you want to delete this contract ?"
                  ),
                },
              },
            }}
            options={{
              actionsColumnIndex: -1,
              exportButton: true,
              rowStyle: {
                backgroundColor: "#F5F6F9",
              },
            }}
            actions={[
              (rowData) => ({
                icon: "done",
                iconProps: { style: { color: "#2196f3" } },
                tooltip: "Accept Job Offer",
                onClick: (event, rowData: any) => {
                  event?.preventDefault();
                  auth?.user.has_card ? AcceptContract(rowData!) : handleClickOpen();
                },
                disabled: rowData.lawyer_agreed === "Pending" ? false : true,
              }),

              (rowData) => ({
                icon: "close",
                iconProps: { style: { color: "#2196f3" } },
                tooltip: "Reject Job Offer",
                onClick: (event, rowData: any) => {
                  event?.preventDefault();
                  RejectContract(rowData!);
                },
                disabled: rowData.lawyer_agreed === "Pending" ? false : true,
              }),
            ]}
            detailPanel={[
              {
                icon: "assignment",
                tooltip: "Contracts",
                render: () => {
                  return null;
                },
              },
            ]}
          />
          <div className={classes.newroot}>
            <Snackbar
              open={successOpen}
              autoHideDuration={3000}
              onClose={handleSuccessToastClose}
            >
              <Alert onClose={handleSuccessToastClose} severity="success">
                {translate(successMessage)}
              </Alert>
            </Snackbar>
          </div>
          <div className={classes.newroot}>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleToastClose}
            >
              <Alert onClose={handleToastClose} severity="error">
                {translate("Error occured, please try again")}
              </Alert>
            </Snackbar>
          </div>
          <Dialog
            open={dialogueOpen}
            onClose={handleDialogueClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {translate("No billing method found! ")}
                {translate("Setup Billing Method")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogueClose} color="primary">
                {translate("Cancel")}
              </Button>
              <Button onClick={setupPayment} color="primary" autoFocus>
                {translate("Ok")}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};
const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  lawyers: state.lawyers,
});

export default connect(mapStateToProps, {
  thunkGetContracts,
  thunkDecideOnContracts,
})(Contracts);
