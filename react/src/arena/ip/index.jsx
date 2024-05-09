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
import UploadIcon from '@mui/icons-material/Upload';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ResponseAlert from '../../components/Alert';
import { useHistory, useNavigate } from "react-router-dom";
import SearchComponent from "../../components/IncrementalSearch";
import Autocomplete from '@mui/material/Autocomplete';
import Popup from "../../components/Popup";
import HotelIcon from '@mui/icons-material/Hotel';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import DeleteIcon from '@mui/icons-material/Delete';
import JasperReport from "../../components/JasperReport";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const IP = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const history = useNavigate();
    const jwtToken = localStorage.getItem("jwtToken");
    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [showPrintSlip, setShowPrintSlip] = useState(false);
    const [showWristTagPrint, setShowWristTagPrint] = useState(false);
    const [showAattendantPassPrint, setShowAattendantPassPrint] = useState(false);
    const [uhidToSearch, setUhidToSearch] = useState('');
    const [uhidSearchResult, setUhidSearchResult] = useState('');
    const [reasonForAdmissionList, setReasonForAdmissionList] = useState([]);
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [docList, setDocList] = useState([]);
    const [wardUnitList, setWardUnitList] = useState([]);
    const [bedList, setBedList] = useState([]);
    const [availableWardPopup, setAvailableWardPopup] = useState(false);
    const [availableBedPopup, setAvailableBedPopup] = useState(false);
    //const [wardInputField, setWardInputField] = useState("");
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
    const [isCancelButtonDisabled, setIsCancelButtonDisabled] = useState(false);
    const [wristTagCheckBox, setWristTagCheckBox] = useState(false);
    const [attendantPassCheckBox, setAttendantPassCheckBox] = useState(false);
    const [disableBedSelectionBtn, setDisableBedSelectionBtn] = useState(true);
    const [disableWardSelectionBtn, setDisableWardSelectionBtn] = useState(true);
    const [formData, setFormData] = useState(
        {
            "patientRID": 0,
            "visitRID": 0,//if 0=> new Pat, if !=0 then revist
            "visitSubType": 0,
            "visitSequenceNo": 0,
            "patientCategoryID": 0,
            "patientSchemeID": 0,
            "patientAdmissionDate": "",
            "reasonforAdmission": "",
            "reasonforAdmissionIndex": 0,
            "admittingDiagnosisIndex": 0,
            "admittingDiagnosis": "",
            "specialityID": 0,
            "speciality": "",
            "consultingDoctorRID": 0,
            "attendantPhone": "",
            "currentUnitRID": 0,
            "wardRID": 0,
            "wardName": "",
            "bedRID": 0,
            "bedNo": "",
            "serviceID": "",
            "serviceFee": 0
        }
    );
    const availaleWardTableColumns = [
        {
            field: 'unitRID',
            hide: true,
        },
        {
            field: 'unitName',
            headerName: 'Ward Name',
            flex: 3,
            headerAlign: "center",
            align: "center",
            disableSelectionOnClick: true,
        },
        {
            field: 'generalBedCount',
            headerName: 'General Bed',
            flex: 3,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'privateBedCount',
            headerName: 'Private Bed',
            flex: 3,
            headerAlign: "center",
            align: "center",
        }
    ];

    useEffect(() => {
        fetch('http://10.197.8.17:2023/hmis/api/v1/ipd/ward/unit/', {
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
                setWardUnitList(data);
            })
            .catch((error) => {
                console.error('Error fetching Ward Unit List:', error);
            });
    }, []);

    const handleReasonOfAdmissionChange = (event, value) => {
        console.log("handleReasonOfAdmissionChange - Event:", event);
        console.log("handleReasonOfAdmissionChange - Value:", value);
        setFormData(prevFormData => ({
            ...prevFormData,
            reasonforAdmission: value,
        }));
        if (value.length % 3 === 0) {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/data/reasonforadmission/${value}`, {
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
                            setResponseMessage(errorData.message + `!(${Date.now()})`);
                            setMessageSeverty("error");
                            setShowResponseAlert(true);
                            throw new Error(errorMessage);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    setReasonForAdmissionList(data);
                })
                .catch((error) => {
                    console.error(`Error fetching reasonforadmission for ${value}:`, error);
                });
        }
    };
    const handleDiagnosisChange = (event, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            admittingDiagnosis: value,
        }));
        if (value.length % 3 === 0) {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/diagnosis/ipd/icd/${value}`, {
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
                            setResponseMessage(errorData.message + `!(${Date.now()})`);
                            setMessageSeverty("error");
                            setShowResponseAlert(true);
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

    const handleSearch = () => {
        console.log(uhidToSearch);
        const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
            clearedData[field] = '';
            return clearedData;
        }, {})
        setFormData(clearedFormData);
        setDocList([]);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/search/${uhidToSearch}`, {
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
                        setResponseMessage(errorData.message + `!(${Date.now()})`);
                        setMessageSeverty("error");
                        setShowResponseAlert(true);
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setUhidSearchResult(data);
                setDisableBedSelectionBtn(false);
                setDisableWardSelectionBtn(false);
                if (data.visitRID != 0) {
                    //revisit Patient
                    setDisableBedSelectionBtn(true);
                    setDisableWardSelectionBtn(true);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        patientSchemeID: data.patientSchemeID,
                        patientAdmissionDate: data.patientAdmissionDate,
                        reasonforAdmission: data.reasonforAdmission,
                        reasonforAdmissionIndex: data.reasonforAdmissionID,
                        admittingDiagnosisIndex: data.admittedDiagnosisID,
                        admittingDiagnosis: data.admittedDiagnosis,
                        specialityID: data.specialityID,
                        speciality: data.speciality,
                        consultingDoctorRID: data.admittedDoctorRID,
                        attendantPhone: data.attendantPhone,
                        wardRID: data.admittedWardRID,
                        wardName: data.admittedWardName,
                        bedRID: data.admittedBedRID,
                        bedNo: data.admittedBedNo,
                        serviceID: data.admissionFeeID,
                        serviceFee: data.admissionFee,
                    }));
                    // setWardInputField(data.wardName);
                    fetch(`http://10.197.8.17:2023/hmis/api/v1/speciality/${data.specialityID}/doctors`, {
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
                        .then((data1) => {
                            console.log(data1);
                            setDocList(data1);
                        })
                        .catch((error) => {
                            console.error('Error fetching doctor data:', error);
                        });
                }
            })
            .catch((error) => {
                console.error(`Error fetching Patient for UHID ${uhidToSearch}:`, error);
            });
    };

    const onChange = (e) => {
        if (e.target.name === "specialityID") {
            const specialityName = uhidSearchResult.specialityList.find(speciality => speciality.specialityID == e.target.value).specialityName
            formData.speciality = specialityName;
            // setFormData(() => ({
            //     ...formData,
            //     speciality: specialityName
            // }));
            fetch(`http://10.197.8.17:2023/hmis/api/v1/speciality/${e.target.value}/doctors`, {
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
                    console.log(data);
                    setDocList(data);
                    // setFormData((prevFormData) => ({
                    //     ...prevFormData,
                    //     consultingDoctorRID: (data.length > 0) ? data[0].staffRID : 0,
                    // }));
                })
                .catch((error) => {
                    console.error('Error fetching doctor data:', error);
                });
        }
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };
    const handleWardSelection = (params) => {
        const clickedField = params.field;
        const clickedCellValue = params.value;
        const unitRID = params.row.unitRID;
        const unitName = params.row.unitName;

        if (clickedField === 'generalBedCount' || clickedField === 'privateBedCount') {
            // Perform your action based on the clicked cell and unitRID
            console.log(`Clicked on ${clickedField} cell with value: ${clickedCellValue}, UnitRID: ${unitRID}`);
            //setWardInputField(unitName);
            setFormData(prevFormData => ({
                ...prevFormData,
                wardName: unitName,
            }));
            //setWardUnitRID(unitRID);
            const bedTypeID = (clickedField === 'generalBedCount') ? params.row.generalBedTypeID : params.row.privateBedTypeID;
            //setBedTypeID();
            setAvailableWardPopup(false);
            fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/bed/list/${unitRID}/${bedTypeID}`, {
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
                            setResponseMessage(errorData.message + `!(${Date.now()})`);
                            setMessageSeverty("error");
                            setShowResponseAlert(true);
                            throw new Error(errorMessage);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    setBedList(data);
                })
                .catch((error) => {
                    console.error(`Error fetching bed deatils for ${unitRID} unit and ${bedTypeID} Bed Type:`, error);
                });
        }
    };
    const handleBedSelection = (selectedBed) => {
        setAvailableBedPopup(false);
        console.log(`Selected Bed: ${selectedBed.bedNo}`);
        setFormData(prevFormData => ({
            ...prevFormData,
            wardRID: selectedBed.wardRID,
            wardName: selectedBed.wardName,
            bedRID: selectedBed.bedRID,
            bedNo: selectedBed.bedNo,
        }));
    };
    const handleSave = () => {
        formData.currentUnitRID = 135;
        formData.patientAdmissionDate = uhidSearchResult.patientAdmissionDate;
        formData.patientRID = uhidSearchResult.patientRID;
        formData.patientCategoryID = uhidSearchResult.patientCategoryID;
        formData.serviceFee = uhidSearchResult.admissionFee;
        formData.serviceID = uhidSearchResult.admissionFeeID;
        formData.visitRID = uhidSearchResult.visitRID;
        formData.visitSequenceNo = uhidSearchResult.visitSequenceNo;
        formData.visitSubType = uhidSearchResult.visitSubType;
        // setFormData(prevFormData => ({
        //     ...prevFormData,
        //     currentUnitRID: 135,
        //     patientAdmissionDate: uhidSearchResult.patientAdmissionDate,
        //     patientRID: uhidSearchResult.patientRID,
        //     patientCategoryID: uhidSearchResult.patientCategoryID,
        //     serviceFee: uhidSearchResult.admissionFee,
        //     serviceID: uhidSearchResult.admissionFeeID,
        //     visitRID: uhidSearchResult.visitRID,
        //     visitSequenceNo: uhidSearchResult.visitSequenceNo,
        //     visitSubType: uhidSearchResult.visitSubType,
        // }));
        console.log(formData);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
                        setResponseMessage(errorData.message + `!(${Date.now()})`);
                        setMessageSeverty("error");
                        setShowResponseAlert(true);
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setResponseMessage(data.message + `!(${Date.now()})`);
                setMessageSeverty("success");
                setShowResponseAlert(true);
                setShowPrintSlip(true);
                if (wristTagCheckBox) {
                    setShowWristTagPrint(true);
                }
                if (attendantPassCheckBox) {
                    setShowAattendantPassPrint(true);
                }
                console.log("IP Admission Successful!!!", data);
            })
            .catch((error) => {
                console.error('Error in OP registration:', error);
            });
        const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
            clearedData[field] = '';
            return clearedData;
        }, {})
        setFormData(clearedFormData);
    };
    const handleCancel = () => {
        console.log(`Cancel Ip Admission  for patientRID: ${uhidSearchResult.patientRID} and visitRID: ${uhidSearchResult.visitRID}`);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/admission/cancel/${uhidSearchResult.patientRID}/${uhidSearchResult.visitRID}`, {
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
                        setResponseMessage(errorData.message + `!(${Date.now()})`);
                        setMessageSeverty("error");
                        setShowResponseAlert(true);
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setResponseMessage(data.message + `!(${Date.now()})`);
                setMessageSeverty("success");
                setShowResponseAlert(true);
                console.log("IP Admission Cancelled !!!", data);
            })
            .catch((error) => {
                console.error('Error in IP Admission Cancellation:', error);
            });
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="IP Admission" />
                {showPrintSlip && <JasperReport title="IP Admission" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/admission-slip/${uhidSearchResult.patientRID}/${uhidSearchResult.visitRID}/print`} />}
                {showWristTagPrint && <JasperReport title="Wrist Tag" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/wrist-tag/${uhidSearchResult.patientRID}/${uhidSearchResult.visitRID}/print`} />}
                {showAattendantPassPrint && <JasperReport title="Attendant's Pass" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/ipd/patient/attendant-pass/${uhidSearchResult.patientRID}/${uhidSearchResult.visitRID}/print`} />}
                {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <Grid xs={12} container alignItems="center" justifyContent="center" sx={{ p: 1, paddingLeft: 3 }}>
                    <TextField
                        sx={{ width: "21.2%" }}
                        fullWidth size='small' color="secondary" id="outlined-basic"
                        label="Enter UHID To Search"
                        variant="outlined"
                        value={uhidToSearch}
                        onChange={(e) => setUhidToSearch(e.target.value)}
                    >
                    </TextField>
                    <Button
                        sx={{
                            ml: 1,
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px,20px",
                        }}
                        onClick={(e) => { handleSearch(); }}
                    >
                        Search
                    </Button>
                </Grid>
                <Divider textAlign="left" variant="middle"
                    sx={{
                        p: 0.5, borderColor: "#3da58a",
                        "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                    }}>
                </Divider>
                <FormControl fullWidth >
                    <Grid x={12} container >
                        <Grid sx={{ width: "100%" }}>
                            <table width={"100%"}>
                                <tbody>
                                    <TableRow
                                        sx={{
                                            background: "linear-gradient(180deg, #2262d0, white)",
                                        }}
                                    >
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            Name: {uhidSearchResult.patientName}
                                        </TableCell>
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            Date Of Admission: {uhidSearchResult.patientAdmissionDate}
                                        </TableCell>
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            Age: {uhidSearchResult.patientAge}
                                        </TableCell>
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            Gender: {uhidSearchResult.patientGender}
                                        </TableCell>
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            UHID: {uhidSearchResult.patientUHID}
                                        </TableCell>
                                        <TableCell sx={{ p: 1, textAlign: 'center' }}>
                                            Mobile No: {uhidSearchResult.patientMobileNo}
                                        </TableCell>
                                    </TableRow>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 3 }}>
                            {/* <Grid container sx={{ paddingBottom: 4 }} item alignItems="center">
                                <Grid item>
                                    <Typography sx={{ fontWeight: 'bold' }}>Date of admission</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography sx={{ marginLeft: 2.35 }}>{uhidSearchResult.patientAdmissionDate}</Typography>
                                </Grid>
                            </Grid> */}
                            <item>
                                <Autocomplete
                                    options={reasonForAdmissionList}
                                    getOptionLabel={(option) => option.visitReasonName}
                                    sx={{ m: 1, width: '100%' }}
                                    fullWidth
                                    size="small"
                                    inputValue={formData.reasonforAdmission}
                                    onInputChange={(event, value) => {
                                        if (value != '') {
                                            handleReasonOfAdmissionChange(event, value)
                                        }
                                    }}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setFormData(prevFormData => ({
                                                ...prevFormData,
                                                reasonforAdmission: newValue.visitReasonName,
                                                reasonforAdmissionIndex: newValue.visitReasonID,
                                            }));
                                            //formData.reasonforAdmission = newValue.visitReasonName;
                                            //formData.reasonforAdmissionIndex = newValue.visitReasonID;
                                        } else {
                                            setFormData(prevFormData => ({
                                                ...prevFormData,
                                                reasonforAdmission: "",
                                                reasonforAdmissionIndex: 0,
                                            }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            color="secondary"
                                            id="outlined-basic"
                                            label="Reason for admission"
                                            variant="outlined"
                                        />
                                    )}
                                />
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="specialityID"
                                    select fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Speciality"
                                    variant="outlined"
                                    value={formData.specialityID || ""}
                                >
                                    {uhidSearchResult.specialityList &&
                                        uhidSearchResult.specialityList.map((option) => (
                                            <MenuItem key={option.specialityID} value={option.specialityID}>
                                                {option.specialityName}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <TextField
                                    sx={{ m: 1 }}
                                    onClick={() => { setAvailableWardPopup(true) }}
                                    name="wardName"
                                    disabled={disableWardSelectionBtn}
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Ward"
                                    variant="outlined"
                                    value={formData.wardName || ""}
                                >
                                </TextField>
                            </item>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 3 }}>
                            <item >
                                <Autocomplete
                                    options={diagnosisList}
                                    getOptionLabel={(option) => option.diagnosisName}
                                    sx={{ m: 1, width: '100%' }}
                                    fullWidth
                                    size="small"
                                    inputValue={formData.admittingDiagnosis}
                                    onInputChange={(event, value) => {
                                        if (value != '') {
                                            handleDiagnosisChange(event, value)
                                        }
                                    }}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setFormData(prevFormData => ({
                                                ...prevFormData,
                                                admittingDiagnosis: newValue.diagnosisName,
                                                admittingDiagnosisIndex: newValue.diagnosisRID,
                                            }));
                                        } else {
                                            setFormData(prevFormData => ({
                                                ...prevFormData,
                                                admittingDiagnosis: "",
                                                admittingDiagnosisIndex: 0,
                                            }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            color="secondary"
                                            id="outlined-basic"
                                            label="Admitting Diagnosis"
                                            variant="outlined"
                                        />
                                    )}
                                />
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="consultingDoctorRID"
                                    select required fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Doctor"
                                    variant="outlined"
                                    value={formData.consultingDoctorRID || ""}
                                >
                                    {docList &&
                                        docList.map((option) => (
                                            <MenuItem key={option.staffRID} value={option.staffRID}>
                                                {option.staffName}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        disabled={disableBedSelectionBtn}
                                        sx={{
                                            color: colors.grey[100],
                                            m: 0.6,
                                            borderRadius: '5px',
                                            width: '325px',
                                            '&:hover': {
                                                backgroundColor: colors.blueAccent[800],
                                            },
                                        }}
                                        onClick={() => {
                                            setAvailableBedPopup(true);
                                        }}
                                    >
                                        <HotelIcon style={{ fontSize: '2rem' }} />
                                        Select Bed
                                    </IconButton>

                                    {/* <Typography sx={{ fontWeight: 'bold' }}>
                                        {formData.bedNo.split(" ")[0]}
                                    </Typography> */}
                                </div>
                            </item>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 3 }}>
                            <item>
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="attendantPhone"
                                    fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Attendant's Phone"
                                    variant="outlined"
                                    value={formData.attendantPhone || ""}
                                >
                                </TextField>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="patientSchemeID"
                                    onChange={onChange}
                                    select
                                    fullWidth
                                    size="small"
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Scheme"
                                    variant="outlined"
                                    value={formData.patientSchemeID || ""}
                                >
                                    {uhidSearchResult.patientSchemeList &&
                                        uhidSearchResult.patientSchemeList.map((option) => (
                                            <MenuItem key={option.patientSchemeID} value={option.patientSchemeID}>
                                                {option.patientSchemeName}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                {/* <FormControlLabel
                                    sx={{ marginTop: 1 }}
                                    control={<Checkbox size="small" />}
                                    //name="wardIsActive"
                                    label="Scheme Based"
                                /> */}
                                <Typography sx={{ p:2,textAlign: 'center',fontWeight: 'bold' }}>
                                    {formData.bedNo}
                                </Typography>
                            </item>
                        </Grid>
                        {
                            wardUnitList.length > 0 && (
                                <Popup
                                    title="Available Wards"
                                    openPopup={availableWardPopup}
                                    setOpenPopup={setAvailableWardPopup}
                                    popupWidth={"md"}
                                    showCloseButton={true}
                                >
                                    <Box display="flex" justifyContent="center"
                                        m="5px 0 0 0"
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
                                        <div style={{ width: '100%', minHeight: '300px' }}>
                                            <DataGrid
                                                rows={wardUnitList}
                                                columns={availaleWardTableColumns}
                                                getRowId={(row) => row.unitRID}
                                                onCellClick={(params) => {
                                                    handleWardSelection(params);
                                                }}
                                            />
                                        </div>
                                    </Box>
                                </Popup>
                            )
                        }
                        {
                            bedList.length > 0 && (
                                <Popup
                                    title="Select a Bed"
                                    openPopup={availableBedPopup}
                                    setOpenPopup={setAvailableBedPopup}
                                    popupWidth={"md"}
                                    showCloseButton={true}
                                >

                                    <Grid x={12} container >
                                        {bedList.map((bed) => (
                                            <Grid xs={2} item sx={{ p: 1 }}>
                                                <Button
                                                    key={bed.bedNo}
                                                    className="bed-button"
                                                    onClick={() => {
                                                        if (bed.bedStatus != 1) {
                                                            handleBedSelection(bed);
                                                        } else {
                                                            setResponseMessage("Bed Already Occupied!" + `!(${Date.now()})`);
                                                            setMessageSeverty("error");
                                                            setShowResponseAlert(true);
                                                        }
                                                    }}
                                                    //variant="outlined"
                                                    //color="primary"
                                                    sx={{
                                                        backgroundColor: bed.bedStatus === 1 ? colors.greenAccent[700] : colors.blueAccent[700],
                                                        color: colors.grey[100],
                                                        fontSize: '1.3rem',
                                                        height: '80px',
                                                        width: '100%',
                                                        borderRadius: '10px',
                                                    }}
                                                >
                                                    {bed.bedGenderIndex === 'Male' && <MaleIcon />}
                                                    {bed.bedGenderIndex === 'Female' && <FemaleIcon />}
                                                    <span style={{ fontWeight: 'bold' }}>{bed.bedNo}</span>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Popup>
                            )
                        }
                    </Grid>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3} sx={{ p: 3 }}>
                            <Grid item xs={9}>
                                <Item sx={{ fontSize: '16', fontWeight: '600' }}>Admission Fees (INR)</Item>
                            </Grid>
                            <Grid item xs={2}>
                                <Item>{uhidSearchResult.admissionFee} Rs</Item>
                            </Grid>
                            <Grid item xs={3} >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={wristTagCheckBox}
                                            onChange={(event) => setWristTagCheckBox(event.target.checked)}
                                        />
                                    }
                                    label="Print Wrist Tag"
                                /></Grid>
                            <Grid item xs={3} >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={attendantPassCheckBox}
                                            onChange={(event) => setAttendantPassCheckBox(event.target.checked)}
                                        />
                                    }
                                    label="Attendant's Pass"
                                />
                            </Grid>
                            <Grid item xs={2} >
                                <Button
                                    disabled={isSaveButtonDisabled}
                                    sx={{ width: '100px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleSave()}
                                >Save
                                </Button>
                            </Grid>
                            <Grid item xs={2} >
                                <Button
                                    disabled={isCancelButtonDisabled}
                                    sx={{ width: '100px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleCancel()}
                                >Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={2} >
                                <Button
                                    sx={{ width: '100px' }}
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {
                                        setUhidToSearch("");
                                        setUhidSearchResult("");
                                        const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
                                            clearedData[field] = '';
                                            return clearedData;
                                        }, {})
                                        setFormData(clearedFormData);
                                        setDocList([]);
                                        setDisableBedSelectionBtn(true);
                                        setDisableWardSelectionBtn(true);
                                    }}
                                >Clear</Button>
                            </Grid>

                        </Grid>
                    </Box>
                </FormControl>
            </Box>
        </Box >
    );
};

export default IP;
