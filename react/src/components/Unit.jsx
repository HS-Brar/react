import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const UnitSelect = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitsData, setUnitsData] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  
  useEffect(() => {
    fetch('http://10.197.8.17:2023/hmis/api/v1/loggedInUserInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid network response.');
      }
      return response.json();
    })
    .then((data) => {
      setUnitsData(data);
      const initialSelectedUnit = data.units.find(unit => unit.primaryUnit === 1);
      if (initialSelectedUnit) {
        setSelectedUnit(initialSelectedUnit.unitID);
      }
    })
    .catch((error) => {
      console.error('Error fetching Units:', error);
    });
  }, []);
  const handleUnitChange = (event) => {
    const newSelectedUnit = event.target.value;
    setSelectedUnit(newSelectedUnit);

    if (newSelectedUnit) {
      const apiUrl = `http://10.197.8.17:2023/hmis/api/v1/user/selectedUnit/${newSelectedUnit}`;

      fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      })
      .then((response) => {
        if (response.ok) {
          console.log('Selected unit saved successfully.');
        } else {
          console.error('Error saving selected unit:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
    } else {
      // Handle the case where no unit is selected
      console.warn('Please select a unit before saving.');
    }
  };

  useEffect(() => {
    fetch('http://10.197.8.17:2023/hmis/api/v1/loggedInUserInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid network response.');
      }
      return response.json();
    })
    .then((data) => {
      setUnitsData(data);
    })
    .catch((error) => {
      console.error('Error fetching Units:', error);
    });
  }, []);

  return (
    <div>
      <FormControl>
        <Select sx={{ boxShadow: 'none',
         '.MuiOutlinedInput-notchedOutline': { border: 'none' },
         height:'41px',
        '.MuiSelect-iconOutlined':{color:'#e91e63'} }}
          label="Select Unit"
          value={selectedUnit}
          onChange={handleUnitChange}
        >
          {unitsData.units && unitsData.units.length > 0 ? (
            unitsData.units.map((unit) => (
              <MenuItem key={unit.unitID} value={unit.unitID}>
                {unit.unitCode}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No units available</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default UnitSelect;
