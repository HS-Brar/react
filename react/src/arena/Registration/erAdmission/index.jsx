import { Paper, Divider, Box, Button, useTheme, FormControl, TextField, Grid, MenuItem, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { styled } from '@mui/material/styles';
import Header from "../../../components/Header";
import { Person2 } from "@mui/icons-material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import ResponseAlert from '../../../components/Alert';
import JasperReport from "../../../components/JasperReport";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Popup from "../../../components/Popup";
import { DataGrid } from "@mui/x-data-grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const ErAdmission = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const visitType = "61003";
  const currentDate = dayjs();
  const [uhid, setUhid] = useState('');
  const [patName, setPatName] = useState('');
  const [masterData, setMasterData] = useState({});
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [btnName, setBtnName] = useState("LAST ER VISIT");
  const jwtToken = localStorage.getItem("jwtToken");
  const [responseMessage, setResponseMessage] = useState('');
  const [messageSeverty, setMessageSeverty] = useState('')
  const [showResponseAlert, setShowResponseAlert] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [uhidToSearch, setUhidToSearch] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [phoneNumPopup, setPhoneNumPopup] = useState(false);
  const [phoneNumPopupTableData, setPhoneNumPopupTableData] = useState("");
  const [uidPopup, setUidPopup] = useState(false);
  const [uidPopupTableData, setUidPopupTableData] = useState("");

  //Column Defination for phoneNumPopup
  const phoneNumPopupColumn = [
    {
      field: "uhid",
      headerName: "UHID",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      cellClassName: "name-column--cell",
    },
    {
      field: "patientName",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //     field: "age",
    //     headerName: "Age",
    //     headerAlign: "center",
    //     align: "center",
    //     flex: 1,
    // },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];
  //Column Defination for uidPopup
  const uidPopupColumn = [
    {
      field: "uhid",
      headerName: "UHID",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      cellClassName: "name-column--cell",
    },
    {
      field: "patientName",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //     field: "age",
    //     headerName: "Age",
    //     headerAlign: "center",
    //     align: "center",
    //     flex: 1,
    // },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];
  const [regFees, setRegFees] = useState(5);
  const [formData, setFormData] = useState({
    "patUHID": "",
    "patientRID": 0,
    "uid": "",
    "mobile": "",
    "firstName": "",
    "lastName": "",
    "genderID": 0,
    "dob": "",
    "maritalID": 0,
    "stateID": 0,
    "districtID": 0,
    "cityID": 0,
    "address": "",
    "patientCategoryID": 0,
    "patientSchemeID": 0,
    "visitReasonID": 0,
    "specialityID": 0,
    "consultingDoctorRID": 0,
    "referralTypeID": 0,
    "referredBy": 0,
    "documentID": 0,
    "referenceCardNumber": "",
    "patientTitleID": 0,
    "relationshipID": 0,
    "relativeName": "",
    "postalCode": "",
    "visitRID": 0,
    "broughtByID": 0,
    "residentOfHaryana": 0,
    "visitSubType": 61003,
    "broughtRemarks": "",
    "policeIOName": "",
    "policeStationName": "",
    "policePostalName": "",
    "policeId": "",
    "visitSequenceNo": 0,
    "serviceID": 0,
    "serviceFee": 0
  });

  useEffect(() => {
    fetch('http://10.197.8.17:2023/hmis/api/v1/opd/masterData', {
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
        setMasterData(data);
        setDefaultValues(data);
      })
      .catch((error) => {
        console.error('Error fetching  master data:', error);
      });
  }, []);
  useEffect(() => {
    if (uhidToSearch !== '' && uhidToSearch.length >=12) {
      handleSearch();
    }
  }, [uhidToSearch]);
  const setDefaultValues = (data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      stateID: "20112", //haryana
      districtID: "117007", //karnal
      genderID: "1",//Male
      patientCategoryID: "117659",//General
      patientSchemeID: "140224",//MMIY
      serviceFee: data.serviceFee,//service fee
      serviceID: data.serviceRID, //serviceRID
    }));
    setDistrictList(data.districtList.filter((dst) => dst.stateID === "20112"));
    setCityList(data.cityList.filter((cty) => cty.districtID === 117007));
  }
  const handleSave = (formData) => {
    formData.visitSubType = 61003;
    console.log("Data to Save :", formData);
    fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/register-emergecy-patient`, {
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
            setResponseMessage(errorData.message);
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
        localStorage.setItem("patientRID", data.patientRID);
        localStorage.setItem("visitRID", data.visitRID);
        console.log(data.message);
        // history(`/JasperReport?patientRID=${data.patientRID}&visitRID=${data.visitRID}`); 
      })
      .catch((error) => {
        console.error('Error in OP registration:', error);
      });
    const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
      clearedData[field] = '';
      return clearedData;
    }, {})
    setFormData(clearedFormData);
    setShowPrintSlip(false);
    setDefaultValues(masterData);
    setIsSaveButtonDisabled(true);
  };
  const generalValidations = (e) => {
    if ((formData.genderID === "1" && e.target.name === "specialityID" && e.target.value === 117719)
      || (formData.specialityID === 117719 && e.target.name === "genderID" && e.target.value === "1")) {
      setResponseMessage(`Obstetrics and Gynaecology is applicable for Female patient! (${Date.now()})`);
      setMessageSeverty("warning");
      setShowResponseAlert(true);
      return false;
    }
    if ((formData.genderID === "1" && e.target.name === "patientCategoryID" && e.target.value === 118481)
      || (formData.patientCategoryID === 118481 && e.target.name === "genderID" && e.target.value === "1")) {
      setResponseMessage(`Antenatal is applicable for Female patient! (${Date.now()})`);
      setMessageSeverty("warning");
      setShowResponseAlert(true);
      return false;
    }
    if ((formData.genderID === "1" && e.target.name === "patientCategoryID" && e.target.value === 119676)
      || (formData.patientCategoryID === 119676 && e.target.name === "genderID" && e.target.value === "1")) {
      setResponseMessage(`Postnatal is applicable for Female patient! (${Date.now()})`);
      setMessageSeverty("warning");
      setShowResponseAlert(true);
      return false;
    }
    if ((e.target.name === "patientCategoryID" && e.target.value === 140087) && (currentDate.diff(dayjs(formData.dob, 'DD-MM-YYYY').format('YYYY-MM-DD'), 'day') > 365)) {
      setResponseMessage(`Patient age is greater than 1 year! (${Date.now()})`);
      setMessageSeverty("warning");
      setShowResponseAlert(true);
      return false;
    }
    if ((e.target.name === "patientCategoryID" && (e.target.value === 118481 || e.target.value === 119676))
      &&
      (currentDate.diff(dayjs(formData.dob, 'DD-MM-YYYY').format('YYYY-MM-DD'), 'day') < 3650 ||
        currentDate.diff(dayjs(formData.dob, 'DD-MM-YYYY').format('YYYY-MM-DD'), 'day') > 18250)) {
      setResponseMessage(`Patient age is Invalid for Antenatal, Postnatal Category! (${Date.now()})`);
      setMessageSeverty("warning");
      setShowResponseAlert(true);
      return false;
    }


    // if (currentDate.diff(dayjs(formData.dob, 'DD-MM-YYYY').format('YYYY-MM-DD'), 'day') < 365 && e.target.name === "patientCategoryID" && e.target.value === 140087){
    //   formData.specialityID ="117722";
    //   // setFormData((prevFormData) => ({
    //   //   ...prevFormData,
    //   //   specialityID: "117722",//Paediatrics
    //   // }));
    //  // return false;
    // }else{
    //   formData.specialityID ="117718";
    // }
    return true; // Return true if all validations pass
  };
  const onChange = (e) => {
    if (!generalValidations(e)) {
      return false;
    }

    if (e.target.name === "stateID") {
      const stateID = masterData.statesList.find(st => st.stateID === e.target.value).stateID;
      setFormData((prevFormData) => ({
        ...prevFormData,
        districtID: "",
        cityID: ""
      }));
      setCityList();
      setDistrictList(masterData.districtList.filter((dst) => dst.stateID === stateID));
    }
    if (e.target.name === "districtID") {
      const districtID = masterData.districtList.find(dst => dst.districtID === e.target.value).districtID;
      setFormData((prevFormData) => ({
        ...prevFormData,
        cityID: ""
      }));
      setCityList(masterData.cityList.filter((cty) => cty.districtID === parseInt(districtID)));
    }
    if (e.target.name === "specialityID") {
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
          setDocList(data);
        })
        .catch((error) => {
          console.error('Error fetching doctor data:', error);
        });
    }
    setFormData(() => ({
      ...formData,
      [e.target.name]: e.target.value
    }));
    return true;
  };

  const handleLastErVisit = () => {

    const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
      clearedData[field] = '';
      return clearedData;
    }, {})
    setFormData(clearedFormData);

    fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patientVisit/${visitType}`, {
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
        setUhid(data.patMrn);
        setPatName(data.firstName + " " + data.lastName);
        const stateID = masterData.statesList.find(st => st.stateID === (data.stateID).toString()).stateID;
        setDistrictList(masterData.districtList.filter((dst) => dst.stateID === stateID));

        const districtID = masterData.districtList.find(dst => dst.districtID === (data.districtID).toString()).districtID;
        setCityList(masterData.cityList.filter((cty) => (cty.districtID).toString() === districtID));

        //fetching doctors based on specialityID
        fetch(`http://10.197.8.17:2023/hmis/api/v1/speciality/${data.specialityID}/doctors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data) => {
            setDocList(data);
          })
          .catch((error) => {
            console.error('Error fetching doctor data:', error);
          });
        localStorage.setItem("patientRID", data.patientRID);
        localStorage.setItem("visitRID", data.visitRID);
      })
      .catch((error) => {
        console.error('Error fetching patient last visit data:', error);
      });

  };
  const handleSearch = () => {
    fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patient/revisit/search/${uhidToSearch}`, {
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
        setIsSaveButtonDisabled(false);
        setFormData(data);
        const stateID = masterData.statesList.find(st => st.stateID === (data.stateID).toString()).stateID;
        setDistrictList(masterData.districtList.filter((dst) => dst.stateID === stateID));

        const districtID = masterData.districtList.find(dst => dst.districtID === (data.districtID).toString()).districtID;
        setCityList(masterData.cityList.filter((cty) => (cty.districtID).toString() === districtID));

        //fetching doctors based on specialityID
        fetch(`http://10.197.8.17:2023/hmis/api/v1/speciality/${data.specialityID}/doctors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data) => {
            setDocList(data);
          })
          .catch((error) => {
            console.error('Error fetching doctor data:', error);
          });
      })
      .catch((error) => {
        setUhidToSearch('');
        const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
          clearedData[field] = '';
          return clearedData;
        }, {})
        setFormData(clearedFormData);
        console.error(`Error fetching  patient with UHID = ${uhidToSearch}`, error);
      });
  }
  const handleRegFees = (patientCategoryID, patientSchemeID) => {

    //console.log(localStorage.getItem("patientRID"));
    const patientRID = (localStorage.getItem("patientRID")) ? localStorage.getItem("patientRID") : 0;

    fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patient/registration/fee?patientRID=${patientRID}&patientCategoryID=${patientCategoryID}&patientSchemeID=${patientSchemeID}&visitSubType=61003`, {
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
        setFormData((prevFormData) => ({
          ...prevFormData,
          serviceFee: data.regFeeAmount,
          serviceID: data.regFeeID,
        }));
      })
      .catch((error) => {
        console.error('Error fetching patient last visit data:', error);
      });
  };

  return (
    <Box m="10px" >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Emergency Admission" />
        {showPrintSlip && <JasperReport title=" Emergency Registration" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/opd/register/${localStorage.getItem("patientRID")}/${localStorage.getItem("visitRID")}/print`} />}
        {showResponseAlert && <ResponseAlert responseMessage={responseMessage} />}
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
              setUhidToSearch("");
              setShowPrintSlip(false);
              if (btnName === "LAST ER VISIT") {
                setBtnName("NEW ER VISIT");

                handleLastErVisit();
              } else {
                setUhid("");
                setPatName("");
                setBtnName("LAST ER VISIT");
                const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
                  clearedData[field] = '';
                  return clearedData;
                }, {});
                setFormData(clearedFormData);
              }
            }
            }
          >
            <Person2 sx={{ mr: "10px" }} />
            {btnName}
          </Button>
        </Box>
      </Box>

      {/* ROW 2 */}
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <Grid xs={12} container alignItems="center" sx={{ paddingTop: 1, paddingLeft: 3, paddingBottom: 2 }}>
          <TextField
            sx={{ ml: 1, width: "21.2%" }}
            fullWidth size='small' color="secondary" id="outlined-basic"
            label="Enter UHID To Search"
            variant="outlined"
            value={uhidToSearch}
            onChange={(e) => setUhidToSearch(e.target.value)}
          >
          </TextField>
          <Button
            sx={{
              marginLeft: 6,
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px,20px",
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Typography sx={{ ml: 1, fontWeight: '550' }}>
            {uhid}&nbsp;&nbsp;&nbsp;&nbsp;{patName}
          </Typography>
        </Grid>
        <Divider textAlign="left" variant="middle"
          sx={{
            borderColor: "#3da58a",
            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
          }}>Patient Demographics
        </Divider>
        <FormControl fullWidth >
          <Grid xs={12} container >
            <Grid xs={3} item sx={{ p: 3, pb: 0 }}>
              <item >
                <TextField
                  onBlur={(e) => {
                    if (!(/^[0-9]+$/.test(e.target.value) && e.target.value.length === 12)) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                      //fetch call for http://10.197.8.17:2023/hmis/api/v1/opd/patient/search
                      const reqBody =
                      {
                        "mobile": "",
                        "firstName": "",
                        "lastName": "",
                        "genderID": 0,
                        "dob": "",
                        "aadharCardNo": formData.uid,
                        "age": "",
                        "ageUnit": 0,
                        "visited": 0,
                        "visitedAgo": 0,
                        "uhid": ""
                      };
                      fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patient/search`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${jwtToken}`
                        },
                        body: JSON.stringify(reqBody)
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
                          console.log(`Existing Patient with ${formData.uid} uid`, data);
                          if (data.length > 0) {
                            setUidPopupTableData(data);
                            setUidPopup(true);
                          }
                        })
                        .catch((error) => {
                          console.error('Error fetching Patient with same uid:', error);
                        });
                    }
                  }}
                  sx={{ m: 1 }}
                  name="uid"
                  onChange={onChange}
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="UID"
                  variant="outlined"
                  value={formData.uid}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' ||
                      e.key === 'Delete' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Home' ||
                      e.key === 'End'
                    ) {
                      return;
                    }
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  error={(formData.uid == "") ? false :
                    !(
                      /^[0-9]+$/.test(formData.uid) && // Validation 1: Must accept only numeric values.
                      formData.uid.length === 12    // Validation 2: Must have exactly 12 digits.
                    )
                  }
                  inputProps={{ inputMode: 'numeric', maxLength: 12 }}
                  helperText={
                    ((formData.uid != "") && !(/^[0-9]+$/.test(formData.uid) &&
                      formData.uid.length === 12 &&
                      formData.uid.length <= 12
                    )) ? "Incorrect Entry" : ""
                  }>
                </TextField>
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="genderID"
                  required select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Gender"
                  variant="outlined"
                  value={parseInt(formData.genderID) || ""}>
                  {masterData.genderList &&
                    masterData.genderList.map((option) => (
                      <MenuItem key={option.genderID} value={option.genderID}>
                        {option.genderName}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  sx={{ m: 1 }}
                  onChange={(e) => {
                    if (onChange(e)) {
                      handleRegFees(formData.patientCategoryID, e.target.value);
                    }
                  }}
                  name="patientSchemeID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Scheme"
                  variant="outlined"
                  value={parseInt(formData.patientSchemeID) || ""}>
                  {masterData.patientSchemeList &&
                    masterData.patientSchemeList.map((option) => (
                      <MenuItem key={option.patientSchemeID} value={option.patientSchemeID}>
                        {option.patientSchemeName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3, pb: 0 }}>
              <item>
                <TextField
                  onBlur={(e) => {
                    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                      //fetch call for http://10.197.8.17:2023/hmis/api/v1/opd/patient/search
                      const reqBody =
                      {
                        "mobile": formData.mobile,
                        "firstName": "",
                        "lastName": "",
                        "genderID": 0,
                        "dob": "",
                        "aadharCardNo": "",
                        "age": "",
                        "ageUnit": 0,
                        "visited": 0,
                        "visitedAgo": 0,
                        "uhid": ""
                      };
                      fetch(`http://10.197.8.17:2023/hmis/api/v1/opd/patient/search`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${jwtToken}`
                        },
                        body: JSON.stringify(reqBody)
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
                          console.log(`Existing Patient with ${formData.mobile} mobile`, data);
                          if (data.length > 0) {
                            setPhoneNumPopupTableData(data);
                            setPhoneNumPopup(true);
                          }
                        })
                        .catch((error) => {
                          console.error('Error fetching Patient with same mobile number:', error);
                        });
                      //uhidToSearch 
                      //call function handleSearch()
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="mobile"
                  fullWidth
                  size='small'
                  color="secondary"
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  value={formData.mobile}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' ||
                      e.key === 'Delete' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Home' ||
                      e.key === 'End'
                    ) {
                      return;
                    }
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                  error={
                    formData.mobile !== "" &&
                    (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile))
                  }
                  helperText={
                    formData.mobile !== ""
                      ? formData.mobile.length !== 10
                        ? 'Phone number must be 10 digits.'
                        : !/^\d+$/.test(formData.mobile)
                          ? 'Phone number must contain only numbers.'
                          : ''
                      : ''
                  }
                >
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx={{ m: 1, mt: 0.6, ml: 1.15, pt: 0.4, width: '100%' }}>
                    <DatePicker
                      label="Age"
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{ m: 0, p: 0 }}
                      value={formData.dob ? dayjs(formData.dob, 'DD/MM/YYYY') : null}
                      onChange={(newValue) => {
                        const newDate = newValue ? newValue.format('DD/MM/YYYY') : '';
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          'dob': newDate,
                        }));
                      }}
                      format="DD-MM-YYYY"
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <TextField sx={{ m: 1 }}
                  onChange={onChange}
                  name="maritalID"
                  select
                  fullWidth
                  size='small'
                  color="secondary"
                  id="outlined-basic"
                  label="Marital Status"
                  variant="outlined"
                  value={parseInt(formData.maritalID) || ""}>
                  {masterData.maritalList &&
                    masterData.maritalList.map((option) => (
                      <MenuItem key={option.maritalID} value={option.maritalID}>
                        {option.maritalStatus}
                      </MenuItem>
                    ))}
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3, pb: 0 }}>
              <item>
                <TextField
                  onBlur={(e) => {
                    if (!(/^[a-zA-Z ]*$/.test(formData.firstName))) {
                      setIsSaveButtonDisabled(true);
                    }
                    else {
                      setIsSaveButtonDisabled(false);
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="firstName"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  value={formData.firstName}
                  inputProps={{ maxLength: 50 }}
                  error={(formData.firstName == "") ? false :
                    !(
                      /^[a-zA-Z ]*$/.test(formData.firstName)// Validation 1: Must accept only numeric values.
                    )
                  }
                  helperText={
                    ((formData.firstName != "") && !(/^[a-zA-Z ]*$/.test(formData.firstName))) ? "Incorrect Entry" : ""
                  }>
                </TextField>
                <TextField sx={{ m: 1 }}
                  onChange={onChange}
                  name="relationshipID"
                  select
                  fullWidth
                  size='small'
                  color="secondary"
                  id="outlined-basic"
                  label=" Relationship"
                  variant="outlined"
                  value={parseInt(formData.relationshipID) || ""}>
                  {masterData.relationList &&
                    masterData.relationList.map((option) => (
                      <MenuItem key={option.relationshipID} value={option.relationshipID}>
                        {option.relationshipName}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="broughtByID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Brought By"
                  variant="outlined"
                  value={parseInt(formData.broughtByID) || ""}
                >
                  {
                    masterData.broughtBYList && masterData.broughtBYList.map((option) => (
                      <MenuItem key={option.broughtDeathID} value={option.broughtDeathID}>
                        {option.broughtDeathName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3, pb: 0 }}>
              <item>
                <TextField
                  onBlur={(e) => {
                    if (!(/^[a-zA-Z ]*$/.test(formData.lastName))) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="lastName"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  value={formData.lastName}
                  inputProps={{ maxLength: 50 }}
                  error={(formData.lastName == "") ? false :
                    !(
                      /^[a-zA-Z ]*$/.test(formData.lastName)// Validation 1: Must accept only numeric values.
                    )
                  }
                  helperText={
                    ((formData.lastName != "") && !(/^[a-zA-Z ]*$/.test(formData.lastName))) ? "Incorrect Entry" : ""
                  }>
                </TextField>
                <TextField
                  onBlur={(e) => {
                    if (!(/^[a-zA-Z ]*$/.test(formData.relativeName))) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="relativeName"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Relative's Name"
                  variant="outlined"
                  value={formData.relativeName}
                  inputProps={{ maxLength: 50 }}
                  error={(formData.relativeName == "") ? false :
                    !(
                      /^[a-zA-Z ]*$/.test(formData.relativeName)// Validation 1: Must not accept numeric values.
                    )
                  }
                  helperText={
                    ((formData.relativeName != "") && !(/^[a-zA-Z ]*$/.test(formData.relativeName))) ? "Incorrect Entry" : ""
                  }>
                </TextField>
                {(formData.broughtByID === 119054) ?
                  <TextField
                    sx={{ m: 1 }}
                    onChange={onChange}
                    name="broughtRemarks"
                    fullWidth size='small' color="secondary" id="outlined-basic"
                    label="Remarks"
                    variant="outlined"
                    value={formData.broughtRemarks}>
                  </TextField>
                  : ""}
              </item>
            </Grid>
            {(formData.broughtByID === 119052) ?
              <Grid xs={12} container>
                <Grid xs={3} item sx={{ pr: 3, pl: 3 }}>
                  <item>
                    <TextField
                      sx={{ m: 1 }}
                      onChange={onChange}
                      name="policeIOName"
                      fullWidth size='small' color="secondary" id="outlined-basic"
                      label="IO Name"
                      variant="outlined"
                      value={formData.policeIOName}>
                    </TextField>
                  </item>
                </Grid>
                <Grid xs={3} item sx={{ pr: 3, pl: 3 }}>
                  <item>
                    <TextField
                      sx={{ m: 1 }}
                      onChange={onChange}
                      name="policeStationName"
                      fullWidth size='small' color="secondary" id="outlined-basic"
                      label="Police Post/Thana"
                      variant="outlined"
                      value={formData.policeStationName}>
                    </TextField>
                  </item>
                </Grid>
                <Grid xs={3} item sx={{ pr: 3, pl: 3 }}>
                  <item>
                    <TextField
                      sx={{ m: 1 }}
                      onChange={onChange}
                      name="policePostalName"
                      fullWidth size='small' color="secondary" id="outlined-basic"
                      label="Post Name"
                      variant="outlined"
                      value={formData.policePostalName}>
                    </TextField>
                  </item>
                </Grid>
                <Grid xs={3} item sx={{ pr: 3, pl: 3 }}>
                  <item>
                    <TextField
                      sx={{ m: 1 }}
                      onChange={onChange}
                      name="policeId"
                      fullWidth size='small' color="secondary" id="outlined-basic"
                      label="ID No."
                      variant="outlined"
                      value={formData.policeId}>
                    </TextField>
                  </item>
                </Grid>
              </Grid>
              : (formData.policeIOName = "",
                formData.policeStationName = "",
                formData.policePostalName = "",
                formData.policeId = ""
              )}
          </Grid>
          <Divider textAlign="left" variant="middle"
            sx={{
              borderColor: "#3da58a",
              "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
            }}>Contact Details
          </Divider>
          <Grid x={12} container >
            <Grid xs={3} item sx={{ p: 3 }}>
              <item >
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="stateID"
                  select required fullWidth size='small' color="secondary" id="outlined-basic"
                  label="State"
                  variant="outlined"
                  value={parseInt(formData.stateID) || ""}
                >
                  {masterData.statesList && masterData.statesList.map((option) => (
                    <MenuItem key={option.stateID} value={option.stateID}>
                      {option.stateName}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  onBlur={(e) => {
                    if (formData.postalCode.length !== 6 || !/^\d+$/.test(formData.postalCode)) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="postalCode"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Pin code"
                  variant="outlined"
                  value={formData.postalCode}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' ||
                      e.key === 'Delete' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Home' ||
                      e.key === 'End'
                    ) {
                      return;
                    }
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                  error={
                    formData.postalCode !== "" &&
                    (formData.postalCode.length !== 6 || !/^\d+$/.test(formData.postalCode))
                  }
                  helperText={
                    formData.postalCode !== ""
                      ? formData.postalCode.length !== 6
                        ? 'Pin Code must be 6 digits.'
                        : !/^\d+$/.test(formData.postalCode)
                          ? 'Pin Code must contain only numbers.'
                          : ''
                      : ''
                  }
                >
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item>
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="districtID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="District"
                  variant="outlined"
                  value={parseInt(formData.districtID) || ""}>
                  {districtList && districtList.map((option) => (
                    <MenuItem key={option.districtID} value={option.districtID}>
                      {option.districtName}
                    </MenuItem>
                  ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item>
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="cityID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Village/Town/City"
                  variant="outlined"
                  value={parseInt(formData.cityID) || ""}>
                  {cityList &&
                    cityList.map((option) => (
                      <MenuItem key={option.cityID} value={option.cityID}>
                        {option.cityName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item>
                <TextField
                  onBlur={(e) => {
                    if (!(/^[a-zA-Z ]*$/.test(formData.relativeName))) {
                      setIsSaveButtonDisabled(true);
                    } else {
                      setIsSaveButtonDisabled(false);
                    }
                  }}
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="address"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  value={formData.address}
                  inputProps={{ maxLength: 50 }}
                  error={(formData.relativeName == "") ? false :
                    !(
                      /^[a-zA-Z ]*$/.test(formData.relativeName)// Validation 1: Must not accept numeric values.
                    )
                  }
                  helperText={
                    ((formData.relativeName != "") && !(/^[a-zA-Z ]*$/.test(formData.relativeName))) ? "Incorrect Entry" : ""
                  }>
                </TextField>
              </item>
            </Grid>
          </Grid>
          <Divider textAlign="left" variant="middle"
            sx={{
              borderColor: "#3da58a",
              "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
            }}>Patient Classification
          </Divider>
          <Grid x={12} container >
            <Grid xs={3} item sx={{ p: 3 }}>
              <item >
                <TextField sx={{ m: 1 }}
                  onChange={(e) => {
                    if (onChange(e)) {
                      handleRegFees(e.target.value, formData.patientSchemeID);
                    }
                  }}
                  name="patientCategoryID"
                  select
                  fullWidth
                  size='small'
                  color="secondary"
                  id="outlined-basic"
                  label="Category"
                  variant="outlined"
                  value={parseInt(formData.patientCategoryID) || ""}>
                  {masterData.patientCategoryList &&
                    masterData.patientCategoryList.map((option) => (
                      <MenuItem key={option.patientCategoryID} value={option.patientCategoryID}>
                        {option.patientCategoryName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item >
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="documentID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Id Proof"
                  variant="outlined"
                  value={parseInt(formData.documentID) || ""} >
                  {masterData.idProofType &&
                    masterData.idProofType.map((option) => (
                      <MenuItem key={option.documentID} value={option.documentID}>
                        {option.documentName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>
            <Grid xs={3} item sx={{ p: 3 }}>
              <item >
                <TextField
                  sx={{ m: 1 }}
                  onChange={onChange}
                  name="referenceCardNumber"
                  fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Reference Card No."
                  variant="outlined"
                  value={formData.referenceCardNumber}>
                </TextField>
              </item>
            </Grid>
            {/* <Grid xs={3} item sx={{ p: 3 }}>
              <item > */}
            {/* <FormControlLabel
                  control={
                    <Checkbox
                      name="residentOfHaryana"
                      onChange={(e)=>{(e.target.value === 'on')?formData.residentOfHaryana=1:formData.residentOfHaryana=0;}} 
                      color="primary"
                    />}
                  label="Resident of Haryana"
                /> */}
            {/* <FormControlLabel
                  control={
                    <Checkbox
                      name="residentOfHaryana"
                      onChange={(e) => {
                        const value = e.target.checked ? 1 : 0;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          residentOfHaryana: value,
                        }));
                      }}
                      checked={formData.residentOfHaryana === 1}
                      color="primary"
                    />
                  }
                  label="Resident of Haryana"
                />
              </item>
            </Grid> */}
          </Grid>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid item xs={7}>
                <Item sx={{ fontSize: '16', fontWeight: '600' }}>Registration Fees</Item>
              </Grid>
              <Grid item xs={2}>
                <Item>{formData.serviceFee} Rs</Item>
              </Grid>
              <Grid item xs={1.5} >
                {(btnName === "LAST ER VISIT") ?
                  <Button
                    disabled={isSaveButtonDisabled}
                    sx={{ width: '100px' }}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSave(formData)}
                  >Save
                  </Button>
                  :
                  <Button
                    sx={{ width: '100px' }}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setShowPrintSlip(true);
                      const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
                        clearedData[field] = '';
                        return clearedData;
                      }, {})
                      setFormData(clearedFormData);
                      setDefaultValues(masterData);
                      setIsSaveButtonDisabled(true);
                      setUhid("");
                      setPatName("");
                    }}
                  >Print
                  </Button>
                }
              </Grid>
              <Grid item xs={1.5} >
                <Button
                  sx={{ width: '100px' }}
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setUhidToSearch("");
                    setUhid("");
                    setPatName("");
                    const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
                      clearedData[field] = '';
                      return clearedData;
                    }, {})
                    setFormData(clearedFormData);
                    setDefaultValues(masterData);
                    setIsSaveButtonDisabled(true);
                  }}
                >Clear</Button>
              </Grid>
            </Grid>
          </Box>
          <Popup
            title="Existing Patient Found"
            openPopup={phoneNumPopup}
            setOpenPopup={setPhoneNumPopup}
            popupWidth={"md"}
          >
            <Box display="flex" justifyContent="center"
              height="50vh"
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
                  rows={phoneNumPopupTableData}
                  columns={phoneNumPopupColumn}
                  getRowId={(row) => row.uhid}
                  onSelectionModelChange={(selection) => {
                    if (selection && selection.length > 0) {
                      const selectedUHID = selection[0];
                      setPhoneNumPopup(false);
                      setUhidToSearch(selectedUHID);
                      //handleSearch();
                    }
                  }}
                />
              </div>
            </Box>
            <Button
              sx={{ marginTop: 0.5 }}
              variant="contained"
              color="secondary"
              onClick={() => {
                setPhoneNumPopup(false);
              }}
            >Record New Patient</Button>
          </Popup>
          <Popup
            title="Existing Patient Found"
            openPopup={uidPopup}
            setOpenPopup={setUidPopup}
            popupWidth={"md"}
          >
            <Box display="flex" justifyContent="center"
              height="50vh"
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
                  rows={uidPopupTableData}
                  columns={uidPopupColumn}
                  getRowId={(row) => row.uhid}
                  onSelectionModelChange={(selection) => {
                    if (selection && selection.length > 0) {
                      const selectedUHID = selection[0];
                      setUidPopup(false);
                      setUhidToSearch(selectedUHID);
                      //handleSearch();
                    }
                  }}
                />
              </div>
            </Box>
          </Popup>
        </FormControl>
      </Box>
    </Box>
  );
};
export default ErAdmission;