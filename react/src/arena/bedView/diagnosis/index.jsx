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
import StarBorderPurple500SharpIcon from '@mui/icons-material/StarBorderPurple500Sharp';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from "@mui/x-data-grid";
import ResponseAlert from '../../../components/Alert';
import JasperReport from "../../../components/JasperReport"

const DIAGNOSIS = (props) => {
    const { bed } = props;
    const col1 = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'name1',
            headerName: 'Name',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
        },
    ];
    const row1=[
        {"name":"asdad"},
        {"name":"adsffsdf"},
    ];
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [showPrintSlip, setShowPrintSlip] = useState(false);

    const diagnosisTableColumns = [
        {
            field: 'diagnosisCode',
            headerName: 'Code',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'diagnosisName',
            headerName: 'Diagnosis Name',
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'recordingDoctor',
            headerName: 'Recording Doctor',
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <TextField
                    select
                    fullWidth
                    size='small'
                    color="secondary"
                    id="outlined-basic"
                    label="Recording Doctor"
                    variant="outlined"
                    value={params.row.diagRecordedDoc}
                    onChange={(e) => {
                        const updatedDiagnosisDetails = saveForm.diagnosisDetails.map(diag => {
                            if (diag.diagRID === params.row.diagnosisRID) {
                                return {
                                    ...diag,
                                    diagRecordedDoc: e.target.value
                                };
                            }
                            return diag;
                        });
                        setSaveForm(prevSaveForm => ({
                            ...prevSaveForm,
                            diagnosisDetails: updatedDiagnosisDetails
                        }));
                        const updatedDiagnosisRows = diagnosisRows.map(diag => {
                            if (diag.diagnosisRID === params.row.diagnosisRID) {
                                return {
                                    ...diag,
                                    diagRecordedDoc: e.target.value
                                };
                            }
                            return diag;
                        });
                        setDiagnosisRows(updatedDiagnosisRows);
                    }}
                >
                    {
                        searchForm.allDoctors.map((doc) => (
                            <MenuItem key={doc.staff_rid} value={doc.staff_rid}>
                                {doc.staff_name}
                            </MenuItem>
                        ))
                    }
                </TextField >
            ),
        },
        {
            field: 'since',
            headerName: 'Since',
            flex: 0.5,
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
                        const updatedDiagnosisDetails = saveForm.diagnosisDetails.map(diag => {
                            if (diag.diagRID === params.row.diagnosisRID) {
                                return {
                                    ...diag,
                                    diagnosedSince: e.target.value
                                };
                            }
                            return diag;
                        });
                        setSaveForm(prevSaveForm => ({
                            ...prevSaveForm,
                            diagnosisDetails: updatedDiagnosisDetails
                        }));
                    }}
                >
                </TextField >
            ),
        },
        {
            field: 'provisional',
            headerName: 'Provisional',
            flex: 0.75,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <FormControlLabel
                    control={<Checkbox size="small" />}
                    label=""
                    // value={params.row.diagProvisional == 1}
                    // checked={params.row.diagProvisional == 1}
                    onChange={(e) => {
                        const updatedDiagnosisDetails = saveForm.diagnosisDetails.map(diag => {
                            if (diag.diagRID === params.row.diagnosisRID) {
                                return {
                                    ...diag,
                                    diagProvisional: (e.target.checked === true) ? 1 : 0,
                                    diagFinal: (e.target.checked === true) ? 0 : diag.diagFinal,
                                };
                            }
                            return diag;
                        });
                        setSaveForm(prevSaveForm => ({
                            ...prevSaveForm,
                            diagnosisDetails: updatedDiagnosisDetails
                        }));
                    }}
                />
            ),
        },
        {
            field: 'final',
            headerName: 'Final',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <FormControlLabel
                    control={<Checkbox size="small" />}
                    label=""
                    // value={params.row.diagFinal === 1}
                    // checked={params.row.diagFinal === 1}
                    onChange={(e) => {
                        const updatedDiagnosisDetails = saveForm.diagnosisDetails.map(diag => {
                            if (diag.diagRID === params.row.diagnosisRID) {
                                return {
                                    ...diag,
                                    diagFinal: (e.target.checked === true) ? 1 : 0,
                                    diagProvisional: (e.target.checked === true) ? 0 : diag.diagProvisional,
                                };
                            }
                            return diag;
                        });
                        setSaveForm(prevSaveForm => ({
                            ...prevSaveForm,
                            diagnosisDetails: updatedDiagnosisDetails
                        }));
                    }}
                />
            ),
        },
        {
            field: 'deleteButton',
            headerName: 'Delete',
            flex: 0.75,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                        const updatedRows = diagnosisRows.filter(row => row.diagnosisCode !== params.row.diagnosisCode);
                        setDiagnosisRows(updatedRows);
                    }}
                >
                    Delete
                </Button>
            ),
        },
        {
            field: '',
            headerName: '',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    sx={{ m: 1 }}
                    //disabled={!disableBtn}
                    onClick={() => { addTofav(params.row) }}
                >
                    <StarBorderPurple500SharpIcon fontSize="large" />
                </Button>
            ),
        }
    ];
    const pastDiagColumns = [
        {
            field: 'diaICDCode',
            headerName: 'Code',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'diaValue',
            headerName: 'Name',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'recordingDoctor',
            headerName: 'Recording Doctor',
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <TextField

                    fullWidth
                    size='small'
                    color="secondary"
                    id="outlined-basic"
                    label="Recording Doctor"
                    variant="outlined"
                    value={(searchForm.allDoctors.find(obj => obj.staff_rid == params.row.diaConsultantRid))?.staff_name || ""}
                >

                </TextField >
            ),
        },
        {
            field: 'diaDate',
            headerName: 'Date',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'deleteButton',
            headerName: '',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                        deletePastDiag(params.row);
                    }}
                >
                    Delete
                </Button>
            ),
        },
    ];
    const favDiagColumns = [
        {
            field: 'dfRid',
            headerName: '',
            hide: true
        },
        {
            field: 'dfValue',
            headerName: 'Name',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'add',
            headerName: '',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => {
                        const value = params.row;
                        if (!diagnosisRows.some(diag => diag.diagnosisRID == value.dfDdIndex)) {
                            setSaveForm(prev => ({
                                ...prev,
                                diagnosisDetails: [
                                    ...prev.diagnosisDetails,
                                    {
                                        diagRID: value.dfRid,
                                        diagName: value.dfValue.split(" - ")[0],
                                        diagCode: value.dfValue.split(" - ")[1],
                                        diagRecordedDoc: value.dfConsultantRid,
                                        diagnosedSince: "",
                                        diagProvisional: 0,
                                        diagFinal: 0
                                    }
                                ]
                            }));
                            setDiagnosisRows(prevRows => [...prevRows,
                            {
                                "diagnosisName": value.dfValue.split(" - ")[0],
                                "diagnosisCode": value.dfValue.split(" - ")[1],
                                "diagnosisRID": value.dfDdIndex,
                                "diagRecordedDoc": value.dfConsultantRid,
                            }
                            ]);
                        } else {
                            setResponseMessage(`Duplicate Diagnosis !(${Date.now()})`);
                            setMessageSeverty("Error");
                            setShowResponseAlert(true);
                            console.log("duplicate");
                        }
                    }}
                >
                    Add
                </Button>
            ),
        },
        {
            field: 'deleteButton',
            headerName: '',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                        deleteFavDiag(params.row);
                    }}
                >
                    Delete
                </Button>
            ),
        },
    ];
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [diagnosisRows, setDiagnosisRows] = useState([]);
    const [pastDiagTable, setPastDiagTable] = useState(false);
    const [favDiagTable, setFavDiagTable] = useState(false);
    const [searchForm, setSearchForm] = useState();
    const [saveForm, setSaveForm] = useState();

    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/loadDiagnosisScreen?patientRID=${bed.patRID}&visitRID=${bed.visitRID}&unitRID=135`, {
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
                setSearchForm(data);
                setSaveForm(prev => ({
                    ...prev,
                    "patientRID": bed.patRID,
                    "visitRID": bed.visitRID,
                    "episodeRID": 0,
                    "diagnosisDetails": []
                }));
                // setFormData(data);
                // if (data.patientDeathRecordDto != null) {
                //     setDisableBtn(false);
                // }
                // setFormData(prevState => ({
                //     ...prevState,
                //     patientDeathRecordDto: {
                //         ...prevState.patientDeathRecordDto,
                //         pdrPatientRid: bed.patRID,
                //         pdrVisitRid: bed.visitRID,
                //         pdrIsDeathValid: 1,
                //         pdrEntityRid: 37,
                //         pdrDeathDate: dateValue.format('YYYY-MM-DD'),
                //         pdrDeathTime: timeValue.format('HH:mm'),
                //     }
                // }));
                // setSaveForm(prevState => ({
                //     ...prevState,
                //     pdrPatientRid: bed.patRID,
                //     pdrVisitRid: bed.visitRID,
                //     pdrIsDeathValid: 1,
                //     pdrEntityRid: 37,
                //     pdrDeathDate: dateValue.format('YYYY-MM-DD'),
                //     pdrDeathTime: timeValue.format('HH:mm'),
                // }));
            })
            .catch((error) => {
                console.error('Error fetching Death detail:', error);
            });
    }, []);
    const handleDiagnosisChange = (event, value) => {
        if (value.length % 3 === 0) {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/icd/death/${value}`, {
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
                    setDiagnosisList(data);
                })
                .catch((error) => {
                    console.error(`Error fetching diagnosis List for ${value}:`, error);
                });
        }
    };
    const addTofav = (row) => {
        if (!searchForm.favoriteDiagnosisDtos.some(diag => diag.dfDdIndex == row.diagnosisRID)) {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/diag/addToFavorites?
            diagName=${row.diagnosisName}&diagRID=${row.diagnosisRID}&diagICDCode=${row.diagnosisCode}&consultDocRID=${row.diagRecordedDoc}`, {
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
                    console.log(data);
                    setSearchForm(prev => ({
                        ...prev,
                        favoriteDiagnosisDtos: [
                            ...prev.favoriteDiagnosisDtos,
                            {
                                "dfRid": 0,
                                "dfValue": row.diagnosisName + " - " + row.diagnosisCode,
                                "dfDdIndex": row.diagnosisRID,
                                "dfICDCode": null,
                                "dfInvalidated": 0,
                                "dfEntityRid": 37,
                                "dfCreatedDatetime": "",
                                "dfConsultantRid": row.diagRecordedDoc,
                                "dfValueDdDiag": row.diagnosisName + " - " + row.diagnosisCode
                            },
                        ]
                    }));
                })
                .catch((error) => {
                    setResponseMessage(`Error !(${Date.now()})`);
                    setMessageSeverty("Error");
                    setShowResponseAlert(true);
                    console.error('Error adding to favorite diagnosis list:', error);
                });
        } else {
            setResponseMessage(`Duplicate Diagnosis !(${Date.now()})`);
            setMessageSeverty("Error");
            setShowResponseAlert(true);
            console.log("duplicate");
        }

    };
    const deleteFavDiag = (row) => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/diag/deleteFromFavorites?dfRID=${row.dfRid}`, {
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
                console.log(data);
                const updatedRows = searchForm.favoriteDiagnosisDtos.filter(obj => obj.dfRid !== row.dfRid);
                setSearchForm(prev => ({
                    ...prev,
                    favoriteDiagnosisDtos: updatedRows
                }));
            })
            .catch((error) => {
                console.error('Error deleting Fav Diagnosis:', error);
            });

    };
    const deletePastDiag = (row) => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/diag/deactivateDiagnosis/${row.diaDiagnosisDdIndex}`, {
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
                console.log(data);
                // const updatedRows = searchForm.favoriteDiagnosisDtos.filter(obj => obj.dfRid !== row.dfRid);
                // setSearchForm(prev => ({
                //     ...prev,
                //     favoriteDiagnosisDtos: updatedRows
                // }));
            })
            .catch((error) => {
                console.error('Error deleting Past Diagnosis:', error);
            });

    };
    const handleSave = () => {
        console.log(saveForm);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/diag/saveDiagnosis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(saveForm)
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
                setShowPrintSlip(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error(`Error :`, error);
            });
    };
    return (
        <Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
            >{showPrintSlip && <JasperReport title="" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/ipd/printDeathForm/${bed.patRID}/${bed.visitRID}`} />}
                {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
                <FormControl fullWidth >
                    <Grid x={12} container >
                        <Grid xs={12} item p={1}>
                            <Autocomplete
                                options={diagnosisList}
                                getOptionLabel={(option) => option.diagnosisName}
                                sx={{ width: '100%' }}
                                fullWidth
                                size="small"
                                //inputValue={formData.admittingDiagnosis}
                                onInputChange={(event, value) => {
                                    if (value != '') {
                                        handleDiagnosisChange(event, value)
                                    }
                                }}
                                onChange={(event, value) => {
                                    if (value) {
                                        if (!diagnosisRows.some(diag => diag.diagnosisCode === value.diagnosisCode)) {
                                            const newValue = {
                                                ...value,
                                                diagRecordedDoc: searchForm.defaultDocRID
                                            };
                                            setSaveForm(prev => ({
                                                ...prev,
                                                diagnosisDetails: [
                                                    ...prev.diagnosisDetails,
                                                    {
                                                        diagRID: newValue.diagnosisRID,
                                                        diagName: newValue.diagnosisName,
                                                        diagCode: newValue.diagnosisCode,
                                                        diagRecordedDoc: 0,
                                                        diagnosedSince: "",
                                                        diagProvisional: 0,
                                                        diagFinal: 0
                                                    }
                                                ]
                                            }));
                                            setDiagnosisRows(prevRows => [...prevRows, newValue]);
                                        } else {
                                            console.log("duplicate");
                                            setResponseMessage(`Duplicate Diagnosis !(${Date.now()})`);
                                            setMessageSeverty("Error");
                                            setShowResponseAlert(true);
                                        }

                                    }
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        color="secondary"
                                        id="outlined-basic"
                                        label="Diagnosis"
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
                                    rows={diagnosisRows}
                                    columns={diagnosisTableColumns}
                                    getRowId={(row) => row.diagnosisCode}
                                    disableSelectionOnClick
                                //onRowClick={(params) => { handleLaboratoryService(params) }}
                                />
                            </div>
                        </Box>

                        <Grid container style={{ justifyContent: 'flex-end' }} >
                            <Button
                                sx={{ m: 0.25 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setPastDiagTable(true);
                                    setFavDiagTable(false);
                                }}>
                                Past Diagosis
                            </Button>
                            <Button
                                sx={{ m: 0.25 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setFavDiagTable(true);
                                    setPastDiagTable(false);
                                }}>
                                Favourite List
                            </Button>
                            <Button
                                sx={{ m: 0.25 }}
                                onClick={() => {
                                    handleSave();
                                }}
                            >
                                <DoneIcon color="primary" fontSize="large" />
                            </Button>
                            <Button
                                sx={{ m: 0.25 }}
                            //onClick={handleSave}
                            >
                                <ClearIcon color="primary" fontSize="large" />
                            </Button>
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
                            {pastDiagTable === true ? (
                                <div style={{ width: '100%' }}>
                                    <DataGrid
                                        rows={searchForm.pastDiagnosis}
                                        columns={pastDiagColumns}
                                        getRowId={(row) => row.diaRid}
                                        disableSelectionOnClick
                                        onRowClick={(params) => {
                                            const value = params.row;
                                            if (!diagnosisRows.some(diag => diag.diagnosisRID === value.diaRid)) {
                                                setSaveForm(prev => ({
                                                    ...prev,
                                                    diagnosisDetails: [
                                                        ...prev.diagnosisDetails,
                                                        {
                                                            diagRID: value.diaDiagnosisDdIndex,
                                                            diagName: value.diaValue,
                                                            diagCode: value.diaICDCode,
                                                            diagRecordedDoc: value.diaConsultantRid,
                                                            diagnosedSince: "",
                                                            diagProvisional: 0,
                                                            diagFinal: 0
                                                        }
                                                    ]
                                                }));
                                                setDiagnosisRows(prevRows => [...prevRows,
                                                {
                                                    "diagnosisName": value.diaValue,
                                                    "diagnosisCode": value.diaICDCode,
                                                    "diagnosisRID": value.diaDiagnosisDdIndex,
                                                    "diagRecordedDoc": value.diaConsultantRid,
                                                }
                                                ]);
                                            } else {
                                                console.log("duplicate");
                                                setResponseMessage(`Duplicate Diagnosis !(${Date.now()})`);
                                                setMessageSeverty("Error");
                                                setShowResponseAlert(true);
                                            }
                                        }}
                                    />
                                </div>
                            ) : null
                            }
                            {favDiagTable === true ? (
                                <div style={{ width: '100%' }}>
                                    <DataGrid
                                        rows={searchForm?.favoriteDiagnosisDtos || {}}
                                        columns={favDiagColumns}
                                        getRowId={(row) => row.dfRid}
                                        disableSelectionOnClick
                                    />
                                </div>
                            ) : null
                            }
                        </Box>
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
                                    rows={row1}
                                    columns={col1}
                                    getRowId={(row) => row.name}
                                    disableSelectionOnClick
                                //onRowClick={(params) => { handleLaboratoryService(params) }}
                                />
                            </div>
                        </Box>
                    </Grid>
                </FormControl>
            </Box>
        </Box>
    );
};

export default DIAGNOSIS;