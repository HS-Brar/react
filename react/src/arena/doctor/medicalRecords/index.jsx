import React, { useState } from "react";
import {
  Box,
  Button,
  useTheme,
  FormControl,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { mockPatientSearchData } from "../../../data/demoData";
import Stack from "@mui/material/Stack";
import Popup from "../../../components/Popup";

const MEDICALRECORDS = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [patientSearchTableData, setPatientSearchTableData] = useState("");
  const [openSearchPopup, setOpenSearchPopup] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [tableHeight, setTableHeight] = useState("40vh");
 

   //Column Defination for PatientSearch table
   const patientSearchColumns = [
    { field: "id", headerName: "UHID" },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "dob",
      headerName: "DOB",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0.5,
    },
    {
      field: "district",
      headerName: "District",
      flex: 0.5,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    }];
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };
    const handlePatientSearchTable = () => {
      setPatientSearchTableData(
        <Box
          m="0 0 0 0"
          height={tableHeight}
          sx={{
            width: "100%",
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
          <DataGrid rows={mockPatientSearchData} columns={patientSearchColumns} />
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button
              sx={{ width: "100px", m: "5px" }}
              variant="contained"
              color="secondary"
              onClick={()=>{setOpenSearchPopup(false);}}
            >
              OK
            </Button>
            <Button
              sx={{ width: "100px", m: "5px" }}
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setPatientSearchTableData("")}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      );
    };
    const [patientSearchDialog, setPatientSearchDialog] = useState(
      <Grid xs={12} container>
        <Grid xs={3} item sx={{ p: 3, color: "red" }}>
          <item>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
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
              color="secondary"
              id="outlined-basic"
              label="Aadhar Card No."
              variant="outlined"
            />
             <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Age"
              variant="outlined"
            />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  value={selectedDate}
                  onChange={handleDateChange}
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
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Visited"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Ago"
                  value={selectedDate}
                  onChange={handleDateChange}
                  variant="outlined"
                >
                  <MenuItem value="Day">Day(s)</MenuItem>
                  <MenuItem value="Month">Month(s)</MenuItem>
                  <MenuItem value="Year">Year(s)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              sx={{ m: 1 }}
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Scheme ID no."
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
              label="PPP ID"
              variant="outlined"
            />
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
              onClick={handlePatientSearchTable}
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
    );
    
  return (
    <Box m="10px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header
        title="Medical Records"
      />
    </Box>
    <Box
      gridColumn="span 8"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
    >
      <FormControl fullWidth>
        
      </FormControl>
    </Box>
    <Popup
      title="Search Patient"
      openPopup={openSearchPopup}
      setOpenPopup={setOpenSearchPopup}
      popupWidth={"xl"}
    >
      {patientSearchDialog}
      {patientSearchTableData}
    </Popup>
  </Box>
  );
};

export default MEDICALRECORDS;
