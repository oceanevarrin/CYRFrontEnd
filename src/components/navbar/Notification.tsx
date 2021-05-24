import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Slide,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import clsx from "clsx";
import React, { useState } from "react";
import { navbarLinkStyles } from "../../assets/jss/navbarLinkStyles";
import { tabHeight } from "../../assets/jss/navbarStyles";

interface Props {
  notifications: any[];
}

export const Notification = ({ notifications }: Props) => {
  const classes = navbarLinkStyles();
  const [open, setOpen] = useState<any>(null);
  const noNofification = notifications.length === 0;

  const handleOpen = (event: any) => {
    if (open && open.contains(event.target)) {
      setOpen(null);
    } else {
      setOpen(event.currentTarget);
    }
  };

  return (
    <Box height={tabHeight}>
      <Button onClick={handleOpen} className={classes.button}>
        <NotificationsIcon />
        <div
          className={clsx(classes.notifications, {
            [classes.noNotification]: noNofification,
          })}
        >
          {!noNofification && notifications?.length}
        </div>
      </Button>

      <Popper
        placement="bottom-end"
        open={Boolean(open)}
        anchorEl={open}
        transition
        aria-dropeffect="popup"
        disablePortal
      >
        <Slide in={Boolean(open)}>
          <Paper elevation={6} style={{ borderRadius: 0 }}>
            <ClickAwayListener onClickAway={() => setOpen(null)}>
              <MenuList role="menu" className={classes.menuList}>
                {notifications?.map((msg) => (
                  <div>
                    <MenuItem onClick={handleOpen}>
                      {msg}
                      <Divider />
                    </MenuItem>
                    <Divider light />
                  </div>
                ))}
                {noNofification && (
                  <MenuItem onClick={handleOpen}>
                    No notifications
                    <Divider />
                  </MenuItem>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Slide>
      </Popper>
    </Box>
  );
};
