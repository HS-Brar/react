import React, { useState } from "react";
import {
  Box,
  Button,
  useTheme,
  FormControl,
  TextField,
  Grid,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Person2 } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import {
  mockPatientSearchData,
  mockSelectBillTable,
  mockIssuedItemsTable
} from "../../../data/demoData";
import Stack from "@mui/material/Stack";
import Popup from "../../../components/Popup";

const MEDICATIONRETURN = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedDate, setSelectedDate] = useState("");
  const [patientSearchTableData, setPatientSearchTableData] = useState("");
  const [issuedItemsTable, setIssuedItemsTable] = useState("");
  const [tableHeight, setTableHeight] = useState("40vh");
  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const [openBillPopup, setOpenBillPopup] = useState(false);
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
  //Column Defination for IssuedItems table
  const issuedItemsColumns = [
    { field: "id", headerName: "Item Name",flex:2, align: "left"},
    {
      field: "consumption no.",
      headerName: "Consumption No.",
      flex: 1,
      cellClassName: "name-column--cell",
      align: "left"
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
      align: "left"
    },
    {
      field: "expiry",
      headerName: "Expiry",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "issuedUOM",
      headerName: "Issued UOM",
      flex: 1,
      align: "left"
    },
    {
      field: "returnable",
      headerName: "Returnable",
      type: "number",
      headerAlign: "left",
      flex: 1.25,
      align: "left"
    },
    {
      field: "returned",
      headerName: "Returned",
      flex: 1,
      align: "left",
      editable: true,
    }];
//Column Defination for Bill Select table
  const billSelectColumns = [
    { field: "id", headerName: "Bill No.", flex: 2 },
    {
      field: "billDate",
      headerName: "Bill Date",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "visitType",
      headerName: "Visit Type",
      flex: 1,
    },
  ];
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
            onClick={()=>{setOpenSearchPopup(false);setOpenBillPopup(true);}}
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
  const handleIssuedItemsTable = () =>{
    setOpenBillPopup(false);
    setIssuedItemsTable(
      <Box
      m="30px 0 0 0"
      height={tableHeight}
      sx={{
        border: "1px solid lightgray",
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
      <DataGrid rows={mockIssuedItemsTable} columns={issuedItemsColumns} checkboxSelection />
      {/* <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <FormControlLabel
              control={<Checkbox />}
              label="Print on Save"
            />
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="contained"
          color="secondary"
          onClick={()=> {alert("Confirmed");}}
        >
          Confirm
        </Button>
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setIssuedItemsTable("")}
        >
          Cancel
        </Button>
      </Stack> */}
    </Box>
    );
  };
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleBillSelectTable = () => {
    // Calculating height based on the number of rows
    const rowHeight = 52;
    const headerHeight = 56;
    const minHeight = 200;

    const calculatedHeight = Math.min(
      minHeight,
      headerHeight + rowHeight * mockSelectBillTable.length
    );

    setTableHeight(`${calculatedHeight}px`);
  };
  const [billSelectDialog, setBillSelectDialog] = useState(
    <Box
      m="10px 0 30px 0"
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
      <DataGrid rows={mockSelectBillTable} columns={billSelectColumns} checkboxSelection/>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="contained"
          color="secondary"
          onClick={handleIssuedItemsTable}
        >
          Add
        </Button>
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenBillPopup(false)}
        >
          Close
        </Button>
      </Stack>
    </Box>
  );
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

          <TextField
            sx={{ m: 1 }}
            fullWidth
            size="small"
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
            required
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
          <FormControlLabel
            control={<Checkbox />}
            label="Search across locations"
          />
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
          title="Medication Return"
          subtitle={new Date().toLocaleDateString()}
        />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            mb: "10px",
          }}
        >
          <Person2 sx={{ mr: "10px" }} />
          Last
        </Button>
      </Box>
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <FormControl fullWidth>
          <Grid xs={12} container>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item>
                <TextField
                  sx={{ m: 1 }}
                  fullWidth
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Bill No."
                  variant="outlined"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Show All Items For Bill"
                />
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3, color: "red" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    sx={{ m: 1 }}
                    fullWidth
                    size="small"
                    color="secondary"
                    id="outlined-basic"
                    label="UHID"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ m: "9px" }}
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenSearchPopup(true)}
                  >
                    ...
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}></Grid>
            <Grid xs={3} item sx={{ pl:7.25,pt:3.75}}>
              <item>
                <Button
                  sx={{ m: "3px" }}
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenBillPopup(true)}
                >
                  View
                </Button>
                <Button sx={{ m: "3px" }} variant="contained" color="secondary">
                  Clear
                </Button>
              </item>
            </Grid>
          </Grid>
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
      <Popup
        title="Select Bill for MRN : "
        openPopup={openBillPopup}
        setOpenPopup={setOpenBillPopup}
        popupWidth={"md"}
      >
        {billSelectDialog}
      </Popup>
      {issuedItemsTable}
      <Stack direction="row" spacing={1} sx={{ mt: "10px",mb: "20px", justifyContent: "flex-end" }}>
      <FormControlLabel
              control={<Checkbox />}
              label="Print on Save"
            />
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="contained"
          color="secondary"
          onClick={()=> {alert("Confirmed");}}
        >
          Confirm
        </Button>
        <Button
          sx={{ width: "100px", m: "5px" }}
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setIssuedItemsTable("")}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default MEDICATIONRETURN;
