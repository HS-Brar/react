import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    useTheme,
    FormControl,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Select,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import Table from "../../../components/waitingTable";
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Emr from "../EMR";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';



const MYPATIENTS = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [patientRowData, setPatientRowData] = useState([]);
    const history = useNavigate();

    const redirectToEMRPage = (rowData) => {
        localStorage.setItem('rowData', JSON.stringify(rowData));
        history('/EMR'); // Redirect to EMR page
    };

    const handleRowClick = (rowData) => {

        redirectToEMRPage(rowData);
    };


    useEffect(() => {
        console.log("Fetching patient table Data....");
        fetch('http://10.197.8.17:2023/hmis/api/v1/opd/patient/waiting/PATIENTS_TO_CONSULT', {
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
                setPatientRowData(data);
                // <Table 
                //     data={{}}
                //     onRowClick={showEMR}
                //     >
                //     </Table>
            })
            .catch((error) => {
                console.error('Error fetching  patient table Data :', error);
            });
    }, []);


    return (
        <Box m="10px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title="My Patients"
                />
            </Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <FormControl fullWidth>
                    {/* <Grid container>
                        <Typography sx={{ padding: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            Search by:
                        </Typography>
                        <TextField
                            sx={{ m: 1, width: "13%" }}
                            select
                            size="small"
                            color="secondary"
                            id="outlined-basic"
                            variant="outlined"
                            defaultValue="1"
                        >
                            <MenuItem value="1">UHID</MenuItem>
                            <MenuItem value="2">Tocken No.</MenuItem>
                            <MenuItem value="3">Visit Type</MenuItem>
                            <MenuItem value="4">Patient Name</MenuItem>
                            <MenuItem value="5">Gender</MenuItem>
                            <MenuItem value="6">Age</MenuItem>
                            <MenuItem value="7">Phone No.</MenuItem>
                            <MenuItem value="8">Visit Reason</MenuItem>
                        </TextField>
                        <TextField
                            sx={{ m: 1, width: "15%" }}
                            size="small"
                            color="secondary"
                            id="outlined-basic"
                            variant="outlined"
                        />
                        <Tooltip title="Close consultation">
                            <IconButton >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid> */}
                    <Box
                        m="5px 0 0 0"
                        height="80vh"
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

                        <Table
                            data={patientRowData}
                            onRowClick={handleRowClick}
                        />
                        {/* {emrScreen} */}
                    </Box>

                </FormControl>
            </Box>
        </Box>
    );
};

export default MYPATIENTS;
