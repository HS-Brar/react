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
} from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import Header from "../../components/Header";
import { Person2 } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ResponseAlert from '../../components/Alert';
import JasperReport from "../../components/JasperReport";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { forEach } from 'lodash';
import Popup from "../../components/Popup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import HotelIcon from '@mui/icons-material/Hotel';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const INCOMING = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [markAsArrivedPopup, setMarkAsArrivedPopup] = useState(false);
    const [unitRid, setUnitRid] = useState(135);
    const [selectedPat, setSelectedPat] = useState({});
    const [availableBedPopup, setAvailableBedPopup] = useState(false);
    const [bedList, setBedList] = useState([]);
    const [disableBedSelectionBtn, setDisableBedSelectionBtn] = useState(true);
    const renderBedIconCell = (params) => {
        // Check if visitDispStatus is "Arrived"
        if (params.row.visitDispStatus === "Arrived") {
            return <IconButton
                //disabled={disableBedSelectionBtn}
                sx={{
                    color: colors.grey[100],
                    m: 0.6,
                    borderRadius: '5px',
                    //width: '325px',
                    '&:hover': {
                        backgroundColor: colors.blueAccent[800],
                    },
                }}
                onClick={() => {
                    // setSelectedPat(params.row);
                    // setMarkAsArrivedPopup(true);
                }}
            >
                <HotelIcon style={{}} />
            </IconButton>;
        }
        return null;
    };
    const handleStatusClick = (params) => {
        // Check if visitDispStatus is "Arrived"
        if (params.row.visitDispStatus === "In Transit") {
            setSelectedPat(params.row);
            setMarkAsArrivedPopup(true);
        }
        if (params.row.visitDispStatus === "Arrived") {
            alert("perform Arrvied Task!!")
        }
        return null;
    };
    const incomingTableColumns = [
        {
            field: 'patMrn',
            headerName: 'UHID',
            flex: 1.5,
        },
        {
            field: 'patFullName',
            headerName: 'Patient Name',
            flex: 2,
        },
        {
            field: 'visitPatientAge',
            headerName: 'Age',
            flex: 0.5,
        },
        {
            field: 'patGenderName',
            headerName: 'Gender',
            flex: 1,
        },
        {
            field: 'staffName',
            headerName: 'Admitting Doctor',
            flex: 2,
        },
        {
            field: 'fromUnitName',
            headerName: 'From',
            flex: 2
        },
        {
            field: 'visitDate',
            headerName: 'Admission Date',
            flex: 2
        },
        {
            field: 'visitDispStatus',
            headerName: 'Status',
            flex: 1
        },
        {
            field: 'bedIcon',
            headerName: '',
            renderCell: renderBedIconCell,
        },
    ];
    const [incomingTableRows, setIncomingTableRows] = useState([]);
    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/nursing/loadIncomingPatientsUnitWise/${unitRid}`, {
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
                setIncomingTableRows(data);
            })
            .catch((error) => {
                console.error('Error fetching Incoming Patients Data:', error);
            });
    }, []);
    const handleMarkAsNoShowClick = () => {
        console.log(selectedPat);
        console.log(selectedPat);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/nursing/markedAsNoShow/${selectedPat.patRid}/${selectedPat.visitRid}`, {
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
                //if status OK, then remove Pat from list.
                if (data.status === "success") {
                    setIncomingTableRows(prevRows => prevRows.filter(row => row.patRid !== selectedPat.patRid));
                    setMarkAsArrivedPopup(false);
                }
            })
            .catch((error) => {
                console.error('Error in Marking Patient as No show!!:', error);
            });
    };
    const handleMarkAsArrivedClick = () => {
        console.log(selectedPat);
        console.log(selectedPat);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/nursing/markedAsArrived/
        ${selectedPat.patRid}/
        ${selectedPat.visitRid}/
        ${selectedPat.bedRid}/
        ${unitRid}/
        ${selectedPat.bedType}`, {
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
                //if Status is OK,
                //update visitDispStatus as "Arrived"
                if (data.status === "success") {
                    selectedPat.visitDispStatus = "Arrived";
                    setMarkAsArrivedPopup(false);
                }
            })
            .catch((error) => {
                console.error('Error in Marking Patient as Arrived!!:', error);
            });
    };
    const handleBedSelection = () => {
        //fetch bed list
        fetch(`http://10.197.8.17:2023/hmis/api/v1/ipd/bed/list/${unitRid}/${selectedPat.bedType}`, {
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
                //console.error(`Error fetching bed deatils for ${unitRID} unit and ${bedTypeID} Bed Type:`, error);
            });

        //show bed Selection popUp
        setAvailableBedPopup(true);
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="INCOMING" />
                {/* {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />} */}
            </Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <FormControl fullWidth>
                    <Grid x={12} container>
                        <Box width="100%" display="flex" justifyContent="center"
                            m="5px 0 0 0"
                            height="83vh"
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
                                    rows={incomingTableRows}
                                    columns={incomingTableColumns}
                                    getRowId={(row) => row.patMrn}
                                    onCellClick={(params) => {
                                        handleStatusClick(params);
                                    }}
                                />
                            </div>
                        </Box>
                        <Popup
                            title="Mark As Arrived"
                            openPopup={markAsArrivedPopup}
                            setOpenPopup={setMarkAsArrivedPopup}
                            popupWidth={"sm"}
                            onClose={() => {
                                console.log("dfgduhfadgydgzfug");
                                setDisableBedSelectionBtn(true);
                            }}
                        >

                            {(selectedPat.patFullName) ? (
                                <strong style={{ marginRight: '10px' }}>
                                    {selectedPat.patFullName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedPat.patMrn}
                                </strong>
                            ) : ""}
                            <Divider textAlign="left" variant="middle"
                                sx={{
                                    p: 0, borderColor: "#3da58a",
                                    "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                                }}>
                            </Divider>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        //checked={true}
                                        onChange={(event) => {
                                            if (event.target.checked === true) {
                                                setDisableBedSelectionBtn(false);
                                            } else {
                                                setDisableBedSelectionBtn(true);
                                            }
                                        }}
                                    />
                                }
                                label="Assign Bed"
                            />
                            <IconButton
                                disabled={disableBedSelectionBtn}
                                sx={{
                                    color: colors.grey[100],
                                    m: 0.6,
                                    //mr: 2,
                                    borderRadius: '5px',
                                    //width: '325px',
                                    '&:hover': {
                                        backgroundColor: colors.blueAccent[800],
                                    },
                                }}
                                onClick={() => {
                                    handleBedSelection();
                                }}
                            >
                                <HotelIcon style={{}} />
                            </IconButton>
                            <Grid>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={true}
                                            disabled
                                        //onChange={(event) => setWristTagCheckBox(event.target.checked)}
                                        />
                                    }
                                    label="Receive MR Folder"
                                />
                            </Grid>
                            <Grid>
                                <Button
                                    // disabled={isSaveButtonDisabled}
                                    sx={{ m: 3, marginBottom: 1 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        handleMarkAsNoShowClick()
                                    }
                                >Mark as no show
                                </Button>
                                <Button
                                    // disabled={isSaveButtonDisabled}
                                    sx={{ m: 3, marginBottom: 1 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleMarkAsArrivedClick()}
                                >Mark as arrived
                                </Button>
                                <Button
                                    // disabled={isSaveButtonDisabled}
                                    sx={{ m: 3, marginBottom: 1 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setMarkAsArrivedPopup(false);
                                        setDisableBedSelectionBtn(true);
                                    }}
                                >Close
                                </Button>
                            </Grid>
                        </Popup>
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
                                                            //handleBedSelection(bed);
                                                            selectedPat.bedRid = bed.bedRID;
                                                            setAvailableBedPopup(false);
                                                            console.log(`Selected Bed: ${bed.bedNo}`);
                                                            // setFormData(prevFormData => ({
                                                            //     ...prevFormData,
                                                            //     wardRID: selectedBed.wardRID,
                                                            //     wardName: selectedBed.wardName,
                                                            //     bedRID: selectedBed.bedRID,
                                                            //     bedNo: selectedBed.bedNo,
                                                            // }));
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
                </FormControl>
            </Box>
        </Box>
    );
};
export default INCOMING;