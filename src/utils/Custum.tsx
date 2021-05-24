import { Box, BoxProps, Checkbox, Divider, Grid, IconProps, Typography, TypographyProps } from '@material-ui/core';
import React from 'react';

export const Flex = ({ children, ...props }: BoxProps) => (
    <Box display="flex" alignItems="center" {...props}>
        {children}
    </Box>
);
export const Flexc = ({ children, ...props }: BoxProps) => (
    <Flex justifyContent="center" {...props}>
        {children}
    </Flex>
);
export const Flexb = ({ children, ...props }: BoxProps) => (
    <Flex justifyContent="space-between" {...props}>
        {children}
    </Flex>
);
export const Flexe = ({ children, ...props }: BoxProps) => (
    <Flex justifyContent="flex-end" {...props}>
        {children}
    </Flex>
);
export const Ccontainer = ({ children, ...props }: BoxProps) => (
    <Box p="3.5rem 5% 2rem" {...props}>
        {children}
    </Box>
);
export const Cdivider = ({ m = '1.4rem 0', ...rest }: any) => {
    return <Divider style={{ margin: m }} {...rest} />;
};

interface ICt extends TypographyProps {
    fs?: number | string;
    fc?: string;
    fw?: number;
    m?: string | number;
    ml?: string | number;
    mr?: string | number;
    minWidth?: string | number;
    b?: boolean;
    component?: any;
}
export const Text = ({ children, fs, fc, fw, m, b, ml, mr, minWidth, component, ...props }: ICt) => (
    <Typography
        component={component}
        variant="inherit"
        display="block"
        {...props}
        style={{
            minWidth,
            fontSize: fs,
            color: fc,
            fontWeight: b ? 700 : fw,
            margin: m,
            marginRight: mr,
            marginLeft: ml,
        }}
    >
        {children}
    </Typography>
);
interface ICicon extends IconProps {
    m?: string | number;
    ml?: string | number;
    mr?: string | number;
    icon: any;
}
export const Cicon = ({ m, ml, mr, ...props }: ICicon) => {
    return <props.icon style={{ margin: m, marginLeft: ml, marginRight: mr }} {...props} />;
};

export const Filter = ({ text, ...props }: any) => (
    <Flex width="auto" border="1px solid #cccccc" p="0 3px 0 10px" borderRadius="2rem">
        <Text>{text} </Text>
        <Checkbox
            color="default"
            size="small"
            style={{ margin: '0px', fontSize: 'inherit' }}
            inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
            {...props}
        />
    </Flex>
);
export const CBox = ({ children, ...props }: any) => (
    <Box height="100%" {...props}>
        {children}
    </Box>
);
export const CGrid = ({ children, style, ...props }: any) => (
    <Grid style={{ height: 'auto', width: 'auto', ...style }} {...props}>
        {children}
    </Grid>
);
