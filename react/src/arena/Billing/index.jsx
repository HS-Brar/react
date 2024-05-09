import React, { useState, useEffect } from 'react';
import { Paper, Divider, Box, Button, useTheme, FormControl, TextField, Grid, MenuItem, Typography, TableCell, TableRow, } from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import Header from "../../components/Header";
import { Person2 } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ResponseAlert from '../../components/Alert';
import JasperReport from "../../components/JasperReport";
import SearchComponent from "../../components/IncrementalSearch";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const BILLING = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [btnName, setBtnName] = useState("Last Bill");
  const jwtToken = localStorage.getItem("jwtToken");
  const [responseMessage, setResponseMessage] = useState('');
  const [messageSeverty, setMessageSeverty] = useState('');
  const [showResponseAlert, setShowResponseAlert] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [uhidToSearch, setUhidToSearch] = useState('');
  const [patSearch, setPatSearch] = useState({
    "patientUHID": "",
    "visitRID": 0,
    "patientRID": 0,
    "firstName": "",
    "lastName": "",
    "genderID": 0,
    "gender": "",
    "patientAge": "",
    "patientAgeUnit": "",
    "patientDob": "",
    "mobile": "",
    "patientAadharNo": "",
    "patientCategoryID": 0,
    "patientCategory": "",
    "patientSchemeID": 0,
    "patientSchemeName": 0,
    "consultingDoctorRID": 0,
    "doctorName": "",
    "patientAdmittedDate": "",
    "visitReasonID": 0,
    "specialityID": 0,
    "referralTypeID": 0,
    "referredBy": "",
    "documentID": 0,
    "referenceCardNumber": "",
    "relationshipID": 0,
    "relativeName": "",
    "stateID": 0,
    "districtID": 0,
    "cityID": 0,
    "address": "",
    "postalCode": "",
    "scheme": [
      {}
    ],
    "category": [
      {}
    ],
    "fullName": ""
  });
  const [saveForm, setSaveForm] = useState({
    "patientRID": 0,
    "patientUHID": "",
    "patientName": "",
    "visitRID": 0,
    "doctorRID": 0,
    "specialityID": 0,
    "unitRID": 0,
    "patientSchemeID": 0,
    "billCategory": "M",
    "grossAmount": 0,
    "netAmount": 0,
    "payerAmount": "",
    "totalDiscountAmount": 0,
    "billOrderDetails": [{
      "orderRID": 0,
      "serviceRID": 0,
      "serviceName": "",
      "serviceCode": "",
      "serviceCategory": 0,
      "itemType": "",
      "serviceGroupRID": 0,
      "serviceGroupName": "",
      "serviceChargeRID": 0,
      "serviceQty": 0,
      "servicePrice": 0,
      "serviceGrossAmount": 0,
      "discountPercentage": 0,
      "discountAmount": 0,
      "amount": 0,
      "orderingDoctorID": 0
    }
    ]
  }
  );
  const [service, setService] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [alertKey, setAlertKey] = useState(0);
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [schemeORCategoryWise, setSchemeORCategoryWise] = useState([]);
  const handleSave = (saveForm) => {
    saveForm.patientRID = patSearch.patientRID;
    saveForm.patientUHID = patSearch.patientUHID;
    saveForm.patientName = patSearch.fullName;
    saveForm.visitRID = patSearch.visitRID;
    saveForm.docRID = patSearch.consultingDoctorRID;
    saveForm.specialityID = patSearch.specialityID;
    saveForm.doctorRID = patSearch.consultingDoctorRID;
    saveForm.unitRID = 146; //////////////////////////////
    saveForm.patientSchemeID = patSearch.patientSchemeID;
    saveForm.billOrderDetails = selectedServices;
    console.log(saveForm);
    fetch(`http://10.197.8.17:2023/hmis/api/v1/bill/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(saveForm)
    })
      .then((response) => {
        if (!response.ok) {
          setResponseMessage("Bill Not Saved Successfuly.");
          setShowResponseAlert(true);
          return response.json().then(errorData => {
            const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        setResponseMessage(data.message);
        setShowResponseAlert(true);
        setShowPrintSlip(true);
        localStorage.setItem("billRID", data.billRID);
      })
      .catch((error) => {
        console.error('Error fetching prescribed service', error);
      });
  };
  const handleServiceSelect = (selectedService) => {
    // Check if the Service is already in the selectedServices list
    const isDuplicate = selectedServices.some((service) => service.serviceRID === selectedService.serviceRID);
    if (isDuplicate) {
      setResponseMessage("Warning: The Service is already added.");
      setMessageSeverty("error");
      setShowResponseAlert(true);
      setAlertKey((prevKey) => prevKey + 1);
    }
    else {
      const newNetAmount = saveForm.netAmount + (selectedService.servicePrice - selectedService.discountAmount);
      const newGrossAmount = saveForm.grossAmount + selectedService.servicePrice;
      const newTotalDiscountAmount = saveForm.totalDiscountAmount + selectedService.discountAmount;
      const newServiceGrossAmount = selectedService.servicePrice;

      saveForm.netAmount = newNetAmount;
      saveForm.grossAmount = newGrossAmount;
      saveForm.totalDiscountAmount = newTotalDiscountAmount;
      saveForm.serviceGrossAmount = newServiceGrossAmount;

      // setSaveForm((prevSaveForm) => ({
      //   ...prevSaveForm,
      //   grossAmount: newGrossAmount,
      //   netAmount: newNetAmount,
      //   totalDiscountAmount: newTotalDiscountAmount,
      //   serviceGrossAmount: newServiceGrossAmount
      // }));
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        {
          ...selectedService,
          serviceQty: 1,
          amount: selectedService.servicePrice - selectedService.discountAmount,
          itemType: 'S'
        }
      ]);
      setSearchResults([]);
      setShowTableHeader(true);
    }
  };

  const onChange = (e) => {
    if (e.target.name === "patientCategoryID" || e.target.name === "patientSchemeID") {
      const serviceCodes = selectedServices.map(service => service.serviceCode).join('~');
      const scheme_categoryJSON = {
        "patientGenderID": patSearch.genderID,
        "servieCode": serviceCodes,
        "patientCategoryORSchemeID": e.target.value,
        "unitRID": 146   ////////////////
      };
      fetch(`http://10.197.8.17:2023/hmis/api/v1/bill/serviceList/SchemeORCategoryWise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(scheme_categoryJSON)
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
          setSelectedServices(data);
          // for (let i = 0; i < data.length; i++) {
          //   handleRemoveService(0);
          // }
          setPatSearch(() => ({
            ...patSearch,
            [e.target.name]: e.target.value
          }));

          // Updating the saveForm with the new grossAmount,netAmount,totalDiscountAmount 
          saveForm.netAmount = 0;
          saveForm.grossAmount = 0;
          saveForm.totalDiscountAmount = 0;


          data.forEach((service) => {
            handleServiceSelect(service);
          });
        })
        .catch((error) => {
          console.error('Error fetching Service details', error);
        });
    }
  };

  const handleLastBill = () => {
    //TODO
  };

  const handleRemoveService = (indexToRemove) => {
    setSelectedServices((prevSelectedServices) => {
      // Getting the service to be removed
      const removedService = prevSelectedServices[indexToRemove];

      // Filter out the removed service
      const updatedSelectedServices = prevSelectedServices.filter((_, index) => index !== indexToRemove);

      // Calculate the new grossAmount,netAmount,totalDiscountAmount by subtracting the removed service's price
      const newGrossAmount = saveForm.grossAmount - removedService.servicePrice;
      const newNetAmount = saveForm.netAmount - (removedService.servicePrice - removedService.discountAmount);
      const newTotalDiscountAmount = saveForm.newTotalDiscountAmount - removedService.discountAmount

      // Updating the saveForm with the new grossAmount,netAmount,totalDiscountAmount 
      saveForm.netAmount = newNetAmount;
      saveForm.grossAmount = newGrossAmount;
      saveForm.totalDiscountAmount = newTotalDiscountAmount;
      // setSaveForm((prevSaveForm) => ({
      //   ...prevSaveForm,
      //   grossAmount: newGrossAmount,
      //   netAmount: newNetAmount,
      //   totalDiscountAmount: newTotalDiscountAmount
      // }));



      // Checking if there are any selected services left
      if (updatedSelectedServices.length === 0) {
        setShowTableHeader(false);
      }

      return updatedSelectedServices;
    });
  };

  const handleSearch = (searchTerm) => {
    //fetching LAB Service based on input data.
    const jsonBody = {
      "patientGenderID": patSearch.genderID,
      "searchString": searchTerm,
      "patientCategoryID": patSearch.patientCategoryID,
      "unitRID": 146//////////////////////////////
    };
    fetch(`http://10.197.8.17:2023/hmis/api/v1/bill/serviceList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(jsonBody)
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
        //setFreqMap(data.frequency);
        const filteredResults = data.filter((service) =>
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
      })
      .catch((error) => {
        console.error('Error fetching prescribed service', error);
      });
  };
  const renderSelectedServices = () => {
    console.log(selectedServices);
    return selectedServices.map((selectedService, index) => (
      <TableRow>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.serviceCode}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.serviceName}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>1</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.servicePrice}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.servicePrice}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.discountPercentage}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{selectedService.discountAmount}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{(selectedService.servicePrice - selectedService.discountAmount)}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <TextField
            name="consultingDoctorRID"
            select
            onChange={(e) => {
              const updatedService = {
                ...selectedService,
                orderingDoctorID: e.target.value,
              };
              const serviceIndex = selectedServices.findIndex(
                (service) => service.serviceRID === updatedService.serviceRID
              );
              const updatedServices = [...selectedServices];
              updatedServices[serviceIndex] = updatedService;
              setSelectedServices(updatedServices);
              setPatSearch(() => ({
                ...patSearch,
                [e.target.name]: e.target.value
              }));
            }}
            fullWidth
            size='small'
            color="secondary"
            id="outlined-basic"
            label="Ordering Doctor's Name"
            variant="outlined"
            value={selectedService.orderingDoctorID || ""}
          >
            {patSearch.doctorList &&
              patSearch.doctorList.map((option) => (
                <MenuItem key={option.docRID} value={option.docRID}>
                  {option.doctorName}
                </MenuItem>
              ))}
          </TextField>
          {/* <TextField
            sx={{ m: 1 }}
            // name="doctorName"
            select
            onChange={onChange}
            fullWidth size='small' color="secondary" id="outlined-basic"
            label="Ordering Doctor's Name"
            variant="outlined"
          // value={patSearch.doctorName}
          >
            {selectedService.doctorList &&
              selectedService.doctorList.map((option) => (
                <MenuItem key={option.docRID} value={option.docRID}>
                  {option.doctorName}
                </MenuItem>
              ))}
          </TextField> */}
        </TableCell>
        <TableCell sx={{ textAlign: 'right' }}>
          <Button variant="contained"
            color="error"
            onClick={() => handleRemoveService(index)}>Remove</Button>
        </TableCell>
      </TableRow>
    ));
  };

  const handlePatientSearch = () => {
    //fetching Patient based on UHID
    fetch(`http://10.197.8.17:2023/hmis/api/v1/bill/patient/search/${uhidToSearch}`, {
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
        setPatSearch(data);
        data.billOrderDetails.forEach((service) => {
          handleServiceSelect(service);
        });
        console.log(patSearch);
      })
      .catch((error) => {
        console.error('Error fetching prescribed service', error);
      });
  };
  return (
    <Box m="10px" >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Billing" />
        {showPrintSlip && <JasperReport title="Billing" reportUrl={`http://10.197.8.17:2023/hmis/api/v1/bill/save/${localStorage.getItem("billRID")}/print`} />}
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
              if (btnName === "Last Bill") {
                setBtnName("New Bill");
                handleLastBill();
              } else {
                setBtnName("Last Bill");
                const clearedpatSearch = Object.keys(patSearch).reduce((clearedData, field) => {
                  clearedData[field] = '';
                  return clearedData;
                }, {});
                setPatSearch(clearedpatSearch);
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
        <Grid container alignItems="center" sx={{ paddingTop: 1, paddingLeft: 3 }}>
          <TextField
            sx={{ ml: 1, width: "21.2%" }}
            fullWidth size='small' color="secondary" id="outlined-basic"
            label="Enter UHID"
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
            onClick={handlePatientSearch}
          >
            Search
          </Button>
          <Grid container>
            {patSearch.patientUHID ? (
              <div>
                <table>
                  <tbody>
                    <TableRow sx={{ backgroundColor: colors.blueAccent[500] }}>
                      <TableCell><Typography sx={{ color: "#fff" }}>UHID: {patSearch.patientUHID}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Patient Name:{patSearch.fullName}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Consulting Doctor: {patSearch.doctorName}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Mobile: {patSearch.mobile}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Age: {patSearch.patientAge + " " + patSearch.patientAgeUnit}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Gender: {patSearch.gender}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: "#fff" }}>Patient Category: {patSearch.patientCategory}</Typography></TableCell>
                    </TableRow>
                  </tbody>
                </table>
              </div>
            ) : ""}
          </Grid>

          {/* <Typography sx={{ ml: 1, fontWeight: '550' }}>
            {patSearch.patientUHID}&nbsp;
            {patSearch.fullName}&nbsp;
            {patSearch.doctorName}&nbsp;
            {patSearch.mobile}&nbsp;
            {patSearch.patientAge +" " +patSearch.patientAgeUnit}&nbsp;
            {patSearch.gender}&nbsp;
            {patSearch.patientCategory}
          </Typography> */}
        </Grid>
        <Divider textAlign="left" variant="middle"
          sx={{
            p: 0.5, borderColor: "#3da58a",
            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
          }}>
        </Divider>
        <FormControl fullWidth >
          <Grid x={12} container >
            <Grid xs={3} item sx={{ p: 3 }}>
              <item>
                <TextField sx={{ m: 1 }}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  name="patientCategoryID"
                  select
                  required
                  fullWidth
                  size='small'
                  color="secondary"
                  id="outlined-basic"
                  label="Category"
                  variant="outlined"
                  value={patSearch.patientCategoryID || ""}>
                  {patSearch.category &&
                    patSearch.category.map((option) => (
                      <MenuItem key={option.patientCategoryID} value={option.patientCategoryID}>
                        {option.patientCategoryName}
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
                  name="patientSchemeID"
                  select fullWidth size='small' color="secondary" id="outlined-basic"
                  label="Scheme"
                  variant="outlined"
                  value={patSearch.patientSchemeID || ""}>
                  {patSearch.scheme &&
                    patSearch.scheme.map((option) => (
                      <MenuItem key={option.patientSchemeID} value={option.patientSchemeID}>
                        {option.patientSchemeName}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </item>
            </Grid>

          </Grid>
        </FormControl>
        <Divider textAlign="left" variant="middle"
          sx={{
            p: 0.5, borderColor: "#3da58a",
            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
          }}>Bill charges
        </Divider>
        <SearchComponent serviceDetails={service.serviceDetails} onSearch={handleSearch} label="Description" />
        <ul>
          {searchResults.map((service) => (
            <li key={service.serviceID} onClick={() => handleServiceSelect(service)}>
              {service.serviceName}
            </li>
          ))}
        </ul>
        {showTableHeader && (
          <table>
            <thead>
              <tr style={{ height: '10px', backgroundColor: colors.blueAccent[700] }}>
                {/* <th>Select</th> */}
                <th style={{ width: "5%" }}>Code</th>
                <th style={{ width: "14%" }}>Description</th>
                <th style={{ width: "5%" }}>Qty</th>
                <th style={{ width: "10%" }}>Unit Price</th>
                <th style={{ width: "10%" }}>Amount</th>
                <th style={{ width: "10%" }}>Discount %</th>
                <th style={{ width: "11%" }}>Discount Amount</th>
                <th style={{ width: "10%" }}>Net Amount</th>
                <th style={{ width: "15%" }} colSpan="2">Ordering Doctor's Name *</th>
              </tr>
            </thead>
            <tbody>
              {renderSelectedServices()}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{saveForm.grossAmount}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{saveForm.netAmount}</TableCell>
              </TableRow>
            </tbody>
          </table>
        )}

        <Divider textAlign="left" variant="middle"
          sx={{
            p: 0.5, borderColor: "#3da58a",
            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
          }}>Payment Details
        </Divider>
        <Grid container sx={{ mt: 1 }}>
          <Grid xs={9} />
          <Grid xs={1.5} sx={{ mb: 2 }}>
            <TextField
              sx={{ marginLeft: 1, width: '100%' }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              onChange={(e) => {
                ///Regular expression to allow only numeric values and a single decimal point
                const inputValue = (parseInt(e.target.value)) ? parseInt(e.target.value) : 0;
                //if (/^\d*\.?\d*$/.test(inputValue) && inputValue <= saveForm.netAmount) {
                if (inputValue <= saveForm.netAmount) {
                  setSaveForm((prevSaveForm) => ({
                    ...prevSaveForm,
                    [e.target.name]: inputValue,
                    //netAmount : inputValue,
                  }));
                  //saveForm.payerAmount = inputValue;
                }
              }}
              name="payerAmount"
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Paid Amount (INR)"
              variant="outlined"
              value={(saveForm.payerAmount === "") ? parseInt(saveForm.netAmount) : saveForm.payerAmount}
            />
          </Grid>
          <Grid xs={1}>
            <Button
              sx={{ marginLeft: 5.4, width: '100px' }}
              variant="contained"
              color="secondary"
              onClick={() => handleSave(saveForm)}
            >Save
            </Button>
          </Grid>
          {/* <Grid xs={8}>
            <Typography></Typography>
          </Grid>
          <Grid xs={4} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              sx={{ m: 1, width: '50%' }}
              onChange={(e) => {
                ///Regular expression to allow only numeric values and a single decimal point
                const inputValue = e.target.value;
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setSaveForm((prevSaveForm) => ({
                    ...prevSaveForm,
                    [e.target.name]: inputValue,
                  }));
                }
              }}
              name="payerAmount"
              fullWidth
              size="small"
              color="secondary"
              id="outlined-basic"
              label="Paid Amount (INR)"
              variant="outlined"
              value={saveForm.payerAmount}
            />
            <Button
              sx={{ m: 1, width: '100px' }}
              variant="contained"
              color="secondary"
              onClick={() => handleSave(saveForm)}
            >Save
            </Button>
          </Grid>*/}
        </Grid>
      </Box>
    </Box>
  );
};
export default BILLING;