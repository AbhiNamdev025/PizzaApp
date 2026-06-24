import React from 'react';
import { Button } from '@mui/material';

const MuiButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      disableElevation
      {...props}
    >
      {children}
    </Button>
  );
};

export default MuiButton;
