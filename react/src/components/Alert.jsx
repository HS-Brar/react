import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const ResponseAlert = ({ responseMessage, messageSeverty }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (responseMessage) {
      setOpen(true);
    }
  }, [responseMessage]);

  const handleClose = () => {
    setOpen(false);
  };

  let severity = '';
  severity = messageSeverty;
  if (severity.includes('Success')) {
    severity = 'success';
  } else if (severity.includes('Error')) {
    severity = 'error';
  } else if (severity.includes('Warning')) {
    severity = 'warning';
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={handleClose}>
        <AlertTitle>{responseMessage.split('!')[0] || responseMessage}</AlertTitle>
        
      </Alert>
    </Snackbar>
  );
};

export default ResponseAlert;
