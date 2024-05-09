import React, { useState, useEffect } from 'react';
import {
    Paper,
    Divider,
    Box,
    Button,
    useTheme,
    FormControl,
    TextField,
    Grid,
    MenuItem,
    Typography,
    FormControlLabel,
    Checkbox,
    InputLabel,
    Select,
    TableContainer,
    Card,
    Tabs,
    Tab,
    TableRow,
    TableCell,
} from "@mui/material";
import { tokens } from "../../../theme";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SearchComponent from "../../../components/IncrementalSearch";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from "@mui/x-data-grid";
import ResponseAlert from '../../../components/Alert';
import JasperReport from "../../../components/JasperReport"

const ISSUES = (props) => {
    const { bed } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const [responseMessage, setResponseMessage] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showPrintSlip, setShowPrintSlip] = useState(false);

    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionRows, setPrescriptionRows] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [saveForm, setSaveForm] = useState([]);
    const prescriptionTableColumns = [
        {
            field: 'skuCode',
            headerName: 'Code',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'skuName',
            headerName: 'Item Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: '',
            headerName: 'Batch',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <TextField
                    select
                    fullWidth
                    size='small'
                    color="secondary"
                    id="outlined-basic"
                    label="Batch"
                    variant="outlined"
                    //value={params.row.batch}
                    onChange={(e) => {
                        console.log(params.row);
                        const selectedBatch = params.row.batchList.find(batch => batch.stkBatchNo == e.target.value);
                        setSaveForm(prevState => ({
                            ...prevState,
                            batchNo: e.target.value,
                            expiryDate: selectedBatch.stkExpiryDate,
                            stock: selectedBatch.stkdQty,
                            uomIndex: selectedBatch.uomIndex,
                            uomDesc: selectedBatch.uomDesc,

                        }));
                        // // Update batch value in the row
                        // const updatedRow = { ...params.row, batch: e.target.value };
                        // const updatedRows = prescriptionRows.map(row =>
                        //     row.skuRid === params.row.skuRid ? updatedRow : row
                        // );
                        // setPrescriptionRows(updatedRows);
                    }}
                >
                    {
                        params.row.batchList.map((batch) => (
                            <MenuItem key={batch.stkRid} value={batch.stkBatchNo}>
                                {batch.stkBatchNo}
                            </MenuItem>
                        ))
                    }
                </TextField >
            ),
        },
        {
            field: 'expiry',
            headerName: 'Expiry',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Typography>{saveForm.expiryDate}</Typography>
            ),
        },
        {
            field: 'stock',
            headerName: 'Stock',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Typography>{saveForm.stock}</Typography>
            ),
        },
        {
            field: 'issue',
            headerName: 'Issue Qty.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <TextField
                    fullWidth
                    size='small'
                    color="secondary"
                    id="outlined-basic"
                    variant="outlined"
                    //value={params.row.batch}
                    onChange={(e) => {
                        //console.log(params.row);
                        //const selectedBatch = params.row.batchList.find(batch => batch.stkBatchNo == e.target.value);
                        setSaveForm(prevState => ({
                            ...prevState,
                            issueQTY: e.target.value,
                        }));
                    }}
                >
                </TextField >
            ),
        },
        {
            field: 'route',
            headerName: 'Route',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Typography>{saveForm.uomDesc}</Typography>
            ),
        },
        {
            field: 'deleteButton',
            headerName: 'Delete',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteRow(params.row.skuRid)}
                >
                    Delete
                </Button>
            ),
        }
    ];

    useEffect(() => {
        setSaveForm(prevState => ({
            ...prevState,
            "patientRID": bed.patRID,
            "patMRN": bed.patientMRN,
            "visitRID": bed.visitRID,
            "noOfDays": 1,
            "prescriptionRID": 1,
            "pharOrderderRID": 1,
        }));
    }, []);
    const handlePrescriptionChange = (event, value) => {
        if (value.length % 3 === 0) {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/issues/${value}`, {
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
                            // setResponseMessage(errorData.message + `!(${Date.now()})`);
                            // setMessageSeverty("error");
                            // setShowResponseAlert(true);
                            throw new Error(errorMessage);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    //console.log(data);
                    setPrescriptionList(data);
                    // setPrescriptionList([
                    //     {
                    //         "skuCode": "2.1.18.1",
                    //         "skuRid": 17291,
                    //         "skuName": "PARACETAMOL TABLET 500 mg",
                    //         "skuDdBaseUomIndex": 121316,
                    //         "skuDdBaseUomDesc": "Tablet",
                    //         "skuGroupRid": 25972,
                    //         "skuDdSaleUomIndex": 121316,
                    //         "skuDdSaleUomDesc": "Tablet",
                    //         "skuDdPurUomIndex": 121316,
                    //         "skuDdPurUomDesc": "Tablet",
                    //         "skuCategory": 1,
                    //         "skuDdTypeIndex": 11501,
                    //         "skuPurchaseVatPerc": 0,
                    //         "skuSaleVatPerc": 0,
                    //         "drgDdRouteIndex": 21684,
                    //         "manufacture": "",
                    //         "genericName": "PARACETAMOL",
                    //         "stockQty": 988
                    //     },
                    //     {
                    //         "skuCode": "2.1.18.2",
                    //         "skuRid": 17292,
                    //         "skuName": "PARA HBBBB 500 mg",
                    //         "skuDdBaseUomIndex": 121315,
                    //         "skuDdBaseUomDesc": "Tablet",
                    //         "skuGroupRid": 25973,
                    //         "skuDdSaleUomIndex": 121317,
                    //         "skuDdSaleUomDesc": "Tablet",
                    //         "skuDdPurUomIndex": 121317,
                    //         "skuDdPurUomDesc": "Tablet",
                    //         "skuCategory": 1,
                    //         "skuDdTypeIndex": 11501,
                    //         "skuPurchaseVatPerc": 0,
                    //         "skuSaleVatPerc": 0,
                    //         "drgDdRouteIndex": 21684,
                    //         "manufacture": "",
                    //         "genericName": "PARAHBB",
                    //         "stockQty": 888
                    //     }
                    // ]);
                })
                .catch((error) => {
                    console.error(`Error fetching Prescription List for ${value}:`, error);
                });
        }
    };
    const handleDeleteRow = (skuRid) => {
        const updatedRows = prescriptionRows.filter(row => row.skuRid !== skuRid);
        setPrescriptionRows(updatedRows);
        setSaveForm(updatedRows);
    };
    const handleSave = () => {
        console.log(saveForm);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/issues/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify([saveForm])
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
                console.log(data);
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
                //setShowPrintSlip(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Issues/Prescriptions: ', error);
            });

    };

    return (
        <Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
            >{
                    //showPrintSlip && <JasperReport title="" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/ipd/printDeathForm/${bed.patRID}/${bed.visitRID}`} />
                }
                {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
                <FormControl fullWidth >
                    <Grid x={12} container >
                        <Grid xs={12} item p={1}>
                            <Autocomplete
                                options={prescriptionList}
                                getOptionLabel={(option) => option.skuName}
                                sx={{ width: '100%' }}
                                fullWidth
                                size="small"
                                //inputValue={formData.admittingDiagnosis}
                                onInputChange={(event, value) => {
                                    if (value != '') {
                                        handlePrescriptionChange(event, value)
                                    }
                                }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        if (!prescriptionRows.some(prescription => prescription.skuRid === newValue.skuRid)) {
                                            // Fetching  batch numbers for the newly added prescription
                                            fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/issues/batchNos?skuRid=${newValue.skuRid}&location=115&isFromNursingConsole=1`, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwtToken}`
                                                }
                                            })
                                                .then((response) => {
                                                    if (!response.ok) {
                                                        throw new Error('Network response was not ok');
                                                    }
                                                    return response.json();
                                                })
                                                .then((data) => {
                                                    console.log(data);
                                                    // Update batch list state only if the prescription matches the selected one
                                                    //if (selectedPrescription === currentSelectedPrescription) {
                                                    //}
                                                    const updatedNewValue = { ...newValue, batchList: data };
                                                    setPrescriptionRows(prevRows => [...prevRows, updatedNewValue]);

                                                    setSaveForm(prevState => ({
                                                        ...prevState,
                                                        skuRID: newValue.skuRid,
                                                        skuName: newValue.skuName,
                                                        skuCode: newValue.skuCode,

                                                    }));
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching batch list:', error);
                                                });
                                        } else {
                                            console.log("duplicate");
                                        }
                                    }
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        color="secondary"
                                        id="outlined-basic"
                                        label="Select An Item or Drug And Press ENTER"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center"
                            //paddingTop={1}
                            //m="5px"
                            height="40vh"
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
                                    rows={prescriptionRows}
                                    columns={prescriptionTableColumns}
                                    getRowId={(row) => row.skuRid}
                                    disableSelectionOnClick
                                //onRowClick={(params) => { handleLaboratoryService(params) }}
                                />
                            </div>
                        </Box>
                        <Grid container style={{ justifyContent: 'flex-end' }} >
                            <Button
                                sx={{ m: 1 }}
                                onClick={() => {
                                    handleSave();
                                }}
                            >
                                <DoneIcon color="primary" fontSize="large" />
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                            //onClick={handleSave}
                            >
                                <ClearIcon color="primary" fontSize="large" />
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Box>
    );
};

export default ISSUES;