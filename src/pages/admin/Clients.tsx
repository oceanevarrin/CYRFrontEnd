import React, { useEffect, useState } from "react";
import { thunkDeleteUser } from "../../store/authenticate/actions";
import { thunkGetClients } from "../../store/clients/actions";
import { connect } from "react-redux";
import MaterialTable, { Column } from "material-table";
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Snackbar,
  // Paper,
  SnackbarOrigin,
  Theme,
} from "@material-ui/core";
// import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { AppState } from "../../store";
import { ClientsState } from "../../store/clients/types";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import translate from "../../i18n/translate";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface IAllClients {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface TableState {
  columns: Array<Column<IAllClients>>;
  data: IAllClients[] | null;
}

export interface State extends SnackbarOrigin {
  open: boolean;
}

// function Alert(props: AlertProps) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

interface Props {
  clients: ClientsState;
  thunkDeleteUser: any;
  thunkGetClients: any;
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

const Clients: React.FC<Props> = ({
  clients,
  thunkGetClients,
  thunkDeleteUser,
}) => {
  const classes = useStyles();
  const [tempClients, setTempClients] = useState<IAllClients[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    thunkGetClients();
  }, [thunkGetClients]);

  useEffect(() => {
    // Prepare data
    let cli: IAllClients;
    let temp: IAllClients[] = [];

    if (clients?.clients) {
      clients?.clients.forEach(function (c) {
        cli = {
          _id: c["_id"],
          first_name: c["first_name"],
          last_name: c["last_name"],
          email: c["email"],
        };
        temp.push(cli);
      });
    }
    setTempClients(temp);
  }, [clients?.clients]);

  const [userState] = React.useState<TableState>({
    columns: [
      { title: "First Name", field: "first_name" },
      { title: "Last Name", field: "last_name" },
      { title: "Email", field: "email" },
    ],
    data: tempClients!,
  });

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

  const deleteClient = (id: string) => {
    thunkDeleteUser(false, id).then((s: boolean) => {
      if (s) {
        setSuccessMessage("Client deleted successfully!");
        setSuccessOpen(true);
        thunkGetClients();
      } else {
        setErrorMessage("Error occured, please try again");
        setOpen(true);
      }
    });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h5 style={{ textAlign: "left" }}>Registered Clients</h5>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            title="Browse Clients"
            columns={userState.columns}
            data={tempClients!}
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
                deleteTooltip: "Delete client",
                editRow: {
                  deleteText:
                    "Are you sure you want to deactivate or delete this client ?",
                },
              },
            }}
            // detailPanel={[
            //   {
            //     icon: "account_circle",

            //     tooltip: "User Detail",
            //     render: (rowData) => {
            //       return detail(rowData);
            //     },
            //   },
            // ]}
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
                    resolve();
                    deleteClient(oldData["_id"]);
                  }, 600);
                }),
            }}
          />
        </Grid>
      </Grid>
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
    </div>
  );
};
const mapStateToProps = (state: AppState) => ({
  clients: state.clients,
});

// export default connect(mapStateToProps, { thunkGetClients })(AllUsers);
export default connect(mapStateToProps, { thunkGetClients, thunkDeleteUser })(
  Clients
);
