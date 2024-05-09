import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Button,
  useTheme,
  FormControl,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import ResponseAlert from '../../../components/Alert';
import JasperReport from "../../../components/JasperReport";
import { BrowserRouter as Router, Route, Link, useNavigate } from "react-router-dom";
const MEDICATIONDISPENSE = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const jwtToken = localStorage.getItem("jwtToken");
  const [showResponseAlert, setShowResponseAlert] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [messageSeverty, setMessageSeverty] = useState('');
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  //Column Defination for Patient table

  const handleRemoveRow = (rowIdToRemove) => {
    // Use the current drugTable data and filter out the row to remove
    const updatedDrugTable = drugTable.filter((row) => row.id !== rowIdToRemove);
    // Update the drugTable state with the updated data
    setDrugTable(updatedDrugTable);
  };
  const patientTableColumns = [
    {
      field: "uhid", headerName: "UHID",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "gender",
      headerName: "Gender",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
  ];
  //Column Defination for drug table
  const drugTableColumns = [
    {
      field: "Medicine Name",
      headerName: "Medicine Name",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "No. of Days",
      headerName: "No. of Days",
      type: "number",
      headerAlign: "left",
      align: "left"
    },
    {
      field: "Batch No.",
      headerName: "Batch No.",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Expiry",
      headerName: "Expiry",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Prescribed Qty.",
      headerName: "Prescribed Qty.",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Pending Qty",
      headerName: "Pending Qty",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Issue Qty.",
      headerName: "Issue Qty.",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true

    },

    { field: "Unit", headerName: "Unit" },
    {
      field: "remove",
      headerName: "",
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleRemoveRow(params.row.id)}
        >
          Remove
        </Button>
      ),
    },
  ];
  const [searchFormData, setSearchFormData] = useState({
    "uhid": "",
    "mobile": "",
    "firstName": "",
    "lastName": "",
    "genderID": 0,
    "dob": "",
    "aadharCardNo": "",
    "age": 0,
    "visited": 0,
    "ago": ""
  });
  const [saveData, setSaveData] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [newDispenseMedicinePage, setnewDispenseMedicinePage] = useState("");
  const [patientTable, setPatientTable] = useState("");
  const [patientTableRows, setPatientTableRows] = useState([]);
  const [drugTable, setDrugTable] = useState("");
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleSearch = (searchFormData) => {
    fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patient/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(searchFormData)
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
        const tempData = data.map(patient => {
          return {
            id: patient.uhid,
            uhid: patient.uhid || '',
            name: patient.patientName || '',
            gender: patient.gender || '',
            age: patient.visitData[0].visitAge || '',
            address: patient.address || ''
          };
        });
        setPatientTableRows(tempData);
        setPatientTable(
          <Box
            m="10px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[400],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary[400],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid
              rows={tempData}
              columns={patientTableColumns}
              onRowClick={(params) => patientRowClick(data.filter((patient) => patient.uhid.includes(params.id))[0])}
            />
          </Box>
        );
      })
      .catch((error) => {
        console.error('Error in Searching Patient for Medicine dispense:', error);
      });

  };
  const clearData = () => {
    const initialFormData = {
      "uhid": "",
      "mobile": "",
      "firstName": "",
      "lastName": "",
      "genderID": 0,
      "dob": "",
      "aadharCardNo": "",
      "age": 0,
      "visited": 0,
      "ago": 0
    };
    setSearchFormData(initialFormData);
  };
  const [showSearchDialog, setShowSearchDialog] = useState(
    <FormControl fullWidth>
      <Grid xs={12} container>
        <Grid xs={3} item sx={{ p: 3, color: "red" }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              name="uhid"
              color="secondary"
              id="outlined-basic"
              label="UHID"
              onChange={(e) => searchFormData.uhid = e.target.value}
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="First Name"
              name="firstName"
              onChange={(e) => searchFormData.firstName = e.target.value}
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Last Name"
              name="lastName"
              onChange={(e) => searchFormData.lastName = e.target.value}
              variant="outlined"
            />
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="DOB"
              name="dob"
              onChange={(e) => searchFormData.dob = e.target.value}
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Aadhar Card No."
              name="aadharCardNo"
              onChange={(e) => searchFormData.aadharCardNo = e.target.value}
              variant="outlined"
            />

            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Age"
              name="age"
              onChange={(e) => searchFormData.age = e.target.value}
              variant="outlined"
            />
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Phone Number"
              name="mobile"
              onChange={(e) => searchFormData.mobile = e.target.value}
              variant="outlined"
            />
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  type="number"
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Visited"
                  name="visited"
                  onChange={(e) => searchFormData.visited = e.target.value}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Ago"
                  name="ago"
                  onChange={(e) => searchFormData.ago = e.target.value}
                  variant="outlined"
                >
                  <MenuItem value="Day">Day(s)</MenuItem>
                  <MenuItem value="Month">Month(s)</MenuItem>
                  <MenuItem value="Year">Year(s)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              select
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Gender"
              name="genderID"
              onChange={(e) => searchFormData.genderID = e.target.value}
              variant="outlined"
            >
              <MenuItem value="2">Female</MenuItem>
              <MenuItem value="1">Male</MenuItem>
              <MenuItem value="3">Other</MenuItem>
            </TextField>
            <Button
              sx={{ width: "85px", m: "10px" }}
              variant="contained"
              color="secondary"
              onClick={() => handleSearch(searchFormData)}
            >
              Search
            </Button>
            <Button
              sx={{ width: "85px", m: "10px" }}
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={clearData}
            >
              Clear
            </Button>
          </item>
        </Grid>
      </Grid>
    </FormControl>
  );
  const history = useNavigate("");
  const redirectToMypatient = () => {
    history('/medicationDispense'); // Redirect to MyPatient page
  };
  const handleCancelBtn = () => {
    //redirectToMypatient();
    setDrugTable("");
    setnewDispenseMedicinePage("");
    setShowSearchDialog(<FormControl fullWidth>
      <Grid xs={12} container>
        <Grid xs={3} item sx={{ p: 3, color: "red" }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="UHID"
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="First Name"
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
            />
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="DOB"
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Aadhar Card No."
              variant="outlined"
            />
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Age"
              variant="outlined"
            />
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              size="small"
              type="number"
              color="secondary"
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
            />
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  type="number"
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Visited"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Ago"
                  name="ago"
                  value={selectedDate}
                  onChange={handleDateChange}
                  variant="outlined"
                >
                  <MenuItem value="1">Day(s)</MenuItem>
                  <MenuItem value="2">Month(s)</MenuItem>
                  <MenuItem value="3">Year(s)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </item>
        </Grid>
        <Grid xs={3} item sx={{ p: 3 }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              select
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Gender"
              variant="outlined"
            >
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <Button
              sx={{ width: "85px", m: "10px" }}
              variant="contained"
              color="secondary"
              onClick={() => handleSearch(searchFormData)}
            >
              Search
            </Button>
            <Button
              sx={{ width: "85px", m: "10px" }}
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              Clear
            </Button>
          </item>
        </Grid>
      </Grid>
    </FormControl>);

  };
  const patientRowClick = (selectedPatient) => {
    setShowSearchDialog("");
    setPatientTable("");
    fetch(`http://10.197.8.17:2023/hmis/api/v1/prescription/drug/${selectedPatient.patientRID}/${selectedPatient.visitData[0].visitRID}`, {
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

        const tempData = data.map(drug => {
          const stockItem = drug.stockList.length > 0 ? drug.stockList[0] : null;
          return {
            "id": drug.drugID,
            "Medicine Name": drug.drugName,
            "No. of Days": drug.duration,
            "Batch No.": stockItem ? stockItem.stockBatch : 0,
            "Expiry": stockItem ? stockItem.stockExpiryDate : "",
            "Stock": stockItem ? stockItem.stockQty : 0,
            "Prescribed Qty.": drug.orderQty,
            "Pending Qty": drug.orderQty,
            "Issue Qty.": drug.orderQty,
            "Unit": stockItem ? stockItem.uomDesc : ""
          }
        });
        const dataToSave = data.map(drug => {
          const stockItem = drug.stockList.length > 0 ? drug.stockList[0] : null;
          return {
            "patientRID": selectedPatient.patientRID,
            "patMRN": selectedPatient.uhid,
            "visitRID": selectedPatient.visitData[0].visitRID,
            "skuRID": drug.drugID,
            "skuName": drug.drugName,
            "skuCode": stockItem ? stockItem.stockCode : 0,
            "prescriptionRID": drug.prRID,
            "pharOrderderRID": drug.pharOrderID,
            "uomIndex": stockItem ? stockItem.uomIndex : 0,
            "uomDesc": stockItem ? stockItem.uomDesc : "",
            "issueQTY": 0,
            "noOfDays": drug.duration,
            "batchNo": stockItem ? stockItem.stockBatch : 0,
            "expiryDate": stockItem ? stockItem.stockExpiryDate : ""
          }
        });
        setDrugTable(
          <Box
            m="0px 0 0 0"
            height="60vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[400],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary[400],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid
              rows={tempData}
              columns={drugTableColumns}
            // checkboxSelection
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mb: 1 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Print Prescription"
              />
              <Button
                sx={{ width: "100px", m: "5px" }}
                variant="contained"
                color="secondary"
                onClick={() => handleSave(dataToSave)}
              >
                Save
              </Button>
              <Button
                sx={{ width: "100px", m: "5px" }}
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleCancelBtn}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        );
      })
      .catch((error) => {
        console.error('Error in fetching prescription details for patient :', error);
      });

    setnewDispenseMedicinePage(
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <FormControl fullWidth>
          <Grid x={12} container>
            <Grid xs={12} item sx={{ p: 1 }}>
              <Typography>{selectedPatient.patientName}, &nbsp; {selectedPatient.visitData[0].visitAge} yrs, &nbsp; {selectedPatient.gender}, &nbsp; {selectedPatient.uhid}</Typography>
            </Grid>
            <Grid xs={12} item sx={{ p: 1 }}>
              <item>
                <TextField
                  sx={{ m: 1, maxWidth: '40%' }}
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Visit Date,Consulting Dr"
                  variant="outlined"
                  style={{ textAlign: 'center' }}
                  defaultValue={1}
                >
                  <MenuItem value="1"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >{selectedPatient.visitData[0].visitDate}, &nbsp;{selectedPatient.visitData[0].doctorName}
                  </MenuItem>
                </TextField>
              </item>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    );
  };
  const handleSave = (dataToSave) => {
    console.log(dataToSave);
    fetch(`http://10.197.8.17:2023/hmis/api/v1/prescription/drug/dispense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(dataToSave)
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
        localStorage.setItem("patientRID", data.patientRID);
        localStorage.setItem("visitRID", data.visitRID);
        localStorage.setItem("billRID", data.billRID);
        setResponseMessage(data.message);
        setMessageSeverty("success");
        setShowResponseAlert(true);
        setShowPrintSlip(true);
      })
      .catch((error) => {
        console.error('Error in Searching Patient for Medicine dispense:', error);
      });

  };

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Medication Dispense" />
        {showPrintSlip && <JasperReport title="Medication Dispense" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/prescription/drug/dispense/${localStorage.getItem("patientRID")}/${localStorage.getItem("visitRID")}/${localStorage.getItem("billRID")}/print`} />}
        {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
      </Box>
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        {showSearchDialog}
      </Box>
      {patientTable}
      {newDispenseMedicinePage}
      {drugTable}
    </Box>
  );
};

export default MEDICATIONDISPENSE;
