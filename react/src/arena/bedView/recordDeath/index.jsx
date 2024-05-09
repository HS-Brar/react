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

const RECORDDEATH = (props) => {
    const { bed } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [showPrintSlip, setShowPrintSlip] = useState(false);

    const [disableBtn, setDisableBtn] = useState(true);
    const [formData, setFormData] = useState({});
    const [saveForm, setSaveForm] = useState({});
    const diagnosisTableColumns = [
        {
            field: 'diagnosisCode',
            headerName: 'Code',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'diagnosisName',
            headerName: 'Diagnosis Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
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
                    onClick={() => handleDeleteRow(params.row.diagnosisCode)}
                >
                    Delete
                </Button>
            ),
        }
    ];
    const [dateValue, setDateValue] = useState(dayjs());
    const [timeValue, setTimeValue] = useState(dayjs());
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [diagnosisRows, setDiagnosisRows] = useState([]);
    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/openRecordDeath?patientRID=${bed.patRID}&visitRID=${bed.visitRID}&unitRID=135`, {
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
                setFormData(data);
                if (data.patientDeathRecordDto != null) {
                    setDisableBtn(false);
                }
                setFormData(prevState => ({
                    ...prevState,
                    patientDeathRecordDto: {
                        ...prevState.patientDeathRecordDto,
                        pdrPatientRid: bed.patRID,
                        pdrVisitRid: bed.visitRID,
                        pdrIsDeathValid: 1,
                        pdrEntityRid: 37,
                        pdrDeathDate: dateValue.format('YYYY-MM-DD'),
                        pdrDeathTime: timeValue.format('HH:mm'),
                    }
                }));
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
                    console.log(data);
                    setDiagnosisList(data);
                })
                .catch((error) => {
                    console.error(`Error fetching diagnosis List for ${value}:`, error);
                });
        }
    };
    const handleDeleteRow = (diagnosisCode) => {
        const updatedRows = diagnosisRows.filter(row => row.diagnosisCode !== diagnosisCode);
        setDiagnosisRows(updatedRows);

        const updatedDeathReason = saveForm.pdrDeathReason
            .split(',')
            .filter(reason => !reason.includes(diagnosisCode))
            .join(',');

        setSaveForm(prevForm => ({
            ...prevForm,
            pdrDeathReason: updatedDeathReason
        }));
    };
    const handleSave = () => {
        console.log(formData.patientDeathRecordDto);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/recordPatientdeath`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(formData.patientDeathRecordDto)
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
    const handleModifyDeath = () => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/modifyPatientdeath`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(formData.patientDeathRecordDto)
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
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error(`Error :`, error);
            });
    };
    const handleRevokeDeath = () => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/revokePatientdeath?patientRID=${bed.patRID}&visitRID=${bed.visitRID}`, {
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
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error(`Error Revoking patient Death detail patientRID=${bed.patRID} and visitRID=${bed.visitRID}:`, error);
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
                        <Grid xs={2} sx={{ p: 1 }}>
                            <Typography>Nature Of Death: &nbsp;&nbsp;&nbsp;</Typography>
                        </Grid>
                        <Grid xs={2} sx={{}}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Natural"
                                value={formData.patientDeathRecordDto?.pdrIsNaturalDeath || 0}
                                checked={formData.patientDeathRecordDto?.pdrIsNaturalDeath || 0}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            "pdrIsNaturalDeath": (e.target.checked === true) ? 1 : 0,
                                            "pdrSentForPostmortem": 0
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={2} sx={{}}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Unnatural"
                                value={!formData.patientDeathRecordDto?.pdrIsNaturalDeath || 0}
                                checked={!formData.patientDeathRecordDto?.pdrIsNaturalDeath || 0}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            "pdrIsNaturalDeath": (e.target.checked === true) ? 0 : 0,
                                            "pdrSentForPostmortem": 1,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} sx={{}}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Sent for post-mortem"
                                value={formData.patientDeathRecordDto?.pdrSentForPostmortem || 0}
                                checked={formData.patientDeathRecordDto?.pdrSentForPostmortem || 0}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            "pdrSentForPostmortem": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3.5} sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                required
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Deceased Father/Husband Name"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrIsFeatherHusband || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            "pdrIsFeatherHusband": value,
                                        }
                                    }));
                                }}
                            >
                                <MenuItem value="F">Father</MenuItem>
                                <MenuItem value="H">Husband</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                required
                                fullWidth size='small' color="secondary" id="outlined-basic"
                                label="First Name"
                                value={formData.patientDeathRecordDto?.pdrHusbandOrFatherFirstName || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrHusbandOrFatherFirstName: e.target.value
                                        }
                                    }));

                                }}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                required
                                fullWidth size='small' color="secondary" id="outlined-basic"
                                label="Last Name"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrHusbandOrFatherLastName || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrHusbandOrFatherLastName: e.target.value
                                        }
                                    }));
                                }}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={2.6} sx={{ m: 3, ml: 1, mr: 0 }}>
                            <Typography>Pronounced dead at: &nbsp;&nbsp;&nbsp;</Typography>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Date"
                                        value={dateValue}
                                        onChange={(newValue) => {
                                            setDateValue(newValue);
                                            setSaveForm(prevForm => ({
                                                ...prevForm,
                                                pdrDeathDate: newValue.format('YYYY-MM-DD'),
                                            }));
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                        label="Time"
                                        value={timeValue}
                                        onChange={(newValue) => {
                                            setTimeValue(newValue);
                                            setSaveForm(prevForm => ({
                                                ...prevForm,
                                                pdrDeathTime: newValue.format('HH:mm'),
                                            }));
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
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
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        if (!diagnosisRows.some(diag => diag.diagnosisCode === newValue.diagnosisCode)) {
                                            // Update diagnosisRows state
                                            setDiagnosisRows(prevRows => [...prevRows, newValue]);

                                            // Update saveForm.pdrDeathReason
                                            const diagnosisCode = newValue.diagnosisCode;
                                            const diagnosisName = newValue.diagnosisName;
                                            const formattedDiagnosis = `${diagnosisCode} - ${diagnosisName}`;
                                            setSaveForm(prevForm => ({
                                                ...prevForm,
                                                pdrDeathReason: prevForm.pdrDeathReason
                                                    ? `${prevForm.pdrDeathReason},${formattedDiagnosis}`
                                                    : formattedDiagnosis
                                            }));
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
                        <Grid xs={4} item p={1}>
                            <TextField
                                sx={{}}
                                select
                                fullWidth size='small' color="secondary" id="outlined-basic"
                                label="Cause of Death"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrDeathCause || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrDeathCause: e.target.value
                                        }
                                    }));
                                }}
                            >
                                {formData.deathCause &&
                                    formData.deathCause.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddValue}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={4} item p={1}>
                            <TextField
                                sx={{}}
                                fullWidth size='small' color="secondary" id="outlined-basic"
                                label="Remarks if any"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrDeathRemarks || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrDeathRemarks: e.target.value
                                        }
                                    }));
                                }}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={4} item p={1}>
                            <TextField
                                sx={{}}
                                fullWidth
                                required
                                select
                                size='small' color="secondary" id="outlined-basic"
                                label="Last attending doctor"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrLastAttendingDoc || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrLastAttendingDoc: e.target.value
                                        }
                                    }));
                                }}
                            >
                                {formData.lastAttendingDoc &&
                                    formData.lastAttendingDoc.map((option) => (
                                        <MenuItem key={option.staff_rid} value={option.staff_rid}>
                                            {option.staff_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={4} item p={1}>
                            <TextField
                                sx={{}}
                                fullWidth
                                required
                                select
                                size='small' color="secondary" id="outlined-basic"
                                label="Death certified by"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrDeathCertifiedDoc || ""}
                                onChange={(e) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        patientDeathRecordDto: {
                                            ...prevState.patientDeathRecordDto,
                                            pdrDeathCertifiedDoc: e.target.value
                                        }
                                    }));
                                }}
                            >
                                {formData.deathCertifiedBy &&
                                    formData.deathCertifiedBy.map((option) => (
                                        <MenuItem key={option.staff_rid} value={option.staff_rid}>
                                            {option.staff_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={4} item p={1}>
                            <TextField
                                sx={{}}
                                select
                                fullWidth size='small' color="secondary" id="outlined-basic"
                                label="Body handed over to"
                                variant="outlined"
                                value={formData.patientDeathRecordDto?.pdrBodyHandedOverTo || ""}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === 'Police') {
                                        // If "Police" is selected, clean the fields related to relatives
                                        setFormData(prevState => ({
                                            ...prevState,
                                            patientDeathRecordDto: {
                                                ...prevState.patientDeathRecordDto,
                                                pdrBodyHandedOverTo: selectedValue,
                                                pdrRelativeName: '', // Clear relative name
                                                pdrRelativeRelationship: '', // Clear relative relationship
                                            }
                                        }));
                                    } else {
                                        // If any other value is selected, update as usual
                                        setFormData(prevState => ({
                                            ...prevState,
                                            patientDeathRecordDto: {
                                                ...prevState.patientDeathRecordDto,
                                                pdrBodyHandedOverTo: selectedValue,
                                                pdrPoliceIoName: "",
                                                pdrPolicePostThana: "",
                                                pdrPostName: "",
                                                pdrPoliceIdNo: "",
                                            }
                                        }));
                                    }
                                }}
                            >
                                {formData.broughtBy &&
                                    formData.broughtBy.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddValue}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        {formData.patientDeathRecordDto?.pdrBodyHandedOverTo == 'Police' ? (
                            <Grid xs={12} container>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrPoliceIoName: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrPoliceIoName"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="IO Name"
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrPoliceIoName || ""}
                                    />
                                </Grid>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrPolicePostThana: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrPolicePostThana"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="Police Post/Thana"
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrPolicePostThana || ""}
                                    />
                                </Grid>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrPostName: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrPostName"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="Post Name"
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrPostName || ""}
                                    />
                                </Grid>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrPoliceIdNo: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrPoliceIdNo"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="ID No."
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrPoliceIdNo || ""}
                                    />
                                </Grid>
                            </Grid>
                        ) : null}

                        {formData.patientDeathRecordDto?.pdrBodyHandedOverTo == 'Relatives' ? (
                            <Grid xs={12} container>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrRelativeName: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrRelativeName"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="Relative Name"
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrRelativeName || ""}
                                    />
                                </Grid>
                                <Grid xs={3} item sx={{}}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                patientDeathRecordDto: {
                                                    ...prevState.patientDeathRecordDto,
                                                    pdrRelativeRelationship: e.target.value
                                                }
                                            }));
                                        }}
                                        name="pdrRelativeRelationship"
                                        fullWidth size='small' color="secondary" id="outlined-basic"
                                        label="Relationship"
                                        variant="outlined"
                                        value={formData.patientDeathRecordDto?.pdrRelativeRelationship || ""}
                                    />
                                </Grid>
                            </Grid>
                        ) : null}
                        <Grid container style={{ justifyContent: 'flex-end' }} >
                            <Button
                                sx={{ m: 1 }}
                                disabled={!disableBtn}
                                onClick={() => { handleSave() }}
                            >
                                <DoneIcon color={!disableBtn ? "disabled" : "primary"} fontSize="large" />
                            </Button>

                            <Button
                                sx={{ m: 1 }}
                            //onClick={handleSave}
                            >
                                <ClearIcon color="primary" fontSize="large" />
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                                disabled={disableBtn}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleModifyDeath() }}
                            >
                                Modify Death
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                                disabled={disableBtn}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleRevokeDeath() }}
                            >
                                Revoke Death
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Box>
    );
};

export default RECORDDEATH;