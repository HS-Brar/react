import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Input,
    TextField,
    Typography,
    Divider,
    useTheme,
    FormControlLabel,
    Checkbox,
    MenuItem,
    InputLabel,
    TableCell,
    TableRow,
    Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";

import { useHistory, useNavigate } from "react-router-dom";
import MANAGESTAFF from "./manageStaff";

const STAFFMASTER = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const history = useNavigate();

    // const [selectedRow, setSelectedRow] = useState(null);
    const [masterData, setMasterData] = useState({
        "specialityList": [],
        "categoryList": [],
        "unitList": []
    });
    const [searchForm, setSearchForm] = useState({
        "staffName": "",
        "staffRole": 0,
        "staffCode": "",
        "loginName": "",
        "specialityNm": "",
        "categoryNm": "",
        "unitName": "",
        "showActiveStaff": 0
    });
    const [staffTableRows, setStaffTableRows] = useState([]);
    const staffTableColumns = [
        {
            field: 'staffCode',
            headerName: 'Code',
            flex: 0.75,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'staffTitle',
            headerName: 'Title',
            flex: 0.5,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'staffName',
            headerName: 'Name',
            flex: 1.5,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'patMrn',
            headerName: 'UHID',
            flex: 0.5,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'userId',
            headerName: 'Login ID',
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'unitName',
            headerName: 'Primary Unit',
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'specialityDesc',
            headerName: 'Speciality',
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'wcDesc',
            headerName: 'Category',
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'staffAssignedRoles',
            headerName: 'Roles',
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'staffValid',
            headerName: 'Active',
            flex: 0.5,
            headerAlign: "left",
            align: "left",
        },
    ];
    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/getSpecialities`, {
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
                setMasterData((prevForm) => ({
                    ...prevForm,
                    specialityList: data
                }));
            })
            .catch((error) => {
                console.error('Error fetching Speciality List Data:', error);
            });
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/getCategories`, {
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
                setMasterData((prevForm) => ({
                    ...prevForm,
                    categoryList: data
                }));
            })
            .catch((error) => {
                console.error('Error fetching Category List:', error);
            });
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/getUnits`, {
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
                setMasterData((prevForm) => ({
                    ...prevForm,
                    unitList: data
                }));
            })
            .catch((error) => {
                console.error('Error fetching Unit List:', error);
            });
    }, []);
    const redirectToManageStaffPage = () => {
        history('/manageStaff');
    };
    const redirectToAddStaffPage = () => {
        history('/addStaff');
    };



    const handleSearch = () => {
        const queryParams = new URLSearchParams(searchForm);
        const url = `http://10.197.8.17:2023/hmis/api/v1/staff/searchStaff?${queryParams}`;
        fetch(url, {
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
                setStaffTableRows(data);
            })
            .catch((error) => {
                console.error('Error Searching Staff List details:', error);
            });
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Staff Master" />
                <Box justifyContent="space-between" alignItems="center">
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px,20px",
                        }}
                        onClick={() => {
                            redirectToAddStaffPage();
                            localStorage.removeItem("selectedRow");
                        }
                        }
                    >Add New Staff
                    </Button>
                </Box>
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >

                <FormControl fullWidth >
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>Staff Browser
                    </Divider>
                    <Grid x={12} container >
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        staffName: e.target.value
                                    }));
                                }}
                                value={searchForm.staffName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffRole"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Role"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        staffRole: e.target.value
                                    }));
                                }}
                                value={searchForm.staffRole || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffCode"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Code"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        staffCode: e.target.value
                                    }));
                                }}
                                value={searchForm.staffCode || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="loginName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Login ID"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        loginName: e.target.value
                                    }));
                                }}
                                value={searchForm.loginName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="specialityNm"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Speciality"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        specialityNm: e.target.value
                                    }));
                                }}
                                value={searchForm.specialityNm || ""}
                            >
                                {masterData.specialityList &&
                                    masterData.specialityList.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddValue}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="categoryNm"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Category"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        categoryNm: e.target.value
                                    }));
                                }}
                                value={searchForm.categoryNm || ""}
                            >
                                {masterData.categoryList &&
                                    masterData.categoryList.map((option) => (
                                        <MenuItem key={option.category_id} value={option.category_name}>
                                            {option.category_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="unitName"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Unit"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm((prevForm) => ({
                                        ...prevForm,
                                        unitName: e.target.value
                                    }));
                                }}
                                value={searchForm.unitName || ""}
                            >
                                {masterData.unitList &&
                                    masterData.unitList.map((option) => (
                                        <MenuItem key={option.unitRid} value={option.unitName}>
                                            {option.unitName}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 2, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Show active staff only"
                            />
                        </Grid>
                        <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                            <Grid item>
                                <Button
                                    sx={{ width: 100 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { handleSearch() }}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    sx={{ width: 100 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { }}
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center"
                            paddingTop={1}
                            m="5px"
                            height="47vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "2px solid #ccc",
                                },
                                "& .name-column--cell": {
                                    color: colors.greenAccent[400],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: colors.blueAccent[700],
                                    borderBottom: "2px solid #ccc",
                                    fontSize: "1.1rem",
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
                            <div style={{ width: '100%' }}>
                                <DataGrid
                                    rows={staffTableRows}
                                    columns={staffTableColumns}
                                    getRowId={(row) => row.staffCode}
                                    disableSelectionOnClick
                                    onRowClick={(params) => {
                                        localStorage.setItem("staffRid", JSON.stringify(params.row.staffRid));
                                        redirectToManageStaffPage();
                                    }}
                                />
                            </div>
                        </Box>
                    </Grid>
                </FormControl>
            </Box>
        </Box >
    );
};

export default STAFFMASTER;
