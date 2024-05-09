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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const ADDSTAFF = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const history = useNavigate();
    const location = useLocation();

    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);

    const [doj, setDoj] = useState(dayjs());
    const [dol, setDol] = useState();

    const staffRid = JSON.parse(localStorage.getItem("staffRid"));
    const [formData, setFormData] = useState({});
    const [saveForm, setSaveForm] = useState({});
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
                        //handlePrimaryUnitChange(params.row.suRid, e.target.checked)
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
                    onClick={() => {
                        //handleDeleteRow(params.row.suRid);
                        handleDeleteRow(params.row.suUnitRid);
                    }}
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
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/staffInformation`, {
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
                setStandardRoles(data.standardRoles);
                setSaveForm(prevState => ({
                    ...prevState,
                    addNewStaffDto: {
                        ...prevState.addNewStaffDto,
                        "staffDoj": doj.format('YYYY-MM-DD'),
                    }
                }));
            })
            .catch((error) => {
                console.error('Error fetching Staff Details:', error);
            });
    }, []);
    const fetchStaffSubcategory = (staffCategory) => {
        const url = `http://10.197.8.17:2023/hmis/api/v1/staff/getStaffSubCategory?staffSubCategoryID=${staffCategory}`;
        console.log(url);
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
                console.error('Error fetching Sub Category Details:', error);
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
            assginedRoles: [...prevState.assginedRoles, assginedRoleChecked]
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
        // Remove the row from staffMappedUnits
        const updatedUnits = saveForm.staffMappedUnits.filter(unit => unit.suUnitRid !== suUnitRid);
        setSaveForm(prevState => ({
            ...prevState,
            staffMappedUnits: updatedUnits
        }));
        // Make API call to delete the row
        // fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/deleteStaffUnit?staffUnitRID=${suRid}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${jwtToken}`
        //     },
        // })
        //     .then(response => {
        //         if (response.ok) {

        //         } else {
        //             // Handle error scenario
        //             console.error('Failed to delete row');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error occurred while deleting row:', error);
        //         // Handle error scenario
        //         // You may want to show an error message to the user
        //     });
    };
    const handleSave = () => {
        console.log(saveForm);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/staff/addNewStaff`, {
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
                <Header title="Add Staff" />
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffCode": e.target.value,
                                        }
                                    }));
                                }}
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
                                        "txtLoginID": e.target.value,
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffName": e.target.value,
                                        }
                                    }));
                                }}

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
                            //         addNewStaffDto: {
                            //             ...prevState.addNewStaffDto,
                            //             "": e.target.value,
                            //         }
                            //     }));
                            // }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffAbbrv": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffEmailId": e.target.value,
                                        }
                                    }));
                                }}
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
                                        "staffPersonalEmailId": e.target.value
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffMobile": e.target.value,
                                        }
                                    }));
                                }}
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
                                        "staffPersonalMobileNo": e.target.value,
                                    }));
                                }}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Date of joining"
                                        value={doj}
                                        onChange={(newValue) => {
                                            setDoj(newValue);
                                            setSaveForm(prevState => ({
                                                ...prevState,
                                                addNewStaffDto: {
                                                    ...prevState.addNewStaffDto,
                                                    "staffDoj": newValue.format('YYYY-MM-DD'),
                                                }
                                            }));
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid xs={3} sx={{ p: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Date of leaving"
                                        value={dol}
                                        onChange={(newValue) => {
                                            setDol(newValue);
                                            setSaveForm(prevState => ({
                                                ...prevState,
                                                addNewStaffDto: {
                                                    ...prevState.addNewStaffDto,
                                                    "staffDol": newValue.format('YYYY-MM-DD'),
                                                }
                                            }));
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        {/* <Grid xs={3} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                //name="staffDoj"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Date of leaving"
                                variant="outlined"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffDol": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffDol": e.target.value,
                                        }
                                    }));
                                }}
                            >
                            </TextField>
                        </Grid> */}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffBankName": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffBankBranch": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffAccountNumber": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIfscCode": e.target.value,
                                        }
                                    }));
                                }} >
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffCategory": e.target.value,
                                        }
                                    }));
                                    fetchStaffSubcategory(e.target.value);
                                }}
                            >
                                {formData.staffWorkCategory &&
                                    formData.staffWorkCategory.map((option) => (
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffSubCategoryIndex": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffDesignationIndex": e.target.value,
                                        }
                                    }));
                                }}
                            >
                                {formData.rsDesignation &&
                                    formData.rsDesignation.map((option) => (
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffEligibilityRid": e.target.value,
                                        }
                                    }));
                                }}
                            >
                                {formData.rsStaffEligibilityClasses &&
                                    formData.rsStaffEligibilityClasses.map((option) => (
                                        <MenuItem key={option.bedtypeRid} value={option.bedtypeRid}>
                                            {option.bedtypeName}
                                        </MenuItem>
                                    ))
                                }
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
                            //     setSaveForm(prevState => ({
                            //         ...prevState,
                            //         addNewStaffDto: {
                            //             ...prevState.addNewStaffDto,
                            //             "": e.target.value,
                            //         }
                            //     }));
                            // }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffDesignation": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsSchedulable": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Is a Service Provider"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsServiceProvider": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Active"
                            // onChange={(e) => {
                            //     setSaveForm(prevState => ({
                            //         ...prevState,
                            //         addNewStaffDto: {
                            //             ...prevState.addNewStaffDto,
                            //             "": (e.target.checked === true) ? 1 : 0,
                            //         }
                            //     }));
                            // }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Is Roster Applicable"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffToBeRostered": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
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
                                    const specIndex = formData.specialities.findIndex(obj => obj.ddIndex == e.target.value);
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffSpecialityIndex": e.target.value,
                                            "staffSpecialityAbbrv": formData.specialities[specIndex].ddAbbrv
                                        }
                                    }));
                                }}
                            // onChange={(e) => {
                            //     const specIndex = saveForm.specialities.findIndex(obj => obj.ddIndex == e.target.value);
                            //     setSaveForm(prevState => ({
                            //         ...prevState,
                            //         staffDetailsDto: {
                            //             ...prevState.staffDetailsDto,
                            //             "staffSpecialityIndex": e.target.value,
                            //             "staffSpecialityAbbrv": saveForm.specialities[specIndex].ddAbbrv

                            //         }
                            //     }));
                            // }}
                            // value={saveForm.staffDetailsDto.staffSpecialityIndex || ""}
                            >
                                {formData.specialities &&
                                    formData.specialities.map((option) => (
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsConsultant": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="External Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsExtDoctor": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffMaxConsultationNo": e.target.value,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffRefRid": e.target.value,
                                        }
                                    }));
                                }}
                            >
                                {formData.rsReferralType &&
                                    formData.rsReferralType.map((option) => (
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffCanRefer": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Admitting Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsAdmittingDoctor": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1, textAlign: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Primary Admitting Doctor"
                                onChange={(e) => {
                                    setSaveForm(prevState => ({
                                        ...prevState,
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffIsPrimaryAdmitDoc": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffRegistrationNum": e.target.value,
                                        }
                                    }));
                                }}
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
                                        "chkRequirePreCons": (e.target.checked === true) ? 1 : 0,
                                    }));
                                }}
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
                                        addNewStaffDto: {
                                            ...prevState.addNewStaffDto,
                                            "staffHasMultiLocAccess": (e.target.checked === true) ? 1 : 0,
                                        }
                                    }));
                                }}
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
                                    const selectedUnit = formData.rsUnits.find(unit => unit.unitRid === selectedUnitRid);
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
                                value={unitRow.suUnitRid || ""}
                            >
                                {formData.rsUnits &&
                                    formData.rsUnits.map((option) => (
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
                            // value={unitRow.suIsPrimaryUnit || false}
                            />
                        </Grid>
                        <Grid xs={3} item sx={{ p: 1 }}>
                            <Button
                                primary
                                disabled={(unitRow.suUnitRid === 0) ? true : false}
                                onClick={() => {
                                    // Check if the selected unit already exists in staffMappedUnits
                                    const isUnitAlreadyAdded = saveForm.staffMappedUnits && saveForm.staffMappedUnits.some(unit => unit.suUnitRid === unitRow.suUnitRid);

                                    // Check for duplicate primary key
                                    const isDuplicatePrimaryKey = saveForm.staffMappedUnits && saveForm.staffMappedUnits.some(unit => unit.suIsPrimaryUnit === 1 && unitRow.suIsPrimaryUnit === 1);


                                    if (!isUnitAlreadyAdded && !isDuplicatePrimaryKey) {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            staffMappedUnits: Array.isArray(prevState.staffMappedUnits) ? [...prevState.staffMappedUnits, unitRow] : [unitRow]
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
                                }}
                            >
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
                                    //rows={(saveForm?.staffMappedUnits) ? saveForm.staffMappedUnits : {}}
                                    rows={saveForm?.staffMappedUnits || {}}
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
                                onClick={() => {
                                    handleSave()
                                }}
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

export default ADDSTAFF;
