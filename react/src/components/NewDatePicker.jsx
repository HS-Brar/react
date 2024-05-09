import React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

function NewDatePicker({ formData, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Age"
        inputFormat="MM/dd/yyyy"
        value={formData.dob}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            sx={{ m: 1 }}
            fullWidth
            size="small"
            color="secondary"
            id="outlined-basic"
            variant="outlined"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default NewDatePicker;