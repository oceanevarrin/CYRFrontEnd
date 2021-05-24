import { Box, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import React from "react";
import { grey } from "@material-ui/core/colors";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { ILawyer, Profile } from "../../store/lawyers/types";
import { useHistory } from "react-router-dom";
import translate from '../../i18n/translate';

interface Props {
  isLawyer: boolean;
  selectedUser: any;
  openContract: any;
  thunkSetSelectedUser: any;
  thunkGetLawyerProfile: any;
}

const Titlebar = (props: Props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const viewDetail = () => {
    // Prepare data
    let law: ILawyer | null = null;
    let legalfields: string[] = [];
    let lawProfile: Profile;
    if (props.selectedUser?.client) {
      lawProfile = {
        _id: props.selectedUser.client?._id,
        clients: props.selectedUser.client?.clients,
        rating: props.selectedUser.client?.rating,
        first_name: props.selectedUser.client?.first_name,
        last_name: props.selectedUser.client?.last_name,
        email: props.selectedUser.client?.email,
      };
      law = {
        lawyer: lawProfile,
        legal_fields: legalfields,
      };
    }
    props.thunkGetLawyerProfile(props.selectedUser.client._id);
    props.thunkSetSelectedUser(law);
    history.push('/lawyer-detail');
  };

  const handleDetailClose = () => {
    setAnchorEl(null);

    console.log("selectedUser", props.selectedUser);

    props.openContract();
  };
  return props.isLawyer && props.selectedUser ? (
    <Box
      bgcolor={grey[400]}
      borderBottom="1px solid #eeeeee"
      height="3rem"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <Typography>
          {props.selectedUser?.client
            ? props.selectedUser?.client?.first_name +
              " " +
              props.selectedUser?.client?.last_name
            : props.selectedUser?.first_name &&
              props.selectedUser?.first_name +
                " " +
                props.selectedUser?.last_name}
        </Typography>
      </Box>
    </Box>
  ) : props.selectedUser ? (
    <Box
      bgcolor={grey[400]}
      borderBottom="1px solid #eeeeee"
      height="3rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="70%"
      >
        <Typography>
          {props.selectedUser?.client
            ? props.selectedUser?.client?.first_name +
              " " +
              props.selectedUser?.client?.last_name
            : props.selectedUser?.first_name &&
              props.selectedUser?.first_name +
                " " +
                props.selectedUser?.last_name}
        </Typography>
      </Box>
      <IconButton
        onClick={handleClick}
        color="primary"
        style={{
          width: 20,
          height: 20,
          backgroundColor: "#CDD0D344",
          outline: "none",
        }}
      >
        <MoreHorizIcon style={{ marginRight: "2rem" }} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleDetailClose}
      >
        <MenuItem onClick={handleDetailClose}>{translate("Offer Job")}</MenuItem>
        <MenuItem onClick={viewDetail}>{translate("View Detail")}</MenuItem>
      </Menu>
    </Box>
  ) : (
    <Box
      bgcolor={grey[400]}
      borderBottom="1px solid #eeeeee"
      height="3rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    ></Box>
  );
};

export default Titlebar;
