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
import RECORDDEATH from '../recordDeath';
import ISSUES from '../issues';
import DIAGNOSIS from '../diagnosis';
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));


const HER = (props) => {
    const { bed } = props;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [alertKey, setAlertKey] = useState(0);
    const [unitRid, setUnitRid] = useState(135);
    const [value, setValue] = React.useState(0);
    const [freqMap, setFreqMap] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [showTableHeader, setShowTableHeader] = useState(false);

    const [showTableCell2, setshowTableCell2] = useState(false);
    const [showTableCell3, setshowTableCell3] = useState(false);
    const [showTableCell4, setshowTableCell4] = useState(false);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //Diagnosis
    const [diagnosis, setDiagnosis] = useState({});
    const [selectedDiagnosises, setSelectedDiagnosises] = useState([]);
    const [diagnosisSearchResults, setDiagnosisSearchResults] = useState([]);
    const [showDiagnosisTableHeader, setShowDiagnosisTableHeader] = useState(false);
    const handleDiagnosisSelect = (selectedDiagnosis) => {
        // Check if the Diagnosis is already in the selectedDiagnosises list
        const isDuplicate = selectedDiagnosises.some(
            (diagnosis) => diagnosis.diagnosisRID === selectedDiagnosis.diagnosisRID
        );
        if (isDuplicate) {
            setResponseMessage("Warning: The Diagnosis is already added.");
            setShowResponseAlert(true);
            setAlertKey((prevKey) => prevKey + 1);
        } else {
            // const newNetAmount = saveForm.netAmount + (selectedService.servicePrice - selectedService.discountAmount);
            // const newGrossAmount = saveForm.grossAmount + selectedService.servicePrice;
            // const newTotalDiscountAmount = saveForm.totalDiscountAmount + selectedService.discountAmount;
            // const serviceGrossAmount = selectedService.servicePrice;

            // setSaveForm((prevSaveForm) => ({
            //   ...prevSaveForm,
            //   grossAmount: newGrossAmount,
            //   netAmount: newNetAmount,
            //   totalDiscountAmount: newTotalDiscountAmount,
            //   serviceGrossAmount: serviceGrossAmount
            // }));
            // setSelectedServices((prevSelectedServices) => [
            //   ...prevSelectedServices,
            //   {
            //     ...selectedService,
            //     serviceQty: 1,
            //     amount: selectedService.servicePrice - selectedService.discountAmount
            //   }
            // ]);
            setSelectedDiagnosises((prevSelectedDiagnosises) => [
                ...prevSelectedDiagnosises,
                {
                    diagnosisRID: selectedDiagnosis.diagnosisRID,
                    diagnosisName: selectedDiagnosis.diagnosisName,
                    diagnosisICDCode: selectedDiagnosis.diagnosisCode,
                },
            ]);
            setDiagnosisSearchResults([]);
            setShowDiagnosisTableHeader(true);
            setshowTableCell3(true);
        }
    };
    const handleDiagnosisSearch = (searchTerm) => {
        //fetching Diagnosis based on input data.
        fetch(
            `http://10.197.8.17:2023/hmis/api/v1/diagnosis/custom/${searchTerm}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                const filteredResults = data.filter((diagnosis) =>
                    diagnosis.diagnosisName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
                setDiagnosisSearchResults(filteredResults);
            })
            .catch((error) => {
                console.error("Error fetching Diagnosis.", error);
            });
    };
    const handleRemoveDiagnosis = (indexToRemove) => {
        setSelectedDiagnosises((prevSelectedDiagnosises) =>
            prevSelectedDiagnosises.filter((_, index) => index !== indexToRemove)
        );
        {
            indexToRemove === 0 && setshowTableCell3(false);
        }
        if (selectedDiagnosises.length === 1) {
            setShowDiagnosisTableHeader(false);
        }
    };
    const renderSelectedDiagnosises = () => {
        return selectedDiagnosises.map((selectedDiagnosis, index) => (
            <TableRow sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedDiagnosis.diagnosisCode}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedDiagnosis.diagnosisName}
                </TableCell>
                <TableCell
                    sx={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveDiagnosis(index)}
                    >
                        Remove
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    //Investigations
    const [investigation, setInvestigation] = useState({});
    const [selectedInvestigations, setSelectedInvestigations] = useState([]);
    const [investigationSearchResults, setInvestigationSearchResults] = useState(
        []
    );
    const [showInvestigationTableHeader, setShowInvestigationTableHeader] =
        useState(false);
    const handleInvestigationSelect = (selectedInvestigation) => {
        // Check if the Investigation is already in the selectedinvestigations list
        const isDuplicate = selectedInvestigations.some(
            (investigation) =>
                investigation.serviceRID === selectedInvestigation.serviceRID
        );
        if (isDuplicate) {
            setResponseMessage("Warning: The Investigation is already added.");
            setShowResponseAlert(true);
            setAlertKey((prevKey) => prevKey + 1);
        } else {
            // const newNetAmount = saveForm.netAmount + (selectedService.servicePrice - selectedService.discountAmount);
            // const newGrossAmount = saveForm.grossAmount + selectedService.servicePrice;
            // const newTotalDiscountAmount = saveForm.totalDiscountAmount + selectedService.discountAmount;
            // const serviceGrossAmount = selectedService.servicePrice;

            // setSaveForm((prevSaveForm) => ({
            //   ...prevSaveForm,
            //   grossAmount: newGrossAmount,
            //   netAmount: newNetAmount,
            //   totalDiscountAmount: newTotalDiscountAmount,
            //   serviceGrossAmount: serviceGrossAmount
            // }));
            // setSelectedServices((prevSelectedServices) => [
            //   ...prevSelectedServices,
            //   {
            //     ...selectedService,
            //     serviceQty: 1,
            //     amount: selectedService.servicePrice - selectedService.discountAmount
            //   }
            // ]);
            setSelectedInvestigations((prevSelectedInvestigations) => [
                ...prevSelectedInvestigations,
                {
                    serviceRID: selectedInvestigation.serviceRID,
                    serviceName: selectedInvestigation.serviceName,
                    serviceCategory: 1,
                    serviceCode: selectedInvestigation.serviceCode,
                    orderID: 0,
                },
            ]);
            setInvestigationSearchResults([]);
            setShowInvestigationTableHeader(true);
            setshowTableCell4(true);
        }
    };
    const handleInvestigationSearch = (searchTerm) => {
        //fetching Investigation based on input data.
        fetch(
            `http://10.197.8.17:2023/hmis/api/v1/lab/investigation/${bed.patRID}/${bed.visitRID}/${searchTerm}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                const filteredResults = data.filter((investigation) =>
                    investigation.serviceName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
                setInvestigationSearchResults(filteredResults);
            })
            .catch((error) => {
                console.error("Error fetching Investigation.", error);
            });
    };
    const handleRemoveInvestigation = (indexToRemove) => {
        setSelectedInvestigations((prevSelectedInvestigations) =>
            prevSelectedInvestigations.filter((_, index) => index !== indexToRemove)
        );
        {
            indexToRemove === 0 && setshowTableCell4(false);
        }
        if (selectedInvestigations.length === 1) {
            setShowInvestigationTableHeader(false);
        }
    };
    const renderSelectedInvestigations = () => {
        return selectedInvestigations.map((selectedInvestigation, index) => (
            <TableRow sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedInvestigation.serviceCode}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedInvestigation.serviceName}
                </TableCell>
                <TableCell
                    sx={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveInvestigation(index)}
                    >
                        Remove
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };
    //Prescriptions
    const handlePrescriptionsSearch = (searchTerm) => {
        //fetching prescribed drug based on input data.
        fetch(
            `http://10.197.8.17:2023/hmis/api/v1/prescription/drug/${searchTerm}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setFreqMap(data.frequency);
                const filteredResults = data.drugDetails.filter((drug) =>
                    drug.drugName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSearchResults(filteredResults);
            })
            .catch((error) => {
                console.error("Error fetching prescribed drug", error);
            });
    };
    const handleDrugSelect = (selectedDrug) => {
        // Check if the drug is already in the selectedDrugs list
        const isDuplicate = selectedDrugs.some(
            (drug) => drug.drugID === selectedDrug.drugID
        );
        const isSotockAvilable = selectedDrug.stockAvailable;
        if (isDuplicate) {
            setResponseMessage("Warning: The drug is already added.");
            setShowResponseAlert(true);
            setAlertKey((prevKey) => prevKey + 1);
        } else if (!isSotockAvilable) {
            setResponseMessage("Warning: Stock not avilable for the selected drug.");
            setShowResponseAlert(true);
            setAlertKey((prevKey) => prevKey + 1);
        } else {
            // Set the "Days" option as the default durationUnit
            selectedDrug.durationUnit = "1";
            // Add the selected drug to the list
            setSelectedDrugs((prevSelectedDrugs) => [
                ...prevSelectedDrugs,
                { ...selectedDrug, quantity: 1, prescriptionID: 0 },
            ]);
            setSearchResults([]);
            setShowTableHeader(true);
            setshowTableCell2(true);
        }
    };
    const renderSelectedDrugs = () => {
        return selectedDrugs.map((selectedDrug, index) => (
            <TableRow key={index} sx={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedDrug.drugName}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                    {selectedDrug.uomDesc}
                </TableCell>
                <TableCell
                    sx={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px" }}
                >
                    <TextField
                        type="number"
                        sx={{ textAlign: "center" }} // This line sets text alignment to center
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        variant="outlined"
                        value={selectedDrug.quantity || ""}
                        onChange={(e) =>
                            setSelectedDrugs((prevSelectedDrugs) => {
                                const updatedSelectedDrugs = [...prevSelectedDrugs];
                                updatedSelectedDrugs[index].quantity = e.target.value;
                                return updatedSelectedDrugs;
                            })
                        }
                    />
                </TableCell>
                <TableCell
                    sx={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px" }}
                >
                    <TextField
                        select
                        sx={{ textAlign: "center", width: "100%" }}
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        variant="outlined"
                        label="Frequency"
                        value={selectedDrug.dosageID || ""}
                        onChange={(e) =>
                            setSelectedDrugs((prevSelectedDrugs) => {
                                const updatedSelectedDrugs = [...prevSelectedDrugs];
                                updatedSelectedDrugs[index].dosageID = e.target.value;
                                const dosageName = freqMap.filter(
                                    (item) => item.rmRID === e.target.value
                                );
                                updatedSelectedDrugs[index].dosageName = dosageName[0].rmName;
                                return updatedSelectedDrugs;
                            })
                        }
                    >
                        {freqMap &&
                            freqMap.map((freq) => (
                                <MenuItem key={freq.rmRID} value={freq.rmRID}>
                                    {freq.rmName}
                                </MenuItem>
                            ))}
                    </TextField>
                </TableCell>
                <TableCell
                    sx={{
                        textAlign: "center",
                        paddingRight: "1px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                    }}
                >
                    <TextField
                        sx={{ textAlign: "center" }}
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        variant="outlined"
                        label="For"
                        value={selectedDrug.duration || 0}
                        onChange={(e) =>
                            setSelectedDrugs((prevSelectedDrugs) => {
                                const updatedSelectedDrugs = [...prevSelectedDrugs];
                                updatedSelectedDrugs[index].duration = e.target.value;
                                return updatedSelectedDrugs;
                            })
                        }
                    ></TextField>
                </TableCell>
                <TableCell
                    sx={{
                        textAlign: "center",
                        paddingLeft: "0px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                    }}
                >
                    <TextField
                        select
                        sx={{ textAlign: "center" }}
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        variant="outlined"
                        defaultValue={"Days"}
                        value={selectedDrug.durationUnit || selectedDrug[1]}
                        onChange={(e) =>
                            setSelectedDrugs((prevSelectedDrugs) => {
                                const updatedSelectedDrugs = [...prevSelectedDrugs];
                                updatedSelectedDrugs[index].durationUnit = e.target.value;
                                return updatedSelectedDrugs;
                            })
                        }
                    >
                        <MenuItem value="1">Day(s)</MenuItem>
                        <MenuItem value="2">Week(s)</MenuItem>
                        <MenuItem value="3">Month(s)</MenuItem>
                        <MenuItem value="4">Year(s)</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell
                    sx={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveDrug(index)}
                    >
                        Remove
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };
    const handleRemoveDrug = (indexToRemove) => {
        setSelectedDrugs((prevSelectedDrugs) =>
            prevSelectedDrugs.filter((_, index) => index !== indexToRemove)
        );
        {
            indexToRemove === 0 && setshowTableCell2(false);
        }
        if (selectedDrugs.length === 1) {
            setShowTableHeader(false);
        }
    };
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center"
                sx={{ p: 1, backgroundColor: '#8796CC' }}>
                <Typography fontWeight='bold'>{bed.patientName}</Typography>
                <Typography fontWeight='bold'>{bed.patientMRN}</Typography>
                <Typography fontWeight='bold'>{bed.patGender}</Typography>
                <Typography fontWeight='bold'>{bed.age}&nbsp;{bed.ageUnit}</Typography>
                <Typography fontWeight='bold'>{bed.staffName}</Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    sx={{ width: '100%', display: 'flex' }}
                >
                    <Tab label="Diagnosis" {...a11yProps(0)} sx={{ flexGrow: 1 }} />
                    <Tab label="Orders" {...a11yProps(1)} sx={{ flexGrow: 1 }} />
                    <Tab label="Issues" {...a11yProps(2)} sx={{ flexGrow: 1 }} />
                    <Tab label="Discharge" {...a11yProps(3)} sx={{ flexGrow: 1 }} />
                    <Tab label="Record Death" {...a11yProps(4)} sx={{ flexGrow: 1 }} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} style={{ background: "linear-gradient(180deg, #8322d070, transparent)", borderRadius: "50px" }}>
                <DIAGNOSIS bed={bed}></DIAGNOSIS>
            </TabPanel>
            <TabPanel value={value} index={1} style={{ background: "linear-gradient(180deg, #d0222270, transparent)", borderRadius: "50px" }}>
                <Grid item xs={12}>
                    <Item
                        sx={{
                            borderTopLeftRadius: "25px",
                            borderBottomLeftRadius: "25px",
                            borderLeft: "4px solid #d02222",
                            borderTop: "1px solid #d02222",
                        }}
                    >
                        <SearchComponent
                            variant="standard"
                            onSearch={handleInvestigationSearch}
                            label=""
                        />
                    </Item>
                </Grid>
                <ul
                    style={{
                        marginBlockStart: "0px",
                        cursor: "pointer",
                        position: "absolute",
                        background: "linear-gradient(45deg, #FFC107, #ffffff)",
                        border: "2px solid white",
                        borderRadius: "10px",
                        left: "50%",
                        zIndex: 99,
                        paddingLeft: "10px",
                    }}
                >
                    {investigationSearchResults.map((investigation) => (
                        <li
                            className="li-hv"
                            key={investigation.serviceRID}
                            onClick={() => handleInvestigationSelect(investigation)}
                        >
                            {investigation.serviceName}
                        </li>
                    ))}
                </ul>
                {
                    <table
                        style={{
                            width: "100%",
                            tableLayout: "fixed",
                            marginTop: "15px",
                        }}
                    >
                        {showTableCell4 && (
                            <thead>
                                <tr
                                    style={{
                                        height: "5px",
                                        background:
                                            "linear-gradient(359deg, #d02222, white)",
                                        color: "rgba(0, 0, 0, 0.6)",
                                    }}
                                >
                                    {/* <th>Select</th> */}
                                    <td align="center">Investigation Code</td>
                                    <td align="center">Investigation Name</td>
                                    <td></td>
                                </tr>
                            </thead>
                        )}
                        <tbody
                            style={{
                                backgroundImage:
                                    "linear-gradient(270deg,hsl(0deg  72% 47% / 70%) 0%,hsl(7deg  61% 63% /50%) 10%,hsl(9deg  60% 74%/30%) 20%,hsl(9deg  60% 83%/0%) 30%,hsl(10deg  60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(10deg  60% 92%/0%) 60%,hsl(9deg  60% 83%/10%) 70%,hsl(7deg  60% 74%/30%) 80%,hsl(7deg  61% 63%/50%) 90%,hsl(0deg  72% 47%/70%) 100%)",
                            }}
                        >
                            {renderSelectedInvestigations()}
                        </tbody>
                    </table>
                }
            </TabPanel>
            <TabPanel value={value} index={2} style={{ background: "linear-gradient(180deg, #8322d070, transparent)", borderRadius: "50px" }}>
                <ISSUES bed={bed}></ISSUES>
            </TabPanel>
            <TabPanel value={value} index={3} style={{ background: "linear-gradient(180deg, #87d02270, transparent)", borderRadius: "50px" }}>
                <Divider textAlign="left" variant="middle"
                    sx={{
                        "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                    }}>
                    Mark For Discharge
                </Divider>
                <Grid container alignItems="center" sx={{ p: 1 }}>
                    <Typography>Discharge Turnaround Time: &nbsp;&nbsp;&nbsp;</Typography>
                    <Grid item>
                        <TextField
                            sx={{ paddingRight: 1 }}
                            required
                            fullWidth size='small' color="secondary" id="outlined-basic"
                            label="dd/mm/yyyy"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            sx={{ paddingRight: 1 }}
                            required
                            fullWidth size='small' color="secondary" id="outlined-basic"
                            label="hr[23]:mm"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                <Divider textAlign="left" variant="middle"
                    sx={{
                        "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                    }}>
                    Discharge
                </Divider>
                <Grid container alignItems="center" sx={{ p: 1 }}>
                    <Grid xs={5} item sx={{ mr: 7 }}>
                        <TextField
                            sx={{}}
                            fullWidth
                            required
                            select
                            size='small' color="secondary" id="outlined-basic"
                            label="Discharge reason"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={5} item sx={{ ml: 7 }}>
                        <TextField
                            sx={{}}
                            fullWidth
                            select
                            size='small' color="secondary" id="outlined-basic"
                            label="Advised by"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                {/* <Divider textAlign="left" variant="middle"
                    sx={{
                        "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                    }}>ABC</Divider> */}
                <Divider textAlign="left" variant="middle"
                    sx={{ p: 1, borderColor: '#3da58a' }} />
                <Grid container alignItems="center" sx={{ p: 1, pt: 2 }}>
                    <Grid xs={5} item sx={{ mr: 7 }}>
                        <TextField
                            sx={{}}
                            select
                            fullWidth size='small' color="secondary" id="outlined-basic"
                            label="Referral Type"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={5} item sx={{ ml: 7 }}>
                        <TextField
                            sx={{}}
                            fullWidth size='small' color="secondary" id="outlined-basic"
                            label="Referred To"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={5} item sx={{ pt: 1 }}>
                        <TextField
                            sx={{}}
                            select
                            fullWidth size='small' color="secondary" id="outlined-basic"
                            label="Referral Reasons"
                            variant="outlined"
                        // value={uhidToSearch}
                        // onChange={(e) => setUhidToSearch(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                <Divider textAlign="left" variant="middle"
                    sx={{ p: 1, borderColor: '#3da58a' }} />

            </TabPanel>
            <TabPanel value={value} index={4} style={{ background: "linear-gradient(180deg, #8322d070, transparent)", borderRadius: "50px" }}>
                <RECORDDEATH bed={bed}></RECORDDEATH>
            </TabPanel>
        </Box>
    );
};

export default HER;