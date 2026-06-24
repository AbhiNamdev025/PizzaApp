import React from 'react';
import { TextField } from '@mui/material';

const MuiTextField = ({ ...props }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default MuiTextField;
