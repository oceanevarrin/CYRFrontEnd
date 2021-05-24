import { Box, Typography } from "@material-ui/core";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { themeColor } from "../../assets/jss/material-react";

export const LoadingDot = (props: any) => {
  const [count] = useState("...");
  // useEffect(() => {
  //     let mounted = true;
  //     if (mounted) {
  //         setTimeout(() => {
  //             setCount(count + ' .');
  //             if (count.length === 6) setCount('');
  //         }, 400);
  //     }
  //     return () => {
  //         mounted = false;
  //     };
  // }, [count]);

  return (
    <Box
      position="relative"
      minWidth="5.5rem"
      textAlign="left"
      display="flex"
      alignItems="center"
      fontWeight="bold"
      pr="2.1rem"
      {...props}
    >
      <Typography variant="inherit">
        {props.msg ? props.msg : "Loading"}{" "}
      </Typography>
      <Box width="2rem" position="absolute" right={0}>
        <Typography variant="inherit">{count}</Typography>
      </Box>
    </Box>
  );
};
interface ICustomReactLoading {
  size?: number;
  color?: string;
  type?: "spin" | "spinningBubbles";
  msg?: string;
}
export const CustomReactLoading = ({
  size = 24,
  color = "inherit",
  type = "spin",
  msg = "Loading",
}: ICustomReactLoading) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={color}
    >
      <ReactLoading
        type={type}
        height={size}
        width={size}
        delay={0}
        color={themeColor}
      />
      <LoadingDot fontWeight="normal" ml={1} msg={msg} />
    </Box>
  );
};
