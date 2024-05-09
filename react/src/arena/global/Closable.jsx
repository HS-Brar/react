import React from 'react';
import { Button } from '@mui/material';

const AddTabButton = ({ handleAddTab }) => {
  
  return (
    <Button variant="contained" onClick={handleAddTab}>
      Add Tab
    </Button>
  );
};

export default AddTabButton;