import React, { useEffect, useState } from "react";
import {
  thunkGetContracts,
  thunkDecideOnContracts,
} from "../../store/lawyers/actions";
import {  thunkCompleteWork } from "../../store/clients/actions";
// import { thunkMakePayment } from "../../store/clients/actions";
import { connect } from "react-redux";
import MaterialTable, { Column } from "material-table";
import {
  // Button,
  createStyles,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Snackbar,
  // TextField,
  Theme,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { LawyersState } from "../../store/lawyers/types";
import { AppState } from "../../store";
import { AuthState } from "../../store/authenticate/types";
import { useHistory } from "react-router-dom";
// import SettingsIcon from "@material-ui/icons/Settings";
import translate from '../../i18n/translate';

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
  // thunkMakePayment: any;
  thunkCompleteWork: any;
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
  auth : { isLawyer },
  lawyers,
  thunkGetContracts,
  thunkCompleteWork,
  // thunkDecideOnContracts,
  // thunkMakePayment,
}) => {
  const classes = useStyles();
  // const history = useHistory();
  const [data, setData] = useState<ContractType | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [tempContracts, settempContracts] = useState<ContractType[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [agreedText,] = useState<string>(localStorage.getItem("locale") === 'en-us' ? "Agreed" : localStorage.getItem("locale") === 'de-de'? "Vereinbart" : "Accepté");
  const [pendingText,] = useState<string>(localStorage.getItem("locale") === 'en-us' ? "Pending" : localStorage.getItem("locale") === 'de-de'? "Ausstehende Genehmigung" : "En attente");
  const [incompleteText,] = useState<string>(localStorage.getItem("locale") === 'en-us' ? "Incomplete" : localStorage.getItem("locale") === 'de-de'? "Unvollständig" : "Incomplet");
  const [completeText,] = useState<string>(localStorage.getItem("locale") === 'en-us' ? "Completed" : localStorage.getItem("locale") === 'de-de'? "Abgeschlossen" : "Terminé");
  const [rejectedText,] = useState<string>(localStorage.getItem("locale") === 'en-us' ? "Rejected" : localStorage.getItem("locale") === 'de-de'? "Abgelehnt" : "Rejeté");

  const [formData, setFormData] = useState({
    description: "",
  });
  const { description } = formData;

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    thunkGetContracts(isLawyer);
  }, [isLawyer, thunkGetContracts]);

  useEffect(() => {
    let cnt: ContractType;
    let temp:ContractType[] = [];
    if (lawyers?.contracts) {

      lawyers?.contracts?.forEach(function (c) {
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
  }, [lawyers?.contracts, agreedText, completeText, incompleteText, rejectedText, pendingText]);

  const [contractState] = React.useState<TableState>({
    columns: [
      { title: translate("Title"), field: "contract_title" },
      { title: translate("Amount (in CHF)"), field: "payment_amount" },
      { title: translate("Your Status"), field: "client_agreed" },
      { title: translate("Lawyer Status"), field: "lawyer_agreed" },
      { title: translate("Job Status"), field: "status" },
    ],
    data: tempContracts,
  });

  // const AcceptContract = (rowData: ContractType) => {
  //   // thunkDecideOnContracts(rowData?._id,true).then((s:boolean)=>{
  //   //   if(s){
  //   //     setSuccessMessage("Contract signed successfully!");
  //   //     setSuccessOpen(true);
  //   //   }else{
  //   //     setOpen(true);
  //   //   }
  //   // });
  //   console.log(rowData);
  // };
  const RejectContract = (rowData: ContractType) => {
    setSuccessMessage("Contract rejected successfully!");
    // thunkDecideOnContracts(rowData?._id,false).then((s:boolean)=>{
    //   if(s){
    //     setSuccessMessage("Contract rejected successfully!");
    //     setSuccessOpen(true);
    //   }else{
    //     setOpen(true);
    //   }
    // });
    console.log(rowData);
  };

  // const MakePayment = (e:any) => {
  //   e.preventDefault();
  //   thunkMakePayment(data?._id, description).then((s: boolean) => {
  //     if (s) {
  //       setSuccessMessage("Payment made successfully!");
  //       thunkGetContracts(isLawyer);
  //       setSuccessOpen(true);
  //       setFormData({
  //         description: "",
  //       });
  //       setTimeout(() => {
  //         setDialogOpen(false);
  //       }, 2000);
  //     } else {
  //       setOpen(true);
  //     }
  //   });
  // };

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

  const handleClickOpen = (rowData: ContractType) => {
    setDialogOpen(true);
    setData(rowData);
  };

  const CompleteWork = (rowData: ContractType) => {
    thunkCompleteWork(rowData?._id).then((s:boolean)=>{
      s && setSuccessMessage("Contract completed successfully!");
      setSuccessOpen(true);
      thunkGetContracts(isLawyer);
    });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  // const setupPayment = () => {
  //   history.push("/setup-payment");
  // };

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
                exportPDFName: translate("Export as PDF")
              },
              header: {
                actions: "Actions",
              },
              body: {
                emptyDataSourceMessage: translate("No contracts to display"),
                filterRow: {
                  filterTooltip: "Filter",
                },
                deleteTooltip: translate("Delete contract"),
                editRow: {
                  deleteText: translate("Are you sure you want to delete this contract ?"),
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
              // (rowData) => ({
              //   icon: "checkCircleOutline",
              //   iconProps: { style: { color: "#2196f3" } },
              //   tooltip: "A Lawyer",
              //   onClick: (event, rowData: any) => {
              //     event?.preventDefault();
              //     AcceptContract(rowData!);
              //   },
              //   disabled: rowData.lawyer_agreed === "Agreed" ? true : true,
              // }),
              (rowData) => ({
                icon: "close",
                iconProps: { style: { color: "#2196f3" } },
                tooltip: "Cancel job",
                onClick: (event, rowData: any) => {
                  event?.preventDefault();
                  RejectContract(rowData!);
                },
                disabled: rowData.lawyer_agreed === "Agreed" ? true : true,
              }),
              // (rowData) => ({
              //   icon: "payment",
              //   iconProps: { style: { color: "#2196f3" } },
              //   tooltip: "Pay",
              //   onClick: (event, rowData: any) => {
              //     event?.preventDefault();
              //     handleClickOpen(rowData!);
              //     // MakePayment(rowData!);
              //   },
              //   disabled: (rowData.lawyer_agreed === "Pending" || rowData.lawyer_agreed === "Rejected" ||rowData.status === "In progress" )? true : false,
              // }),
              (rowData) => ({
                icon: "checkCircle",
                iconProps: { style: { color: "#2196f3" } },
                tooltip: "Complete work",
                onClick: (event, rowData: any) => {
                  event?.preventDefault();
                  CompleteWork(rowData!);
                },
                disabled: rowData.status === "Completed" || rowData.lawyer_agreed === "Pending"  ? true : false,
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
        </Grid>
      </Grid>

      {/* Payment form  */}
      {/* <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!Boolean(user?.has_card!) && (
          <div
            className="alert alert-danger alert-dismissible fade show m-2"
            role="alert"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {translate("No billing method found!")}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={setupPayment}
                  style={{
                    width: "100%",
                    color: "white",
                    backgroundColor: "#cc0066",
                    
                  }}
                >
                  <SettingsIcon/>{translate("Setup Billing Method")}
                </Button>
                
              </Grid>
            </Grid>
          </div>
        )}
        <DialogTitle id="form-dialog-title">{translate("Payment")}</DialogTitle>
        <form onSubmit={MakePayment}>
          <DialogContent>
            <DialogContentText>
              {translate("To make payment for this contract, please enter description here.")}
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="textarea"
              onChange={onChange}
              disabled={user?.has_card! ? false : true}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              style={{
                width: "30%",
                color: "white",
                backgroundColor: "#32a875",
              }}
              disabled={user?.has_card! ? false : true}
            >
              {translate("Pay")}
            </Button>
            <Button onClick={handleClose} color="primary">
              {translate("Cancel")}
            </Button>
          </DialogActions>
        </form>
      </Dialog> */}
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
  // thunkMakePayment,
  thunkCompleteWork,
})(Contracts);
