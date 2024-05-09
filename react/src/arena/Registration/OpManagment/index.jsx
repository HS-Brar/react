import React, { useState, useEffect } from 'react';
import { useTheme, Box, Table, TableBody, Grid, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, MenuItem, Button } from '@mui/material';
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ResponseAlert from '../../../components/Alert';

const columns = [
  {
    id: 'specilityName',
    label: 'Speciality',
  },

  {
    id: 'servicePointCode',
    label: 'Room No.',
  },
  {
    id: 'doctorList',
    label: 'Doctor',
  },
];

const OpManagment = () => {
  const theme = useTheme();
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const jwtToken = localStorage.getItem("jwtToken");
  const [opData, setOpData] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseAlert, setShowResponseAlert] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  useEffect(() => {
    // console.log("Fetching OP data....");
    fetch('http://10.197.8.17:2023/hmis/api/v1/doctor/opdAssignment', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`

      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        const updatedOpData = data.map((item) => ({
          ...item,
          selectedDoctorId: item.staffId || "",
        }));
        setOpData(updatedOpData);
        // Check if any dropdown initially has a doctor selected
        const isAnyDoctorSelected = updatedOpData.some((row) => row.selectedDoctorId !== "");
        setIsSaveButtonDisabled(isAnyDoctorSelected);
      })
      .catch((error) => {
        console.error('Error fetching Op data:', error);
      });
  }, []);

  const handleShowDoctorList = (row) => {
    setShowDoctorList(true);
    setSelectedRow(row);
  };
  const handleSelectDoctor = (row, selectedDoctorId) => {
    const updatedOpData = opData.map((dataRow) =>
      dataRow === row ? { ...dataRow, selectedDoctorId } : dataRow
    );
    setOpData(updatedOpData);
    setIsSaveButtonDisabled(false);
  };



  const handleSave = () => {
    const selectedDoctors = opData.map((row) => {

      return {
        roomRID: row.servicePointId,
        staffRID: row.selectedDoctorId,
      };
    })
      .filter((doctor) => doctor.staffRID !== "");

    const requestData = {
      changeDoctorCombo: selectedDoctors,
    };

    fetch('http://10.197.8.17:2023/hmis/api/v1/doctor/opdAssignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Contact System Admin .');
        }
        return response.json();
      })
      .then((data) => {
        setResponseMessage(data.message);
        setShowResponseAlert(true);
      })
      .catch((error) => {

        console.error('Error while saving data:', error);
      });
  };

  return (
    <Box m="10px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="OP Managment" subtitle="Assigned Rooms" />
        {showResponseAlert && <ResponseAlert responseMessage={responseMessage} />}
        <Box>
          <Button onClick={() => handleShowDoctorList(opData[0])}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <PublishedWithChangesIcon sx={{ mr: "10px" }} />
            Change
          </Button>
        </Box>
      </Box>

      {/* ROW 2 */}
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <TableContainer component={Paper} sx={{ maxHeight: 520 }}>
          <Table>
            <TableHead sx={{
              backgroundColor: colors.blueAccent[700]
            }}>
              <TableRow>
                {columns.map(column => (
                  <TableCell sx={{
                    fontSize: "18px",
                    fontWeight: "bold",

                  }}
                    key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {opData.length > 0 ? (
                opData.map((row) => (
                  <TableRow key={row.staffId}>
                    {columns.map((column) => (
                      <TableCell key={column.id}
                        sx={{ backgroundColor: colors.primary[400] }}>
                        {column.id === 'doctorList' ? (
                          <FormControl style={{ minWidth: 200, height: 25 }}>
                            <Select
                              style={{ height: 30 }}
                              disabled={!showDoctorList}
                              value={row.selectedDoctorId || ''}
                              onChange={(e) => handleSelectDoctor(row, e.target.value)}
                            >
                              {row.doctorList.map((doctor) => (
                                <MenuItem key={doctor.docRID} value={doctor.docRID}>
                                  {doctor.doctorName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : column.id === 'servicePointCode' ? (
                          row.servicePointCode
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>Loading data...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </TableContainer>
        <TableContainer component={Paper} sx={{ height: 40, mt: "5px" }}>
          <Button
            disabled={isSaveButtonDisabled}
            sx={{ width: '100px', mr: '15px', float: 'right' }}
            variant="contained"
            color="secondary"
            onClick={handleSave}
          >
            Save
          </Button>
        </TableContainer>
      </Box>
    </Box>
  );

};

export default OpManagment;