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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const IPD = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [masterData, setMasterData] = useState({});
    const [gridRows, setGridRows] = React.useState([]);
    const [wardSearchString, setWardSearchString] = useState('');
    const [wardRid, setWardRid] = useState('');
    const [wardSearchResults, setWardSearchResults] = useState([]);
    const [openSearchPopup, setOpenSearchPopup] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({
        "wardRID": 0,
        "wardName": "",
        "wardCode": "",
        "wardUnitRID": 0,
        "wardIsICU": "",
        "wardIsActive": "1",
        "wardIsVirtual": 0,
        "wardBedTypeRID": 0,
        "wardType": "",
        "bedList": []
    });
    useEffect(() => {
        if (gridRows.length == 0) {
            const uniqueId = Date.now();
            const newBed = {
                rowId: uniqueId,
                bedRID: 0,
                bedNo: "",
                bedIsActive: "",
                bedStatus: 0,
                bedTypeIndex: 0,
                bedWardRID: 0,
                bedIsVirtual: 0,
                bedTeamRID: 0,
                bedEquipmentRID: 0,
                bedOccupiedPatientRID: 0
            };

            // Update the state to include the new row
            setGridRows((prevRows) => [...prevRows, newBed]);
        }
    }, [gridRows]);
    useEffect(() => {
        if (wardRid) {
            //api call to fetch Ward details of selected Ward from Search Table.
            fetch(`http://10.197.8.17:2023/hmis/api/v1/ward/view/${wardRid}`, {
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
                    const bedListWithRowId = data.bedList.map((bed) => ({
                        ...bed,
                        rowId: Date.now() + bed.bedRID, // Using 'Date.now()' for uniqueness
                    }));
                    setGridRows(bedListWithRowId);
                    setFormData(data);
                })
                .catch((error) => {
                    console.error('Error fetching Ward details:', error);
                });
        }
    }, [wardRid]);
    useEffect(() => {
        setGridRows([]);
        fetch('http://10.197.8.17:2023/hmis/api/v1/ward/masterData', {
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

        const uniqueId = Date.now();
        const newBed = {
            rowId: uniqueId,
            bedRID: 0,
            bedNo: "",
            bedIsActive: "",
            bedStatus: 0,
            bedTypeIndex: 0,
            bedWardRID: 0,
            bedIsVirtual: 0,
            bedTeamRID: 0,
            bedEquipmentRID: 0,
            bedOccupiedPatientRID: 0
        };

        // Update the state to include the new row
        setGridRows((prevRows) => [...prevRows, newBed]);
    }, []);
    const setDefaultValues = (data) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            wardType: 3,
            wardIsActive: "0",
            wardIsICU: "0",
        }));
    }
    const onChange = (e) => {
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const columns = [
        {
            field: 'rowId',
            hide: true
        },
        {
            field: 'bedNo',
            headerName: 'Bed',
            width: 130,
            editable: true,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <TextField
                    value={params.value}
                    onChange={(e) => params.api.setCellEditCommit(params.id, params.field, e.target.value)}
                />
            ),
        },
        {
            field: 'bedTeamRID',
            headerName: 'Team',
            width: 130,
            editable: true,
            headerAlign: "center",
            align: "center",
            // renderCell: (params) => (
            //     <FormControl fullWidth>
            //         <InputLabel id={`team-label-${params.id}`}>Team</InputLabel>
            //         <Select
            //             labelId={`team-label-${params.id}`}
            //             value={params.value}
            //             onChange={(e) => params.api.setCellEditCommit(params.id, params.field, e.target.value)}
            //         >
            //             <MenuItem value="Team A">Team A</MenuItem>
            //             <MenuItem value="Team B">Team B</MenuItem>
            //             <MenuItem value="Team C">Team C</MenuItem>
            //         </Select>
            //     </FormControl>
            // ),
        },
        {
            field: 'addRow',
            headerName: '',
            width: 120,
            renderCell: (params) => (
                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddRow}
                    color="primary"
                    variant="contained"
                >
                    Add Row
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: '',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRow(params.row.rowId)}
                >
                    Delete
                </Button>
            ),
        },
        {
            field: 'bedIsActive',
            headerName: 'Is Active',
            width: 130,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: params.value === '1' ? '#4CAF50' : '#FFA07A',
                        color: 'white',
                    }}
                    onClick={() => handleToggleActive(params)}
                >
                    {params.value === '1' ? 'Active' : 'Not Active'}
                </Button>
            ),
        },
    ];
    const wardSearchTableColumns = [
        {
            field: 'wardRID',
            hide: true,
        },
        {
            field: 'wardName',
            headerName: 'Ward Name',
            flex: 3,
            headerAlign: "center",
            align: "center",
        }
    ];
    const handleToggleActive = (params) => {
        const { id, value } = params;
        const updatedRows = gridRows.map((row) =>
            row.rowId === id ? { ...row, bedIsActive: value === '1' ? '0' : '1' } : row
        );
        setGridRows(updatedRows);
    };
    const handleAddRow = () => {
        // Generate a unique bedNo for the new row
        const uniqueId = Date.now();

        // Create a new bed object with default values
        const newBed = {
            rowId: uniqueId,
            bedRID: 0,
            bedNo: "",
            bedIsActive: "",
            bedStatus: 0,
            bedTypeIndex: 0,
            bedWardRID: 0,
            bedIsVirtual: 0,
            bedTeamRID: 0,
            bedEquipmentRID: 0,
            bedOccupiedPatientRID: 0
        };

        // Update the state to include the new row
        setGridRows((prevRows) => [...prevRows, newBed]);
    };
    const handleDeleteRow = (rowId) => {
        // Filter out the row with the specified id
        const updatedRows = gridRows.filter((row) => row.rowId !== rowId);

        // Update the state to remove the deleted row
        setGridRows(updatedRows);
    };
    const handleCellEditCommit = (params) => {
        const { id, field, value } = params;
        // For other fields, update directly
        const updatedRows = gridRows.map((row) =>
            row.rowId === id ? { ...row, [field]: value } : row
        );
        setGridRows(updatedRows);

    };

    const validate = () => {
        // Check for duplicate bed numbers
        const bedNumbers = new Set();
        let hasDuplicates = false;

        for (const row of gridRows) {
            if (bedNumbers.has(row.bedNo)) {
                hasDuplicates = true;
                break;
            } else {
                bedNumbers.add(row.bedNo);
            }
        }

        if (hasDuplicates) {
            // Show alert for duplicate bed numbers
            // You can use your alert component or any other method to show the alert
            setResponseMessage("Duplicate Bed found. Please correct and try again." + `!(${Date.now()})`);
            setMessageSeverty("error");
            setShowResponseAlert(true);
            console.error('Duplicate Bed numbers found. Please correct and try again.');
            return false;
        }

        // Continue with save logic if no duplicates
        console.log('No duplicates. Perform save logic.');

        // Perform save API call
        // ...

        return true;
    };

    const handleSave = () => {
        // Validate and save
        const isValid = validate();

        // If isValid is true, continue with the save logic
        if (isValid) {
            // Create a new array without the 'rowId' property
            const bedListWithoutRowId = gridRows.map(({ rowId, ...rest }) => rest);
            formData.bedList = bedListWithoutRowId;
            fetch(`http://10.197.8.17:2023/hmis/api/v1/ward/create`, {
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
                    console.log(data);
                    const clearedFormData = Object.keys(formData).reduce((clearedData, field) => {
                        clearedData[field] = '';
                        return clearedData;
                    }, {})
                    setFormData(clearedFormData);
                    setGridRows([]);
                })
                .catch((error) => {
                    console.error('Error in creating Ward:', error);
                });
        }
    };
    const handleSearch = () => {

        fetch('http://10.197.8.17:2023/hmis/api/v1/ward/view', {
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
                setWardSearchResults(data);
                setOpenSearchPopup(true);
            })
            .catch((error) => {
                console.error('Error fetching  master data:', error);
            });
    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="IPD" subtitle="Ward Master" />
                {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <Grid xs={12} container alignItems="center" sx={{ paddingTop: 1, paddingLeft: 3 }}>
                    <TextField
                        sx={{ ml: 1, width: "21.2%" }}
                        fullWidth size='small' color="secondary" id="outlined-basic"
                        label="Search String"
                        variant="outlined"
                        value={wardSearchString}
                        onChange={(e) => setWardSearchString(e.target.value)}
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
                        <Grid xs={3} item sx={{ p: 3 }}>
                            <item >
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="wardCode"
                                    fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Ward Code"
                                    variant="outlined"
                                    value={formData.wardCode || ""}
                                />
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="wardName"
                                    required fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Ward Name"
                                    variant="outlined"
                                    value={formData.wardName || ""}
                                />
                            </item>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 3 }}>
                            <item >
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="wardType"
                                    select fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Ward Type"
                                    variant="outlined"
                                    value={formData.wardType || ""}
                                >
                                    {masterData.wardType && masterData.wardType.map((option) => (
                                        <MenuItem key={option.wardTypeID} value={option.wardTypeID}>
                                            {option.wardTypeName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    sx={{ m: 1 }}
                                    //onChange={onChange}
                                    name="wardLabel"
                                    select required fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Ward Label"
                                    variant="outlined"
                                    value={""}
                                ></TextField>
                            </item>
                        </Grid>
                        <Grid xs={3} item sx={{ p: 3 }}>
                            <item >
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="wardBedTypeRID"
                                    select required fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Bed Type"
                                    variant="outlined"
                                    value={formData.wardBedTypeRID || ""}
                                >
                                    {masterData.bedType && masterData.bedType.map((option) => (
                                        <MenuItem key={option.bedTypeID} value={option.bedTypeID}>
                                            {option.bedTypeName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    sx={{ m: 1 }}
                                    onChange={onChange}
                                    name="wardUnitRID"
                                    select required fullWidth size='small' color="secondary" id="outlined-basic"
                                    label="Unit"
                                    variant="outlined"
                                    value={formData.wardUnitRID || ""}
                                >
                                    {masterData.unitList && masterData.unitList.map((option) => (
                                        <MenuItem key={option.unitID} value={option.unitID}>
                                            {option.unitName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </item>
                        </Grid>
                        <Grid xs={3} item sx={{ paddingTop: 4, paddingLeft: 9 }}>
                            <Grid xs={6} item sx={{}}>
                                <item>
                                    <FormControlLabel
                                        control={<Checkbox size="small" />}
                                        onChange={(e) => {
                                            const updatedValue = e.target.checked ? "1" : "0";
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                "wardIsICU": updatedValue,
                                            }));
                                            console.log("hii");
                                        }}
                                        name="wardIsICU"
                                        label="Is ICU"
                                    />
                                </item>
                            </Grid>
                            <Grid xs={6} item sx={{ paddingTop: 2 }}>
                                <item>
                                    <FormControlLabel
                                        control={<Checkbox size="small" />}
                                        onChange={(e) => {
                                            const updatedValue = e.target.checked ? "1" : "0";
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                "wardIsActive": updatedValue,
                                            }));
                                        }}
                                        name="wardIsActive"
                                        label="Is Active"
                                        value={formData.wardIsActive || ""}
                                    />
                                </item>
                            </Grid>


                        </Grid>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            p: 0.5, borderColor: "#3da58a",
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>
                    </Divider>
                    <Box
                        display="flex"
                        justifyContent="center"
                        m="5px 0 0 0"
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
                                height: 40, // Adjust the height of the header
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
                        <div style={{ height: 260, width: '100%' }}>
                            <DataGrid
                                rows={gridRows}
                                columns={columns}
                                pageSize={5}
                                disableSelectionOnClick
                                editMode="cell"
                                getRowId={(row) => row.rowId}
                                pagination
                                pageSizeOptions={[5, 10, 20]}
                                onCellEditCommit={handleCellEditCommit}
                                headerHeight={30}
                            />
                        </div>
                    </Box>
                </FormControl>
                <Button
                    sx={{ width: '100px', mr: '15px', float: 'right' }}
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}
                >
                    Save
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}>Save
                </Button> */}
            </Box>
            {wardSearchResults.length > 0 && (
                <Popup
                    title="Search Results"
                    openPopup={openSearchPopup}
                    setOpenPopup={setOpenSearchPopup}
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
                                rows={wardSearchResults}
                                columns={wardSearchTableColumns}
                                getRowId={(row) => row.wardRID}
                                onSelectionModelChange={(selectionModel) => {
                                    if (selectionModel && selectionModel.length > 0) {
                                        const selectedWardRid = selectionModel[0];
                                        console.log("Selected Ward Rid:", selectedWardRid);
                                        setWardRid(selectedWardRid);
                                        setOpenSearchPopup(false);
                                    } else {
                                        // No row is selected,
                                        setSelectedRow(null);
                                    }
                                }}
                            />
                        </div>
                    </Box>
                </Popup>
            )}
        </Box>
    );
};
export default IPD;