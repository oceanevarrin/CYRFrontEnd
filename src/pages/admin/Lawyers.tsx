import React, { useEffect, useState } from "react";
import {
  thunkGetAllRegisteredLawyers,
  thunkApproveLawyer,
} from "../../store/lawyers/actions";
import { thunkDeleteUser } from "../../store/authenticate/actions";
import { connect } from "react-redux";
import MaterialTable, { Column } from "material-table";
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Snackbar,
  Theme,
} from "@material-ui/core";
import { AppState } from "../../store";
import { LawyersState } from "../../store/lawyers/types";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import translate from "../../i18n/translate";
interface TableState {
  columns: Array<Column<IAllLawyers>>;
  data: IAllLawyers[];
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface IAllLawyers {
  _id: string;
  clients: [];
  rating: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_built: string;
  role: string;
  status: string;
  approval_requested: string;
}

// function Alert(props: AlertProps) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

interface Props {
  lawyers: LawyersState;
  thunkGetAllRegisteredLawyers: any;
  thunkApproveLawyer: any;
  thunkDeleteUser: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: "9%",
      marginRight: "9%",
      marginTop: "2%",
      [theme.breakpoints.down("sm")]: {
        margin: "1%",
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    newroot: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const Lawyers: React.FC<Props> = ({
  lawyers,
  thunkDeleteUser,
  thunkGetAllRegisteredLawyers,
  thunkApproveLawyer,
}) => {
  const classes = useStyles();
  const [tempLawyers, setTempLawyers] = useState<IAllLawyers[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    thunkGetAllRegisteredLawyers();
  }, [thunkGetAllRegisteredLawyers]);

  useEffect(() => {
    // Prepare data
    let law: IAllLawyers;
    let temp: IAllLawyers[] = [];

    if (lawyers?.allLawyers) {
      lawyers?.allLawyers.forEach(function (l) {
        law = {
          _id: l["_id"],
          clients: l["clients"],
          rating: l["rating"],
          first_name: l["first_name"],
          last_name: l["last_name"],
          email: l["email"],
          profile_built: l["profile_built"] ? "Yes" : "No",
          role: l["role"],
          status: l["status"],
          approval_requested: l["approval_requested"] ? "Yes" : "No",
        };
        temp.push(law);
      });
    }
    setTempLawyers(temp);
  }, [lawyers?.allLawyers]);

  const [userState] = React.useState<TableState>({
    columns: [
      { title: "First Name", field: "first_name" },
      { title: "Last Name", field: "last_name" },
      { title: "Email", field: "email" },
      { title: "Rating", field: "rating" },
      { title: "Approval Requested", field: "approval_requested" },
      { title: "Profile", field: "profile_built" },
      { title: "Status", field: "status" },
    ],
    data: tempLawyers,
  });

  const ApproveLawyer = (rowData: IAllLawyers) => {
    if (rowData.approval_requested === "No") {
      setErrorMessage("Approval is not requested.");
      setOpen(true);
    } else if (rowData.status === "active") {
      setErrorMessage("Lawyer is already active.");
      setOpen(true);
    } else {
      thunkApproveLawyer(rowData?._id).then((s: boolean) => {
        if (s) {
          setSuccessMessage("Lawyer Approved successfully!");
          setSuccessOpen(true);
          thunkGetAllRegisteredLawyers();
        } else {
          setErrorMessage("Error occured, please try again");
          setOpen(true);
        }
      });
    }
  };

  const deleteLawyer = (id: string) => {
    thunkDeleteUser(true, id).then((s: boolean) => {
      if (s) {
        setSuccessMessage("Lawyer deleted successfully!");
        setSuccessOpen(true);
        thunkGetAllRegisteredLawyers();
      } else {
        setErrorMessage("Error occured, please try again");
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

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h5 style={{ textAlign: "left" }}>Registered Lawyers</h5>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            title="Browse Lawyers"
            columns={userState.columns}
            data={tempLawyers}
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
                emptyDataSourceMessage: "No records to display",
                filterRow: {
                  filterTooltip: "Filter",
                },
                deleteTooltip: "Delete Lawyer",
                editRow: {
                  deleteText: "Are you sure you want to delete this lawyer ?",
                },
              },
            }}
            actions={[
              (rowData) => ({
                icon: "done",
                tooltip: "Approve Lawyer",
                onClick: (event, rowData: any) => {
                  event?.preventDefault();
                  ApproveLawyer(rowData!);
                },
                disabled: rowData.status === "active" ? true : false,
              }),
            ]}
            // components={{
            //   Action: (props) => (
            //     <Button
            //       onClick={(event) => props.action.onClick(event, props.data)}
            //       disabled={props.data.status === "active" ? true : false}
            //       variant="contained"
            //       style={{
            //         textTransform: "none",
            //         backgroundColor: "#32a875",
            //         color: "white",
            //       }}
            //       size="small"
            //     >
            //       Approve
            //     </Button>

            //   ),
            // }}
            options={{
              actionsColumnIndex: -1,
              exportButton: true,
              columnsButton: true,
              rowStyle: {
                backgroundColor: "#EEE",
                paddingTop: "20px",
                borderColor: "#707070",
              },
              actionsCellStyle: {
                MozColumnGap: "2rem",
              },
            }}
            editable={{
              onRowDelete: (oldData) =>
                new Promise<void>((resolve) => {
                  setTimeout(() => {
                    deleteLawyer(oldData["_id"]);
                  }, 600);
                }),
            }}
          />
          <div className={classes.newroot}>
            <Snackbar
              open={successOpen}
              autoHideDuration={3000}
              onClose={handleSuccessToastClose}
            >
              <Alert onClose={handleSuccessToastClose} severity="success">
                {successMessage}
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
                {errorMessage}
              </Alert>
            </Snackbar>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
const mapStateToProps = (state: AppState) => ({
  lawyers: state.lawyers,
});

export default connect(mapStateToProps, {
  thunkGetAllRegisteredLawyers,
  thunkApproveLawyer,
  thunkDeleteUser,
})(Lawyers);
