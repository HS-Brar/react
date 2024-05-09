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
    List,
} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { tokens } from "../../../theme";
import { styled } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import { useHistory, useNavigate, useLocation } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ResponseAlert from '../../../components/Alert';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const MANAGESTAFF = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const history = useNavigate();
    const location = useLocation();

    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);


    const staffRid = JSON.parse(localStorage.getItem("staffRid"))
    const [saveForm, setSaveForm] = useState(
        {
            "staffDetailsDto": {
                "staffRid": 0,
                "staffName": "",
                "staffAbbrv": "",
                "staffCode": "",
                "staffAddress": "",
                "staffCity": 0,
                "staffState": 0,
                "staffCountry": 0,
                "staffCategory": 0,
                "staffPanCardNo": "",
                "staffUserRid": 0,
                "staffPatientRid": 0,
                "staffResourceRid": 0,
                "staffSpecialityAbbrv": "",
                "staffEntityRid": 0,
                "staffUnitRid": 0,
                "staffDoj": "",
                "staffDol": "",
                "staffValid": 0,
                "staffModUserRid": 0,
                "staffModDatetime": "",
                "staffRowInvalidated": 0,
                "staffCompensation": 0,
                "staffIsConsultant": 0,
                "staffIsExtDoctor": 0,
                "staffCanRefer": 0,
                "staffRefRid": 0,
                "staffIsAdmittingDoctor": 0,
                "staffIsPrimaryAdmitDoc": 0,
                "staffDesignationIndex": 0,
                "staffDesignation": "",
                "staffRegistrationNum": "",
                "staffFirstConsultationFee": 0,
                "staffFollowUpConsFee": 0,
                "staffCreatedDatetime": "",
                "staffHasMultiLocAccess": 0,
                "staffSubCategoryIndex": 0,
                "staffSpecialityIndex": 0,
                "staffToBeRostered": 0,
                "portStaffId": 0,
                "staffEmailId": "",
                "staffMobile": "",
                "staffEligibilityRid": 0,
                "staffIsSchedulable": 0,
                "staffDummy1": 0,
                "staffBankAccNo": "",
                "staffMaxConsultationNo": 0,
                "staffDigitalSignature": "",
                "staffTitle": 0,
                "staffParentRid": 0,
                "staffPaymentMethod": 0,
                "staffCreditPeriod": 0,
                "staffBankName": "",
                "staffBankBranch": "",
                "staffIfscCode": "",
                "staffIsSystemDefined": 0,
                "staffAccountNumber": "",
                "staffIsServiceProvider": 0,
                "staffUpdateMyApptToGcal": 0,
                "portStaffURid": 0,
                "staffManuallyPorted": 0,
                "staffOldUnitRid": 0,
                "staffOldStaffRid": 0,
                "staffNameInReginalFont": "",
                "staffNameEntered": "",
                "staffFirstname": "",
                "staffLastname": "",
                "staffMiddlename": "",
                "staffPersonalEmail": "",
                "staffPersonalPhoneno": "",
                "staffFatherSalutation": "",
                "staffFatherName": "",
                "staffMotherSalutation": "",
                "staffMotherName": "",
                "staffPermenantAddress": "",
                "staffPermamentCity": "",
                "staffPermamentState": "",
                "staffPermamentCountry": "",
                "staffDob": "",
                "staffHrmsRole": "",
                "staffIsActive": 0,
                "staffEmpType": "",
                "staffBaseLocation": "",
                "userId": "",
                "userGender": "",
                "userPhone": "",
                "userEmail": "",
                "refTypeIndex": 0,
                "patMrn": "",
                "title": ""
            },
            "staffWorkCategory": [
                {
                    "additionalProp1": {},
                    "additionalProp2": {},
                    "additionalProp3": {}
                }
            ],
            "rsDesignation": [
                {
                    "ddIndex": 0,
                    "ddDdiTypeIndex": 0,
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": 0,
                    "ddEntRid": 0
                }
            ],
            "rsStaffEligibilityClasses": [
                {
                    "bedtypeRid": 0,
                    "bedtypeName": "",
                    "bedtypeActiveyesno": 0,
                    "bedtypeEntityRid": 0,
                    "bedtypeUserRid": 0,
                    "bedtypeDatetime": "",
                    "bedtypeIsIcu": "",
                    "bedtypePrice": 0,
                    "bedtypeCategory": 0,
                    "bedtypeVat": 0,
                    "bedtypeGroupRid": 0,
                    "bedtypeResBedPrice": 0,
                    "bedtypeParentRid": 0,
                    "bedtypeAdmittingAdvance": 0,
                    "bedtypeDummyInt1": 0,
                    "bedtypeModDatetime": "",
                    "bedtypeModUserRid": 0,
                    "bedtypeInvalidated": 0,
                    "bedtypeStatus": 0,
                    "bedtypeRecordExist": 0
                }
            ],
            "staffBenefitRID": 0,
            "rsStaffBenefitSchemes": [
                {
                    "additionalProp1": {},
                    "additionalProp2": {},
                    "additionalProp3": {}
                }
            ],
            "resource": {
                "resRid": 0,
                "resName": "",
                "resType": "",
                "resEntRid": 0,
                "resEntName": "",
                "resSchedCapacity": 0,
                "resUnitRid": 0,
                "resValid": 0,
                "resSchedInterval": 0,
                "resQueuePrefix": "",
                "resContWorkingSlotCount": 0,
                "resReservedSlotCount": 0,
                "portResId": 0,
                "resSequenceNumber": 0,
                "resCategory": "",
                "resSubcategory": "",
                "resSchedSuration": 0
            },
            "rsStaffDependents": [
                {
                    "sddRid": 0,
                    "sddPatientRid": 0,
                    "patMrn": "",
                    "patComputedDob": "",
                    "patAge": 0,
                    "patGenderIndex": 0,
                    "patMaritalStatusIndex": 0,
                    "sddRelationIndex": 0,
                    "patxDiscCategoryRid": 0,
                    "patName": "",
                    "patxPpDiscCategoryRid": 0,
                    "patxRetailDiscCategoryRid": 0
                }
            ],
            "rsStaffDependentRelations": [
                {
                    "ddIndex": "",
                    "ddDdiTypeIndex": "",
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": ""
                }
            ],
            "rsGender": [
                {
                    "ddIndex": "",
                    "ddDdiTypeIndex": "",
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": ""
                }
            ],
            "rsMaritalStatus": [
                {
                    "ddIndex": "",
                    "ddDdiTypeIndex": "",
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": ""
                }
            ],
            "rsTeamDetails": [
                {
                    "teamRID": 0,
                    "teamName": ""
                }
            ],
            "prevStaffPDetails": [
                {
                    "stsmRid": 0,
                    "stsmStRid": 0,
                    "stsmStaffRid": 0,
                    "stsmIsTeamHead": 0
                }
            ],
            "rsStaffMasterDetails": {
                "staffRid": 0,
                "staffName": "",
                "staffAbbrv": "",
                "staffCode": "",
                "staffAddress": "",
                "staffCity": 0,
                "staffState": 0,
                "staffCountry": 0,
                "staffCategory": 0,
                "staffPanCardNo": "",
                "staffUserRid": 0,
                "staffPatientRid": 0,
                "staffResourceRid": 0,
                "staffSpecialityAbbrv": "",
                "staffEntityRid": 0,
                "staffUnitRid": 0,
                "staffDoj": "",
                "staffDol": "",
                "staffValid": 0,
                "staffModUserRid": 0,
                "staffModDatetime": "",
                "staffRowInvalidated": 0,
                "staffCompensation": 0,
                "staffIsConsultant": 0,
                "staffIsExtDoctor": 0,
                "staffCanRefer": 0,
                "staffRefRid": 0,
                "staffIsAdmittingDoctor": 0,
                "staffIsPrimaryAdmitDoc": 0,
                "staffDesignationIndex": 0,
                "staffDesignation": "",
                "staffRegistrationNum": "",
                "staffFirstConsultationFee": 0,
                "staffFollowUpConsFee": 0,
                "staffCreatedDatetime": "",
                "staffHasMultiLocAccess": 0,
                "staffSubCategoryIndex": 0,
                "staffSpecialityIndex": 0,
                "staffToBeRostered": 0,
                "portStaffId": 0,
                "staffEmailId": "",
                "staffMobile": "",
                "staffEligibilityRid": 0,
                "staffIsSchedulable": 0,
                "staffDummy1": 0,
                "staffBankAccNo": "",
                "staffMaxConsultationNo": 0,
                "staffDigitalSignature": "",
                "staffTitle": 0,
                "staffParentRid": 0,
                "staffPaymentMethod": 0,
                "staffCreditPeriod": 0,
                "staffBankName": "",
                "staffBankBranch": "",
                "staffIfscCode": "",
                "staffIsSystemDefined": 0,
                "staffAccountNumber": "",
                "staffIsServiceProvider": 0,
                "staffUpdateMyApptToGcal": 0,
                "portStaffURid": 0,
                "staffManuallyPorted": 0,
                "staffOldUnitRid": 0,
                "staffOldStaffRid": 0,
                "staffNameInReginalFont": "",
                "staffNameEntered": "",
                "staffFirstname": "",
                "staffLastname": "",
                "staffMiddlename": "",
                "staffPersonalEmail": "",
                "staffPersonalPhoneno": "",
                "staffFatherSalutation": "",
                "staffFatherName": "",
                "staffMotherSalutation": "",
                "staffMotherName": "",
                "staffPermenantAddress": "",
                "staffPermamentCity": "",
                "staffPermamentState": "",
                "staffPermamentCountry": "",
                "staffDob": "",
                "staffHrmsRole": "",
                "staffIsActive": 0,
                "staffEmpType": "",
                "staffBaseLocation": "",
                "userId": "",
                "userGender": "",
                "userPhone": "",
                "userEmail": "",
                "refTypeIndex": 0,
                "patMrn": "",
                "title": ""
            },
            "specialities": [
                {
                    "ddIndex": 0,
                    "ddDdiTypeIndex": 0,
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": 0,
                    "ddEntRid": 0
                }
            ],
            "rsReferralType": [
                {
                    "ddIndex": "",
                    "ddDdiTypeIndex": "",
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": ""
                }
            ],
            "preConsRequired": 0,
            "rsLeaveValues": [
                {
                    "additionalProp1": {},
                    "additionalProp2": {},
                    "additionalProp3": {}
                }
            ],
            "rs_LeaveType": [
                {
                    "ddIndex": 0,
                    "ddDdiTypeIndex": 0,
                    "ddAbbrv": "",
                    "ddValue": "",
                    "ddParentIndex": 0,
                    "ddEntRid": 0
                }
            ],
            "rsStaffEntity": [
                {
                    "entRid": 0,
                    "entAccountRid": "",
                    "entCity": "",
                    "entCode": "",
                    "entCountry": "",
                    "entDisplayAddress": "",
                    "entDistrict": 0,
                    "entFacilityTypeRid": 0,
                    "entFtRid": 0,
                    "entHospitalRegNo": "",
                    "entLandmarks": "",
                    "entMail": "",
                    "entMapGeographicPoints": "",
                    "entMobile": "",
                    "entModelRid": 0,
                    "entName": "",
                    "entParentRid": 0,
                    "entPath": 0,
                    "entPhone": "",
                    "entPinCode": "",
                    "entRegDatetime": "",
                    "entRegionIndex": 0,
                    "entRegionName": "",
                    "entRegistered": "",
                    "entRemarks": "",
                    "entRootParentRid": 0,
                    "entShortName": "",
                    "entState": "",
                    "entStreet": "",
                    "entTaxCode": "",
                    "entTimezone": "",
                    "entType": 0,
                    "entUnregDatetime": ""
                }
            ],
            "rsUnits": [
                {
                    "additionalProp1": {},
                    "additionalProp2": {},
                    "additionalProp3": {}
                }
            ],
            "staffMappedUnits": [
                {
                    "suRid": 0,
                    "suUnitRid": 0,
                    "suStaffRid": 0,
                    "suIsPrimaryUnit": 0,
                    "suEntityLocationRid": 0,
                    "suRecCreateTime": "",
                    "suRecModifiedTime": "",
                    "unitName": "",
                    "entRid": 0,
                    "entName": ""
                }
            ],
            "staffResourceRid": 0,
            "timingsMap": {
                "additionalProp1": {},
                "additionalProp2": {},
                "additionalProp3": {}
            },
            "assginedRoles": [
                {
                    "roleRid": 0,
                    "roleName": ""
                }
            ],
            "standardRoles": [
                {
                    "roleRid": 0,
                    "roleName": ""
                }
            ],
            "staffBenefitBillTypeWise": true
        }
    );
    const [unitRow, setUnitRow] = useState({
        suRid: 0,
        suUnitRid: 0,
        suStaffRid: 0,
        suIsPrimaryUnit: 0,
        suEntityLocationRid: 0,
        suRecCreateTime: "",
        suRecModifiedTime: "",
        unitName: "",
        entRid: 0,
        entName: ""
    });
    const unitTableColumns = [
        {
            field: 'unitName',
            headerName: 'Unit',
            flex: 0.80,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'suIsPrimaryUnit',
            headerName: 'Primary Unit',
            flex: 0.60,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.suIsPrimaryUnit === 1}
                    onChange={(e) => {
                        const updatedUnits = saveForm.staffMappedUnits.map(unit => {
                            if (unit.suUnitRid === params.row.suUnitRid) {
                                return {
                                    ...unit,
                                    suIsPrimaryUnit: e.target.checked ? 1 : 0
                                };
                            }
                            return {
                                ...unit,
                                suIsPrimaryUnit: 0 // Uncheck all other rows
                            };
                        });
                        setSaveForm(prevState => ({
                            ...prevState,
                            staffMappedUnits: updatedUnits
                        }));
                    }}
                />
            ),
        },
        {
            field: 'entName',
            headerName: 'Entity',
            flex: 0.80,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'delete',
            headerName: 'Actions',
            flex: 0.40,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteRow(params.row.suUnitRid)}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];
    const [checked, setChecked] = React.useState([]);
    const [standardRole, setStandardRoles] = React.useState([]);
    const [assginedRole, setAssginedRoles] = React.useState([]);

    const standardRoleChecked = intersection(checked, standardRole);
    const assginedRoleChecked = intersection(checked, assginedRole);
    const [staffSubCategory, setStaffSubCategory] = useState();
    const redirectToStaffMasterPage = () => {
        history('/staffMaster');
    };
    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/viewStaffDetails/${staffRid}`, {
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
                setSaveForm(data);
                setStandardRoles(data.standardRoles);
                setAssginedRoles(data.assginedRoles);
            })
            .catch((error) => {
                console.error('Error fetching Staff Details:', error);
            });
    }, []);
    const fetchStaffSubcategory = () => {
        const queryParams = new URLSearchParams({
            "staffSubCategory": saveForm.staffDetailsDto.staffCategory,
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/staff/getSubCategory?${queryParams}`;
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
                setStaffSubCategory(data);
            })
            .catch((error) => {
                console.error('Error fetching Staff Details:', error);
            });
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllAssginedRoles = () => {
        setAssginedRoles(assginedRole.concat(standardRole));
        setSaveForm(prevState => ({
            ...prevState,
            assginedRoles: Array.isArray(prevState.assginedRoles) ? [...prevState.assginedRoles, standardRole] : standardRole

        }));
        setStandardRoles([]);
    };

    const handleCheckedAssginedRole = () => {
        setAssginedRoles(assginedRole.concat(standardRoleChecked));
        setSaveForm(prevState => ({
            ...prevState,
            assginedRoles: Array.isArray(prevState.assginedRoles) ? [...prevState.assginedRoles, standardRoleChecked] : standardRoleChecked

        }));
        setStandardRoles(not(standardRole, standardRoleChecked));
        setChecked(not(checked, standardRoleChecked));
    };

    const handleCheckedStandardRole = () => {
        setStandardRoles(standardRole.concat(assginedRoleChecked));
        setAssginedRoles(not(assginedRole, assginedRoleChecked));
        setSaveForm(prevState => ({
            ...prevState,
            assginedRoles: Array.isArray(prevState.assginedRoles) ? [...prevState.assginedRoles, assginedRoleChecked] : assginedRoleChecked

        }));
        setChecked(not(checked, assginedRoleChecked));
    };

    const handleAllStandardRoles = () => {
        setStandardRoles(standardRole.concat(assginedRole));
        setAssginedRoles([]);
        setSaveForm(prevState => ({
            ...prevState,
            assginedRoles: []
        }));
    };

    const customList = (title, items) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <Typography textAlign="center" style={{ fontWeight: 'bold' }}>{title}</Typography>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.roleName}-label`;

                    return (
                        <ListItemButton
                            key={value.roleRid}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.roleName}`} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );
    const handleDeleteRow = (suUnitRid) => {
        // Make API call to delete the row
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/deleteStaffUnit?staffUnitRID=${suUnitRid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
            .then(response => {
                if (response.ok) {
                    // Remove the row from staffMappedUnits
                    const updatedUnits = saveForm.staffMappedUnits.filter(unit => unit.suUnitRid !== suUnitRid);
                    setSaveForm(prevState => ({
                        ...prevState,
                        staffMappedUnits: updatedUnits
                    }));
                } else {
                    // Handle error scenario
                    console.error('Failed to delete row');
                }
            })
            .catch(error => {
                console.error('Error occurred while deleting row:', error);
                // Handle error scenario
                // You may want to show an error message to the user
            });
    };
    const handleSave = () => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/saveStaffDetails`, {
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
            })
            .catch((error) => {
                console.error('Error in Saving Staff Details:', error);
            });
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Manage Staff" />
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
                            redirectToStaffMasterPage();
                            localStorage.removeItem("selectedRow");
                        }
                        }
                    >Back
                    </Button>
                </Box>
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >{showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
                <FormControl fullWidth >
                    <Grid x={12} container >
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffCode"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Staff Code"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffCode": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffCode || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="userId"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Login Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "userId": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.userId || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffName": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                // name="staffName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Regional Name"
                                variant="outlined"
                            // onChange={(e) => {
                            //     setSaveForm(prevState => ({
                            //         ...prevState,
                            //         staffDetailsDto: {
                            //             ...prevState.staffDetailsDto,
                            //             "userId": e.target.value,
                            //         }
                            //     }));
                            // }}
                            // value={selectedRow. || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffAbbrv"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Staff Abbreviation"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffAbbrv": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffAbbrv || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffEmailId"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="E-mail id"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffEmailId": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffEmailId || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffPersonalEmail"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Personal E-mail id"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffPersonalEmail": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffPersonalEmail || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffMobile"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Mobile No."
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffMobile": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffMobile || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffPersonalPhoneno"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Personal Mobile No."
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffPersonalPhoneno": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffPersonalPhoneno || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffDoj"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Date of joining"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffDoj": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffDoj || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffDol"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Date of leaving"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffDol": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffDol || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffBankName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Bank Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffBankName": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffBankName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffBankBranch"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Branch Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffBankBranch": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffBankBranch || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffBankAccNo"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Bank Account Number"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffBankAccNo": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffBankAccNo || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffIfscCode"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="IFSC Code"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIfscCode": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIfscCode || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffCategory"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Category"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffCategory": e.target.value,
                                        }
                                    }));
                                    fetchStaffSubcategory();
                                }}
                                value={saveForm.staffDetailsDto.staffCategory || ""}
                            >
                                {saveForm.staffWorkCategory &&
                                    saveForm.staffWorkCategory.map((option) => (
                                        <MenuItem key={option.category_id} value={option.category_id}>
                                            {option.category_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffSubCategoryIndex"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Subcategory"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffSubCategoryIndex": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffSubCategoryIndex || ""}
                            >
                                {staffSubCategory &&
                                    staffSubCategory.map((option) => (
                                        <MenuItem key={option.dd_index} value={option.dd_index}>
                                            {option.dd_value}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffDesignationIndex"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Designation"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffDesignationIndex": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffDesignationIndex || ""}
                            >
                                {saveForm.rsDesignation &&
                                    saveForm.rsDesignation.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffEligibilityRid"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Staff Bed Eligibility"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffEligibilityRid": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffEligibilityRid || ""}
                            >
                                {/* {saveForm.rsStaffEligibilityClasses &&
                                    saveForm.rsStaffEligibilityClasses.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                } */}
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                // name=""
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Staff Benefit Scheme"
                                variant="outlined"
                            // onChange={(e) => {
                            //     setSearchForm((prevForm) => ({
                            //         ...prevForm,
                            //         staffName: e.target.value
                            //     }));
                            // }}
                            // value={searchForm.staffName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="staffDesignation"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Designation"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffDesignation": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffDesignation || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={9} item sx={{ p: 1 }}></Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Is Schedulable"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsSchedulable": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsSchedulable || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Is a Service Provider"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsServiceProvider": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsServiceProvider || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Active"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsActive": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsActive || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Is Roster Applicable"
                            />
                        </Grid>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            m: 1,
                            borderColor: "#3da58a",
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>
                    </Divider>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>{customList("STANDARD ROLES", standardRole)}</Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAllAssginedRoles}
                                    disabled={standardRole.length === 0}
                                    aria-label="move all right"
                                >
                                    ≫
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedAssginedRole}
                                    disabled={standardRoleChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedStandardRole}
                                    disabled={assginedRoleChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAllStandardRoles}
                                    disabled={assginedRole.length === 0}
                                    aria-label="move all left"
                                >
                                    ≪
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>{customList("ASSIGNED ROLES", assginedRole)}</Grid>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            m: 1,
                            borderColor: "#3da58a",
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>Doctor Details
                    </Divider>
                    <Grid x={12} container >
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                name="staffSpecialityIndex"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Speciality"
                                variant="outlined"
                                onChange={(e) => {
                                    const specIndex = saveForm.specialities.findIndex(obj => obj.ddIndex == e.target.value);
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffSpecialityIndex": e.target.value,
                                            "staffSpecialityAbbrv": saveForm.specialities[specIndex].ddAbbrv

                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffSpecialityIndex || ""}
                            >
                                {saveForm.specialities &&
                                    saveForm.specialities.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Consultant"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsConsultant": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsConsultant || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="External Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsExtDoctor": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsExtDoctor || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                name="staffMaxConsultationNo"
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Max No.Consultation"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffMaxConsultationNo": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffMaxConsultationNo || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                name="staffRefRid"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Referral Type"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffRefRid": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffRefRid || ""}
                            >
                                {saveForm.rsReferralType &&
                                    saveForm.rsReferralType.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Can Refer"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffCanRefer": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffCanRefer || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Admitting Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsAdmittingDoctor": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsAdmittingDoctor || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Primary Admitting Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffIsPrimaryAdmitDoc": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffIsPrimaryAdmitDoc || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{}}
                                name="staffRegistrationNum"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Reg. No."
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffRegistrationNum": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffRegistrationNum || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Pre-Consultation Required"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        "preConsRequired": (e.target.checked === true) ? 1 : 0,
                                    }));
                                }}
                                value={saveForm.preConsRequired || ""}
                            />
                        </Grid>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            m: 1,
                            borderColor: "#3da58a",
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>Staff Unit Details
                    </Divider>
                    <Grid x={12} container >
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Has Multi Location Access"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        staffDetailsDto: {
                                            ...prevState.staffDetailsDto,
                                            "staffHasMultiLocAccess": e.target.value,
                                        }
                                    }));
                                }}
                                value={saveForm.staffDetailsDto.staffHasMultiLocAccess || ""}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                name="staffUnitRid"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Unit"
                                variant="outlined"
                                onChange={(e) => {
                                    const selectedUnitRid = e.target.value;
                                    const selectedUnit = saveForm.rsUnits.find(unit => unit.unitRid === selectedUnitRid);
                                    const newUnitMapItem = {
                                        suRid: 0,
                                        suUnitRid: selectedUnitRid,
                                        suStaffRid: 0,
                                        suIsPrimaryUnit: 0,
                                        suEntityLocationRid: 0,
                                        suRecCreateTime: "",
                                        suRecModifiedTime: "",
                                        unitName: selectedUnit.unitName,
                                        entRid: 0,
                                        entName: ""
                                    };
                                    setUnitRow(newUnitMapItem);
                                }}
                                value={unitRow.suUnitRid || ""} >
                                {saveForm.rsUnits &&
                                    saveForm.rsUnits.map((option) => (
                                        <MenuItem key={option.unitRid} value={option.unitRid}>
                                            {option.unitName}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={2} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Is Primary"
                                checked={unitRow.suIsPrimaryUnit}
                                onChange={(e) => {
                                    setUnitRow(prevState => ({
                                        ...prevState,
                                        "suIsPrimaryUnit": (e.target.checked === true) ? 1 : 0,
                                    }));
                                }}
                                value={unitRow.suIsPrimaryUnit || false}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <Button
                                primary
                                disabled={(unitRow.suUnitRid === 0) ? true : false}
                                onClick={() => {
                                    // Check if the selected unit already exists in staffMappedUnits
                                    const isUnitAlreadyAdded = saveForm.staffMappedUnits.some(unit => unit.suUnitRid === unitRow.suUnitRid);

                                    // Check for duplicate primary key
                                    const isDuplicatePrimaryKey = saveForm.staffMappedUnits.some(unit => unit.suIsPrimaryUnit === 1 && unitRow.suIsPrimaryUnit === 1);


                                    if (!isUnitAlreadyAdded && !isDuplicatePrimaryKey) {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            staffMappedUnits: [...prevState.staffMappedUnits, unitRow]
                                        }));
                                    } else {
                                        setUnitRow({
                                            suRid: 0,
                                            suUnitRid: 0,
                                            suStaffRid: 0,
                                            suIsPrimaryUnit: false,
                                            suEntityLocationRid: 0,
                                            suRecCreateTime: "",
                                            suRecModifiedTime: "",
                                            unitName: "",
                                            entRid: 0,
                                            entName: ""
                                        });
                                        setResponseMessage(`Duplicate Diagnosis !(${Date.now()})`);
                                        setMessageSeverty("Error");
                                        setShowResponseAlert(true);
                                        console.log("duplicate");
                                    }
                                }}>
                                Add
                            </Button>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center"
                            paddingTop={1}
                            m="5px"
                            height="47vh"
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
                                    rows={saveForm.staffMappedUnits}
                                    columns={unitTableColumns}
                                    getRowId={(row) => row.suUnitRid}
                                    disableSelectionOnClick
                                />
                            </div>
                        </Box>
                    </Grid>
                    <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                        <Grid item m={1}>
                            <Button
                                sx={{ width: 100 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleSave() }}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Box >
    );
};

export default MANAGESTAFF;
