import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Grid,
  TableCell,
  TableRow,
  Button,
  MenuItem,
  TextField,
  Card,
  Divider,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import SearchComponent from "../../../components/IncrementalSearch";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Girl,
  Margin,
} from "@mui/icons-material";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import ResponseAlert from "../../../components/Alert";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MedicationIcon from "@mui/icons-material/Medication";
import SickIcon from "@mui/icons-material/Sick";
import BiotechIcon from "@mui/icons-material/Biotech";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import PropTypes from "prop-types";

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

const Emr = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const jwtToken = localStorage.getItem("jwtToken");
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseAlert, setShowResponseAlert] = useState(false);
  const [drug, setDrug] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [freqMap, setFreqMap] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [alertKey, setAlertKey] = useState(0);
  const [messageSeverty, setMessageSeverty] = useState("");

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
      `http://10.197.8.17:2023/hmis/api/v1/lab/investigation/${rowData.row.patientRID}/${rowData.row.visitRid}/${searchTerm}`,
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
  const handleCloseAlert = () => {
    setShowResponseAlert(false);
  };
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
  const rowDataString = localStorage.getItem("rowData");
  const rowData = rowDataString ? JSON.parse(rowDataString) : {};
  const history = useNavigate();
  const redirectToMypatient = () => {
    history("/myPatients"); // Redirect to MyPatient page
  };
  const [saveReqBody, setSaveReqBody] = useState({
    patientRID: 0,
    patientUHID: "",
    patientName: "",
    visitRID: 0,
    doctorRID: 0,
    specialtyID: 117718,
    unitRID: 0,
    diagnosis: [],
    preConditions: [],
    problems: [],
    visitNote: [],
    investigationOrder: [],
    drugList: [],
  });

  const handleClick = () => {
    redirectToMypatient();
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
  const handleConsultationDone = () => {
    fetch(
      `http://10.197.8.17:2023/hmis/api/v1/opd/patient/consultation/${rowData.row.visitRid}/${rowData.row.wliRid}`,
      {
        method: "POST",
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
        setResponseMessage(data.message);
        setShowResponseAlert(true);
        redirectToMypatient();
      })
      .catch((error) => {
        console.error("Error in performing Consultation Done:", error);
      });
  };
  const [showTableCell, setshowTableCell] = useState(false);
  const [showTableCell1, setshowTableCell1] = useState(false);
  const [showTableCell2, setshowTableCell2] = useState(false);
  const [showTableCell3, setshowTableCell3] = useState(false);
  const [showTableCell4, setshowTableCell4] = useState(false);
  const [showTableCell5, setshowTableCell5] = useState(false);

  const handleSave = () => {
    saveReqBody.patientRID = rowData.row.patientRID;
    saveReqBody.patientUHID = rowData.row.uhid;
    saveReqBody.patientName = rowData.row.patientName;
    saveReqBody.visitRID = rowData.row.visitRid;
    saveReqBody.doctorRID = rowData.row.visitConsultingDoctor;
    saveReqBody.drugList = selectedDrugs.map((drug) => {
      return {
        drugRID: drug.drugID || "",
        drugName: drug.drugName || "",
        uomIndex: drug.uomIndex || "",
        uomName: drug.uomDesc || "",
        dosageID: drug.dosageID || "",
        dosageName: drug.dosageName || "",
        duration: parseInt(drug.duration) || 0,
        durationUnit: drug.durationUnit || "",
        totalQty: drug.quantity || "",
      };
    });
    saveReqBody.diagnosis = selectedDiagnosises;
    saveReqBody.investigationOrder = selectedInvestigations;
    fetch(`http://10.197.8.17:2023/hmis/api/v1/patient/emr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(saveReqBody),
    })
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
        setResponseMessage(data.message);
        setMessageSeverty("success");
        setShowResponseAlert(true);
        setAlertKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error("Error in Saving Prescriptions:", error);
        setResponseMessage("Error in Saving Prescriptions");
        setShowResponseAlert(true);
        setAlertKey((prevKey) => prevKey + 1);
      });
  };
  return (
    <Box m="10px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="My Patients" />
        {showResponseAlert && (
          <ResponseAlert
            responseMessage={responseMessage}
            onClose={handleCloseAlert} // Close the alert
            key={alertKey} // Add a key to re-render the Alert component
          />
        )}
      </Box>
      <Box gridRow="span 2" backgroundColor={colors.primary[400]}>
        <FormControl fullWidth>
          <Grid container>
            <Grid sx={{ pb: 1, width: "100%" }}>
              <table width={"100%"}>
                <tbody>
                  <TableRow
                    sx={{
                      background: "linear-gradient(180deg, #2262d0, white)",
                    }}
                  >
                    <TableCell sx={{}} onClick={handleClick}>
                      Back
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      UHID: {rowData.row.uhid}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Token Number: {rowData.row.tokenNumber}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Patient Name: {rowData.row.patientName}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Gender: {rowData.row.gender}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>Age: {rowData.row.age}</TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Phone Number: {rowData.row.phoneNo}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Visit Reason: {rowData.row.visitReason}
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>
                      Visit Type: {rowData.row.visitType}
                    </TableCell>
                  </TableRow>
                </tbody>
              </table>
            </Grid>
            <Grid container sx={{ m: 1 }} spacing={0}>
              <Grid item xs={3}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="V"
                  sx={{ borderRight: 1, borderColor: "divider" }}
                  TabIndicatorProps={{ style: { display: 'none' } }}
                >
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #22d0a5, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #22d0a5",
                      textAlign: "left",
                      minHeight: "60px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Known Case Of"
                    style={{ fontSize: "22px" }}
                    icon={<WorkHistoryIcon  />}
                    iconPosition="start"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #d07222, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #d07222",
                      textAlign: "left",
                      minHeight: "60px",
                      marginTop: "15px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Complaints"
                    style={{ fontSize: "22px" ,textAlign: "left",}}
                    icon={<ReportProblemIcon  />}
                    iconPosition="start"
                    {...a11yProps(1)}
                  />
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #87d022, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #87d022",
                      textAlign: "left",
                      minHeight: "60px",
                      marginTop: "15px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Prescription"
                    style={{ fontSize: "22px" }}
                    icon={<MedicationIcon  />}
                    iconPosition="start"
                    {...a11yProps(2)}
                  />
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #8322d0, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #8322d0",
                      textAlign: "left",
                      minHeight: "60px",
                      marginTop: "15px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Diagnosis"
                    style={{ fontSize: "22px" }}
                    icon={<MedicationIcon  />}
                    iconPosition="start"
                    {...a11yProps(3)}
                  />
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #d02222, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #d02222",
                      textAlign: "left",
                      minHeight: "60px",
                      marginTop: "15px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Investigations/Orders"
                    style={{ fontSize: "22px" }}
                    icon={<BiotechIcon  />}
                    iconPosition="start"
                    {...a11yProps(4)}
                  />
                  <Tab
                    sx={{
                      background: "linear-gradient(45deg, #d0bf22, white)",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      borderRight: "4px solid #d0bf22",
                      textAlign: "left",
                      minHeight: "60px",
                      marginTop: "15px",
                      display: "flex", 
                      justifyContent: "flex-start",
                    }}
                    label="Advice"
                    style={{ fontSize: "22px" }}
                    icon={<MapsUgcIcon  />}
                    iconPosition="start"
                    {...a11yProps(5)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={9}>
                <TabPanel value={value} index={0} style={{background:"linear-gradient(180deg, #22d0a570, transparent)",borderRadius:"50px"}}>
                  <Grid item xs={12}>
                    <Item
                      sx={{
                        padding: "10px",
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        borderLeft: "4px solid #22d0a5",
                        borderTop: "1px solid #22d0a5",
                      }}
                    >
                      <TextField
                        sx={{ maxWidth: "90%" }}
                        name="preConditions"
                        onChange={(e) => {
                          if (e.target.value) {
                            const newObj = JSON.stringify({
                              preConditionRemarks: e.target.value,
                            });
                            localStorage.setItem("preConditionRemarks", newObj);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            localStorage.getItem("preConditionRemarks")
                          ) {
                            e.target.value = "";
                            setSaveReqBody(() => ({
                              ...saveReqBody,
                              ...saveReqBody.preConditions.push(
                                JSON.parse(
                                  localStorage.getItem("preConditionRemarks")
                                )
                              ),
                            }));
                            setshowTableCell(true);
                            localStorage.setItem("preConditionRemarks", "");
                          }
                        }}
                        fullWidth
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        label=""
                        variant="standard"
                      />
                    </Item>
                  </Grid>

                  <table
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      marginTop: "15px",
                    }}
                  >
                    {showTableCell && (
                      <thead style={{ border: "none" }}>
                        <tr
                          style={{
                            height: "5px",
                            background:
                              "linear-gradient(359deg, #22d0a5, white)",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {/* <th>Select</th> */}
                          <td align="center" style={{ paddingLeft: "15px" }}>
                            Known Case
                          </td>
                          <td
                            align="center"
                            style={{ paddingLeft: "15px" }}
                          ></td>
                        </tr>
                      </thead>
                    )}
                    <tbody
                      style={{
                        backgroundImage:
                          "linear-gradient(270deg,hsl(165deg 72% 47% / 70%) 0%,hsl(161deg 61% 63% /50%) 10%,hsl(159deg 60% 74%/30%) 20%,hsl(158deg 60% 83%/0%) 30%,hsl(157deg 60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(157deg 60% 92%/0%) 60%,hsl(158deg 60% 83%/10%) 70%,hsl(159deg 60% 74%/30%) 80%,hsl(161deg 61% 63%/50%) 90%,hsl(165deg 72% 47%/70%) 100%)",
                      }}
                    >
                      {saveReqBody.preConditions &&
                        saveReqBody.preConditions.map((preCondition, index) => (
                          <TableRow
                            key={index}
                            sx={{ paddingTop: "5px", paddingBottom: "5px" }}
                          >
                            <TableCell>
                              {preCondition.preConditionRemarks}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  const indexToRemove = index;
                                  setSaveReqBody((prevSaveReqBody) => ({
                                    ...prevSaveReqBody,
                                    preConditions:
                                      prevSaveReqBody.preConditions.filter(
                                        (_, i) => i !== indexToRemove
                                      ),
                                  }));
                                  {
                                    index === 0 && setshowTableCell(false);
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </tbody>
                  </table>
                </TabPanel>
                <TabPanel value={value} index={1} style={{background:"linear-gradient(180deg, #d0722270, transparent)",borderRadius:"50px"}}>
                  <Grid item xs={12}>
                    <Item
                      sx={{
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        borderLeft: "4px solid #d07222",
                        borderTop: "1px solid #d07222",
                      }}
                    >
                      <TextField
                        sx={{ maxWidth: "90%" }}
                        name="problems"
                        onChange={(e) => {
                          if (e.target.value) {
                            const newObj = JSON.stringify({
                              description: e.target.value,
                            });
                            localStorage.setItem("description", newObj);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            localStorage.getItem("description")
                          ) {
                            e.target.value = "";
                            setSaveReqBody(() => ({
                              ...saveReqBody,
                              ...saveReqBody.problems.push(
                                JSON.parse(localStorage.getItem("description"))
                              ),
                            }));
                            setshowTableCell1(true);
                            localStorage.setItem("description", "");
                          }
                        }}
                        fullWidth
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        label=""
                        variant="standard"
                      />
                    </Item>
                  </Grid>

                  <table
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      marginTop: "15px",
                    }}
                  >
                    {showTableCell1 && (
                      <thead>
                        <tr
                          style={{
                            height: "5px",
                            background:
                              "linear-gradient(359deg, #d07222, white)",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {/* <th>Select</th> */}
                          <td align="center" style={{ paddingLeft: "15px" }}>
                            Complaints
                          </td>
                          <td
                            align="center"
                            style={{ paddingLeft: "15px" }}
                          ></td>
                        </tr>
                      </thead>
                    )}
                    <tbody
                      style={{
                        backgroundImage:
                          "linear-gradient(270deg,hsl(28deg 72% 47% / 70%) 0%,hsl(26deg 61% 63% /50%) 10%,hsl(25deg 60% 74%/30%) 20%,hsl(24deg 60% 83%/0%) 30%,hsl(23deg 60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(23deg 60% 92%/0%) 60%,hsl(24deg 60% 83%/10%) 70%,hsl(25deg 60% 74%/30%) 80%,hsl(26deg 61% 63%/50%) 90%,hsl(28deg 72% 47%/70%) 100%)",
                      }}
                    >
                      {saveReqBody.problems &&
                        saveReqBody.problems.map((problems, index) => (
                          <TableRow
                            key={index}
                            sx={{ paddingTop: "5px", paddingBottom: "5px" }}
                          >
                            <TableCell>{problems.description}</TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  const indexToRemove = index;
                                  setSaveReqBody((prevSaveReqBody) => ({
                                    ...prevSaveReqBody,
                                    problems: prevSaveReqBody.problems.filter(
                                      (_, i) => i !== indexToRemove
                                    ),
                                  }));
                                  {
                                    index === 0 && setshowTableCell1(false);
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </tbody>
                  </table>
                </TabPanel>
                <TabPanel value={value} index={2} style={{background:"linear-gradient(180deg, #87d02270, transparent)",borderRadius:"50px"}}>
                  <Grid item xs={12}>
                    <Item
                      sx={{
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        borderLeft: "4px solid #87d022",
                        borderTop: "1px solid #87d022",
                      }}
                    >
                      <SearchComponent
                        variant="standard"
                        onSearch={handlePrescriptionsSearch}
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
                    {searchResults.map((drug) => (
                      <li
                        className="li-hv"
                        key={drug.drugID}
                        onClick={() => handleDrugSelect(drug)}
                      >
                        {drug.drugName}
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
                      {showTableCell2 && (
                        <thead>
                          <tr
                            style={{
                              height: "5px",
                              background:
                                "linear-gradient(359deg, #87d022, white)",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            {/* <th>Select</th> */}
                            <td style={{ width: "20%" }} align="center">
                              Drug Name
                            </td>
                            <td align="center">Drug Type</td>
                            <td align="center">Quantity</td>
                            <td colSpan="4"></td>
                          </tr>
                        </thead>
                      )}
                      <tbody
                        style={{
                          backgroundImage:
                            "linear-gradient(270deg,hsl(85deg 72% 47% / 70%) 0%,hsl(86deg 61% 63% /50%) 10%,hsl(85deg 60% 74%/30%) 20%,hsl(83deg 60% 83%/0%) 30%,hsl(82deg 60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(82deg 60% 92%/0%) 60%,hsl(83deg 60% 83%/10%) 70%,hsl(85deg 60% 74%/30%) 80%,hsl(86deg 61% 63%/50%) 90%,hsl(85deg 72% 47%/70%) 100%)",
                        }}
                      >
                        {renderSelectedDrugs()}
                      </tbody>
                    </table>
                  }
                </TabPanel>
                <TabPanel value={value} index={3} style={{background:"linear-gradient(180deg, #8322d070, transparent)",borderRadius:"50px"}}>
                  <Grid item xs={12}>
                    <Item
                      sx={{
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        borderLeft: "4px solid #8322d0",
                        borderTop: "1px solid #8322d0",
                      }}
                    >
                      <SearchComponent
                        variant="standard"
                        onSearch={handleDiagnosisSearch}
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
                    {diagnosisSearchResults.map((diagnosis) => (
                      <li
                        className="li-hv"
                        key={diagnosis.diagnosisRID}
                        onClick={() => handleDiagnosisSelect(diagnosis)}
                      >
                        {diagnosis.diagnosisName}
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
                      {showTableCell3 && (
                        <thead>
                          <tr
                            style={{
                              height: "5px",
                              background:
                                "linear-gradient(359deg, #8322d0, white)",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            {/* <th>Select</th> */}
                            <td align="center">Diagnosis Code</td>
                            <td align="center">Diagnosis Name</td>
                            <th />
                          </tr>
                        </thead>
                      )}
                      <tbody
                        style={{
                          backgroundImage:
                            "linear-gradient(270deg,hsl(273deg  72% 47% / 70%) 0%,hsl(274deg  61% 63% /50%) 10%,hsl(275deg  60% 74%/30%) 20%,hsl(277deg  60% 83%/0%) 30%,hsl(278deg  60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(278deg  60% 92%/0%) 60%,hsl(277deg  60% 83%/10%) 70%,hsl(275deg  60% 74%/30%) 80%,hsl(274deg  61% 63%/50%) 90%,hsl(273deg  72% 47%/70%) 100%)",
                        }}
                      >
                        {renderSelectedDiagnosises()}
                      </tbody>
                    </table>
                  }
                </TabPanel>
                <TabPanel value={value} index={4} style={{background:"linear-gradient(180deg, #d0222270, transparent)",borderRadius:"50px"}}>
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
                <TabPanel value={value} index={5} style={{background:"linear-gradient(180deg, #d0bf2270, transparent)",borderRadius:"50px"}}>
                  <Grid item xs={12}>
                    <Item
                      sx={{
                        borderTopLeftRadius: "25px",
                        borderBottomLeftRadius: "25px",
                        borderLeft: "4px solid #d0bf22",
                        borderTop: "1px solid #d0bf22",
                      }}
                    >
                      <TextField
                        sx={{ maxWidth: "90%" }}
                        name="visitNote"
                        onChange={(e) => {
                          if (e.target.value) {
                            const newObj = JSON.stringify({
                              visitNote: e.target.value,
                            });
                            localStorage.setItem("visitNote", newObj);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            localStorage.getItem("visitNote")
                          ) {
                            e.target.value = "";
                            setSaveReqBody(() => ({
                              ...saveReqBody,
                              ...saveReqBody.visitNote.push(
                                JSON.parse(localStorage.getItem("visitNote"))
                              ),
                            }));
                            setshowTableCell5(true);
                            localStorage.setItem("visitNote", "");
                          }
                        }}
                        fullWidth
                        size="small"
                        color="secondary"
                        id="outlined-basic"
                        label=""
                        variant="standard"
                      />
                    </Item>
                  </Grid>
                  <table style={{ width: "100%", tableLayout: "fixed",marginTop: "10px" }}>
                    {showTableCell5 && (
                      <thead>
                        <tr
                          style={{
                            height: "5px",
                            background:
                              "linear-gradient(359deg, #d0bf22, white)",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {/* <th>Select</th> */}
                          <td align="center">Advice</td>
                          <td align="center"></td>
                        </tr>
                      </thead>
                    )}
                    <tbody
                      style={{
                        backgroundImage:
                          "linear-gradient(270deg,hsl(54deg 72% 47% / 70%) 0%,hsl(52deg 61% 63% /50%) 10%,hsl(50deg 60% 74%/30%) 20%,hsl(48deg   60% 83%/0%) 30%,hsl(47deg 60% 92%/0%) 40%,hsl(0deg 0% 100%/0%) 50%,hsl(47deg 60% 92%/0%) 60%,hsl(48deg 60% 83%/10%) 70%,hsl(50deg 60% 74%/30%) 80%,hsl(52deg 61% 63%/50%) 90%,hsl(54deg 72% 47%/70%) 100%)",
                      }}
                    >
                      {saveReqBody.visitNote &&
                        saveReqBody.visitNote.map((visitNote, index) => (
                          <TableRow
                            key={index}
                            sx={{ paddingTop: "5px", paddingBottom: "5px" }}
                          >
                            <TableCell
                              sx={{ paddingTop: "5px", paddingBottom: "5px" }}
                            >
                              {visitNote.visitNote}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  const indexToRemove = index;
                                  setSaveReqBody((prevSaveReqBody) => ({
                                    ...prevSaveReqBody,
                                    visitNote: prevSaveReqBody.visitNote.filter(
                                      (_, i) => i !== indexToRemove
                                    ),
                                  }));
                                  {
                                    index === 0 && setshowTableCell5(false);
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </tbody>
                  </table>
                </TabPanel>
              </Grid>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}
      >
        <Button
          sx={{ m: 1 }}
          variant="contained"
          color="secondary"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          sx={{ m: 1 }}
          variant="contained"
          color="secondary"
          onClick={handleConsultationDone}
        >
          Consultation Done
        </Button>
      </Box>
    </Box>
  );
};
export default Emr;
