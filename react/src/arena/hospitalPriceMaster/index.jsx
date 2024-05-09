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
    Radio,
    RadioGroup,
    Paper,
    Table,
    TableHead,
    TableBody,
    Autocomplete
} from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import SearchIcon from '@mui/icons-material/Search';

const HOSPITALPRICEMASTER = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const [selectedButton, setSelectedButton] = useState('');
    const [serviceGroup, setServiceGroup] = useState([]);
    const [serviceSubGroup, setServiceSubGroup] = useState({});
    const [serviceNameList, setServiceNameList] = useState([]);
    const [searchForm, setSearchForm] = useState({
        "grpRID": 0,
        "serviceRID": 0,
        "addedCompanies": "",
        "contextRID": 0,
        "serviceType": "",
        "chargeType": "",
        "chargeCode": "",
        "chargeName": "",
        "patCategoryIndex": 0,
        "patCategoryName": "",
        "visitTypeIndex": 0,
        "patMLCCategory": 0,
        "patMLCCategoryName": "",
        "isForEmergencyVisit": 0,
        "resident_value": 0,
        "bedTypeName": "",
        "serviceSubGroupRID": 0,
        "wardLabel": 0,
        "effectiveDate": "2024-01-01",
        "itemRID": 0,
        "chargeRID": 0,
        "patMLCCategoryRID": 0
    }
    );
    const [saveForm, setSaveForm] = useState([
        {
            "chargeRID": 0,
            "pmContextRid": 0,
            "effectiveDate": "",
            "pmIncidentType": 0,
            "pmSubContextRid": 0,
            "pmSubContextType": null,
            "resident_value": 0,
            "serviceName": "",
            "visitType": "",
            "wardType": "",
            "isResident": "",
            "costPrice": 0,
            "effectiveFrom": null,
            "patientCatrgory": [
                {
                    "name": "",
                    "pmChargeRid": 0,
                    "pmMlcCatRid": 0,
                    "price": 0,
                    "discAmt": 0,
                    "discPerc": 0
                },
            ],
            "mlcCategory": [
                {
                    "name": "",
                    "pmChargeRid": 0,
                    "pmMlcCatRid": 0,
                    "price": 0,
                    "discAmt": 0,
                    "discPerc": 0
                },
            ],
            "schemeCategory": [
                {
                    "name": "",
                    "pmChargeRid": 0,
                    "pmMlcCatRid": 0,
                    "price": 0,
                    "discAmt": 0,
                    "discPerc": 0
                },
            ],
            "patCatIDList": [],
            "patCatNames": [],
            "mlcCatIDList": [],
            "mlcCatNames": [],
            "schemeCatIDList": [],
            "schemeCatNames": []
        }]);

    useEffect(() => {
        fetch('http://10.197.8.17:2023/hmis/api/v1/price/loadServiceGroup', {
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
                setServiceGroup(data);
            })
            .catch((error) => {
                console.error('Error fetching Service Group List:', error);
            });
        setSearchForm((prevFormData) => ({
            ...prevFormData,
            visitTypeIndex: 19602,
            resident_value: 1,
        }));
    }, []);
    const serviceTableColumns = [
        {
            field: 'serviceName',
            headerName: 'Service',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'visitType',
            headerName: 'Visit Type',
            //flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'wardType',
            headerName: 'Ward Type',
            // flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'isResident',
            headerName: 'Resident',
            //flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'costPrice',
            headerName: 'Cost Price',
            // flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
            renderCell: (params) => (
                <TextField
                    value={params.value}
                    onChange={(e) => params.api.setCellEditCommit(params.id, params.field, e.target.value)}
                />
            ),
        },
        {
            field: 'patCategory',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <Button
                    // startIcon={<AddIcon />}
                    onClick={() => handleButtonClick('patientCategory')}
                    color="secondary"
                    variant="contained"
                >
                    Patient Category
                </Button>
            ),
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'mlcCategory',
            headerName: '',
            width: 130,
            renderCell: (params) => (
                <Button
                    //startIcon={<AddIcon />}
                    onClick={() => handleButtonClick('mlcCategory')}
                    color="secondary"
                    variant="contained"
                >
                    MLC Category
                </Button>
            ),
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'schemeCategory',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <Button
                    // startIcon={<AddIcon />}
                    onClick={() => handleButtonClick('schemeCategory')}
                    color="secondary"
                    variant="contained"
                >
                    Scheme Category
                </Button>
            ),
            headerAlign: "center",
            align: "center",
        },
    ];
    const patCategoryTableColumns = [
        {
            field: 'name',
            headerName: '',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'discPerc',
            headerName: 'Disc%',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'discAmt',
            headerName: 'Disc Amt',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Amount',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        }
    ];
    const mlcCategoryTableColumns = [
        {
            field: 'name',
            headerName: '',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'discPerc',
            headerName: 'Disc%',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'discAmt',
            headerName: 'Disc Amt',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Amount',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        }
    ];
    const schemeCategoryTableColumns = [
        {
            field: 'name',
            headerName: '',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'discPerc',
            headerName: 'Disc%',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'discAmt',
            headerName: 'Disc Amt',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Amount',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        }
    ];
    const handleCellEditCommit = (params) => {
        const { id, field, value } = params;
        const updatedData = saveForm.map((row) => {
            if (row.chargeRID === id) {
                return { ...row, [field]: parseFloat(value) };
            }
            return row;
        });
        const updatedPatientCategoryTable = updatedData[0].patientCatrgory.map(obj => {
            obj.discAmt = (obj.discPerc / 100) * parseFloat(value);
            obj.price = parseFloat(value) - obj.discAmt;
            return obj;
        });
        const updatedMlcCategoryTable = updatedData[0]["mlcCategory"].map(obj => {
            obj.discAmt = (obj.discPerc / 100) * parseFloat(value);
            obj.price = parseFloat(value) - obj.discAmt;
            return obj;
        });
        const updatedSchemeCategoryTable = updatedData[0]["schemeCategory"].map(obj => {
            obj.discAmt = (obj.discPerc / 100) * parseFloat(value);
            obj.price = parseFloat(value) - obj.discAmt;
            return obj;
        });
        updatedData[0]["patientCatrgory"] = updatedPatientCategoryTable;
        updatedData[0]["mlcCategory"] = updatedMlcCategoryTable;
        updatedData[0]["schemeCategory"] = updatedSchemeCategoryTable;
        setSaveForm(updatedData);
    };
    const handleTableCellEditCommit = (params, tableType) => {
        const { id, field, value } = params;
        const updatedData = [...saveForm];
        const editedRow = params.row;
        editedRow[field] = parseFloat(value);

        if (field === 'discAmt' && parseFloat(value) <= updatedData[0].costPrice) {
            editedRow.discPerc = (parseFloat(value) / updatedData[0].costPrice) * 100;
            editedRow.price = updatedData[0].costPrice - parseFloat(value);
        }
        if (field === 'discPerc' && parseFloat(value) <= 100) {
            editedRow.discAmt = (parseFloat(value) / 100) * updatedData[0].costPrice;
            editedRow.price = updatedData[0].costPrice - editedRow.discAmt;
        }
        const updatedTable = updatedData[0][tableType].map(obj => {
            if (obj.pmMlcCatRid === editedRow.pmMlcCatRid) {
                return editedRow;
            } else {
                return obj;
            }
        });
        updatedData[0][tableType] = updatedTable;
        setSaveForm(updatedData);
    };

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };
    const serviceNameChange = (event, value) => {
        setSearchForm(prevFormData => ({
            ...prevFormData,
            chargeName: value,
        }));
        if (value.length % 3 === 0) {
            const serviceNameJSON = {
                "patientGenderID": 1,
                "searchString": value,
                "patientCategoryID": 1,
                "unitRID": 146
            };
            fetch(`http://10.197.8.17:2023/hmis/api/v1/bill/serviceList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(serviceNameJSON),
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
                    const filteredResults = data.filter((service) =>
                        service.serviceName.toLowerCase().startsWith(value.toLowerCase())
                    );
                    setServiceNameList(filteredResults);
                })
                .catch((error) => {
                    console.error(`Error fetching Service Name List for ${value}:`, error);
                });
        }
    };
    const handleSearch = () => {
        const queryParams = new URLSearchParams(searchForm);
        const url = `http://10.197.8.17:2023/hmis/api/v1/price/showPriceForAService?${queryParams}`;

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
                console.log([data]);
                setSaveForm([data]);
            })
            .catch((error) => {
                console.error('Error fetching Service Details:', error);
            });
    };
    const handleSave = () => {
        console.log(saveForm[0]);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/price/saveServicePrice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(saveForm[0])
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
                console.log("Hospital Pricing Master Save Successful!!!", data);
            })
            .catch((error) => {
                console.error('Error in Hospital Pricing Master Save:', error);
            });
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Hospital Pricing Master" />
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
                        }}>
                        View Criteria
                    </Divider>
                    <Grid container alignItems="center" sx={{ p: 1 }}>
                        <Typography>Visit Type : &nbsp;&nbsp;&nbsp;</Typography>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group"
                            name="radio-buttons-group1"
                            value={searchForm.visitTypeIndex} // Add value prop here
                            onChange={(e) => setSearchForm({ ...searchForm, visitTypeIndex: e.target.value })}
                        >
                            <Grid container alignItems="center" sx={{ p: 1 }}>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Radio size="small" />}
                                        value={parseInt(19602)}
                                        label="OP"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Radio size="small" />}
                                        value={parseInt(19601)}
                                        label="IP"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Radio size="small" />}
                                        value={parseInt(19603)}
                                        label="Emergency"
                                    />
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>
                        Service
                    </Divider>
                    <Grid container justifyContent="center" sx={{}}>
                        <Grid xs={5} item sx={{ marginRight: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="grpRID"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Service Group"
                                variant="outlined"
                                //value={searchForm.grpRID || ""}
                                onChange={(e) => {
                                    setSearchForm(() => ({
                                        ...searchForm,
                                        [e.target.name]: parseInt(e.target.value)
                                    }));
                                }}
                            >
                                {serviceGroup &&
                                    serviceGroup.map((option) => (
                                        <MenuItem key={option.grp_rid} value={option.grp_rid}>
                                            {option.grpName}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={5} item sx={{ marginLeft: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="serviceSubGroupRID"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Sub Group"
                                variant="outlined"
                                value={searchForm.serviceSubGroupRID || ""}
                            />
                        </Grid>
                        <Grid xs={5} item sx={{ marginRight: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="serviceCode"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Service Code"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid xs={5} item sx={{ marginLeft: 1 }}>
                            <Autocomplete
                                options={serviceNameList}
                                getOptionLabel={(option) => option.serviceName}
                                sx={{ m: 1, width: '100%' }}
                                fullWidth
                                size="small"
                                //inputValue={searchForm.chargeName}
                                onInputChange={(event, value) => {
                                    if (value != '') {
                                        serviceNameChange(event, value)
                                    }
                                }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setSearchForm(prevFormData => ({
                                            ...prevFormData,
                                            chargeName: newValue.serviceName,
                                            serviceRID: newValue.serviceRID,
                                            chargeRID: newValue.serviceRID,
                                        }));
                                    } else {
                                        setSearchForm(prevFormData => ({
                                            ...prevFormData,
                                            chargeName: "",
                                            serviceRID: 0,
                                            chargeRID: 0,
                                        }));
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        color="secondary"
                                        id="outlined-basic"
                                        label="Service Name"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={5} item sx={{}}>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group"
                                name="radio-buttons-group1"
                                value={searchForm.resident_value === 1 ? "Haryana Resident" : "Non Haryana Resident"} // Set the value based on searchForm.resident_value
                                onChange={(event) => {
                                    const newValue = event.target.value === "Haryana Resident" ? 1 : 0;
                                    setSearchForm(prevState => ({
                                        ...prevState,
                                        resident_value: newValue
                                    }));
                                }}
                            >
                                <Grid container alignItems="center" sx={{ p: 1 }}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Haryana Resident"
                                            label="Haryana Resident"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Non Haryana Resident"
                                            label="Non Haryana Resident"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button>
                                            <SearchIcon sx={{ fontSize: 40 }} onClick={() => handleSearch()} />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center"
                            m="5px"
                            height="25vh"
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
                                    rows={saveForm}
                                    columns={serviceTableColumns}
                                    getRowId={(row) => row.chargeRID}
                                    disableSelectionOnClick
                                    //onCellEditCommit={handleCellEditCommit}
                                    onCellEditCommit={(params) => handleCellEditCommit(params)}
                                />
                            </div>
                        </Box>
                        {selectedButton != '' && (
                            <Box width="100%" display="flex" justifyContent="center"
                                m="5px"
                                height="70vh"
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
                                {selectedButton === 'patientCategory' && (
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={saveForm[0].patientCatrgory}
                                            columns={patCategoryTableColumns}
                                            getRowId={(row) => row.pmMlcCatRid}
                                            disableSelectionOnClick
                                            onCellEditCommit={(params) => handleTableCellEditCommit(params, 'patientCatrgory')}
                                        />
                                    </div>)}
                                {selectedButton === 'mlcCategory' && (
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={saveForm[0].mlcCategory}
                                            columns={mlcCategoryTableColumns}
                                            getRowId={(row) => row.pmMlcCatRid}
                                            disableSelectionOnClick
                                            onCellEditCommit={(params) => handleTableCellEditCommit(params, 'mlcCategory')}
                                        />
                                    </div>)}
                                {selectedButton === 'schemeCategory' && (
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={saveForm[0].schemeCategory}
                                            columns={schemeCategoryTableColumns}
                                            getRowId={(row) => row.pmMlcCatRid}
                                            disableSelectionOnClick
                                            onCellEditCommit={(params) => handleTableCellEditCommit(params, 'schemeCategory')}
                                        />
                                    </div>)}
                            </Box>
                        )}
                    </Grid>
                    <Grid container style={{ justifyContent: 'flex-end' }}>
                        <Grid item sx={{ p: 1 }}>
                            <Button
                                sx={{ width: 100 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleSave() }}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Box >
    );
};

export default HOSPITALPRICEMASTER;
