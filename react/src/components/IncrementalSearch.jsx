import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const SearchComponent = ({ onSearch, label,variant }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.length >= 3) {
      onSearch(newSearchTerm);
    }
  };

  return (
    <TextField
      sx={{ maxWidth:'90%' }}
      label={label}
      placeholder='Type atleast 3 letter to search'
      variant={variant}
      value={searchTerm}
      onChange={handleSearchChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchComponent;
