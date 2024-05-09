import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    useTheme,
    FormControl,
    TextField,
    Grid,
    MenuItem,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Select,
} from "@mui/material";
import { tokens } from "../../../../theme";
import Header from "../../../../components/Header";
import Table from "../../../../components/waitingTable";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//import Emr from "../EMR";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';

const MANAGESTOCK = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const history = useNavigate();
    const jwtToken = localStorage.getItem("jwtToken");
    const currentDate = new Date().toLocaleDateString('en-GB');
    const [masterData, setMasterData] = useState({});
    const [viewTableData, setViewTableData] = useState("");
    const [groupData, setGroupData] = useState();
    const [subGroupData, setSubGroupData] = useState();
    const [formData, setFormData] = useState({
        "stockOption": 0,
        "locationRID": 0,
        "isAcrossAccessibleUnit": 0,
        "group1": 0,
        "group2": 0,
        "group3": 0,
        "searchString": "",
        "stockDate": "",
        "excludeExpiredStock": "",
        "showZeroStockOnly": "",
        "showZeroStock": "",
        "expMonth": 0,
        "expStrValue": "",
        "itemType": 0,
        "groupValue": 0,
        "subGroupValue": 0,
        "skuCaution": 0,
        "skuDiscontinue": 0,
        "batchCode": "",
        "consignment": 0,
        "viewBy": "",
        "isStoreWise": "",
        "showPendingItems": "",
        "storeRID": 0,
        "isSupplierWise": "",
        "supplierRID": 0,
        "discardType": "",
        "vedcategory": 0
    }
    );
    const redirectToOpeningStockPage = () => {
        history('/openingStock'); // Redirect to Opening Stock page
    };
    const handleOpeningStock = () => {
        redirectToOpeningStockPage();
    };

    //Column Defination for View Table
    const viewTableColumn = [
        {
            field: "description",
            headerName: "Item Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "batchNo.",
            headerName: "Batch No.",
            flex: 1,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "expiryDate",
            headerName: "Expiry",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "code",
            headerName: "Code",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "uom",
            headerName: "UOM",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
    ];
    useEffect(() => {
        fetch('http://10.197.8.17:2023/hmis/api/v1/inventory/manageStock/data', {
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
                console.error('Error fetching  Manage Stock Master Data:', error);
            });
    }, []);

    const setDefaultValues = (data) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            //locationRID: data.locationRID,
            locationRID: 115,
            isAcrossAccessibleUnit: 1,
            stockOption: 1,
            // viewBy:"GROUP",
            group1: 1,
            stockDate: currentDate,
        }));
    };

    const onChange = (e) => {
        if (e.target.name === 'itemType') {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/inventory/group/${e.target.value}`, {
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
                    setGroupData(data);
                })
                .catch((error) => {
                    console.error('Error fetching  Manage Stock Master Data:', error);
                });
        }
        if (e.target.name === 'groupValue') {
            fetch(`http://10.197.8.17:2023/hmis/api/v1/inventory/subgroup/${formData.groupValue}`, {
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
                    setSubGroupData(data);
                })
                .catch((error) => {
                    console.error('Error fetching  Manage Stock Master Data:', error);
                });
        }
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const handleShowList = () => {
        console.log(formData);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/inventory/manageStock/view`, {
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
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setViewTableData(data);
            })
            .catch((error) => {
                console.error('Error in Fetching Stock List :', error);
            });
    };
    return (
        <Box m="10px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Manage Stock" />
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                marginBottom="10px"
            >
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "2",
                        mr: "1px",
                    }}
                    onClick={() => {
                        handleOpeningStock();
                    }}
                >
                    Opening Stock
                </Button>
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "2",
                    }}
                >
                    Manage Stock
                </Button>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                backgroundColor={colors.primary[400]}
            >
                <Grid xs={12} container>
                    <Grid xs={7} item sx={{ p: 3, paddingRight: 0, paddingLeft: 0.5 }}>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group"
                            defaultValue="Stock Position as on"
                            name="radio-buttons-group"
                        >
                            <Grid container sx={{ p: 0 }}>
                                <Grid xs={5.6} item sx={{ p: 0 }}>
                                    <Grid container >
                                        <FormControlLabel
                                            value="Stock Position as on"
                                            control={<Radio size="small" />}
                                            label="Stock Position as on"
                                            onChange={(e) => {
                                                const updatedValue = e.target.checked ? 1 : 0;
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    "stockOption": updatedValue,
                                                }));
                                            }}
                                            sx={{
                                                paddingTop: "3",
                                                marginRight: 0.5
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                padding: "2px",
                                                backgroundColor: "#FDF5E6",
                                                border: '1px solid lightgray',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                userSelect: 'none',
                                                marginTop: "4px",
                                                height: "29px"
                                            }}
                                        >
                                            {new Date().toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Box sx={{ p: 0, marginLeft: "25px", marginRight: "0" }}>
                                        <FormControlLabel
                                            control={<Checkbox size="small" />}
                                            label="Show Batch Wise"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox size="small" />}
                                            label="Include Items with Zero Qty"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox size="small" />}
                                            label="Exclude Expired Stock"
                                        />
                                    </Box>
                                </Grid>
                                <Grid xs={6.4} item>
                                    <Box sx={{ maxWidth: "350px" }}>
                                        <FormControlLabel
                                            value="Stock Below Reorder Level"
                                            control={<Radio size="small" />}
                                            label="Stock Below Reorder Level"
                                            onChange={(e) => {
                                                const updatedValue = e.target.checked ? 2 : 0;
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    "stockOption": updatedValue,
                                                }));
                                            }}
                                        />
                                        <FormControlLabel
                                            value="Expired Stock"
                                            control={<Radio size="small" />}
                                            label="Expired Stock"
                                            onChange={(e) => {
                                                const updatedValue = e.target.checked ? 3 : 0;
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    "stockOption": updatedValue,
                                                }));
                                            }}
                                        />
                                        <FormControlLabel
                                            value="Show Items with Zero Qty"
                                            control={<Radio size="small" />}
                                            label="Show Items with Zero Qty"
                                            onChange={(e) => {
                                                const updatedValue = e.target.checked ? 4 : 0;
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    "stockOption": updatedValue,
                                                }));
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <FormControlLabel
                                                value="Stock Expiring in"
                                                control={<Radio size="small" />}
                                                label="Stock Expiring in"
                                                onChange={(e) => {
                                                    const updatedValue = e.target.checked ? 5 : 0;
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        "stockOption": updatedValue,
                                                    }));
                                                }}
                                            />
                                            <TextField
                                                disabled={(formData.stockOption != 5) ? true : false}
                                                size="small"
                                                color="secondary"
                                                id="outlined-basic"
                                                variant="outlined"
                                                inputProps={{ maxLength: 3 }}
                                                sx={{ flex: 0.4, marginRight: 0.25, marginLeft: -1.5 }}
                                            />
                                            <TextField
                                                disabled={(formData.stockOption != 5) ? true : false}
                                                sx={{ flex: 0.7, textAlign: "center" }}
                                                fullWidth
                                                select
                                                size="small"
                                                color="secondary"
                                                id="outlined-basic"
                                                // value={selectedDate}
                                                // defaultValue="Months"
                                                // onChange={handleDateChange}
                                                variant="outlined"
                                            >
                                                <MenuItem value="Days">Days</MenuItem>
                                                <MenuItem value="Months">Months</MenuItem>
                                                <MenuItem value="Years">Years</MenuItem>
                                            </TextField>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </Grid>
                    <Grid xs={2} item sx={{ paddingTop: 3, paddingLeft: 1 }}>
                        <item>
                            {/* <TextField
                                sx={{ m: 0.25, width: "95%" }}
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Entity"
                                variant="outlined"
                            //value={formData.}
                            >
                                {masterData.entityListAcrossChainEntity &&
                                    masterData.entityListAcrossChainEntity.map((option) => (
                                        <MenuItem key={option.hospitalID} value={option.hospitalID}>
                                            {option.hospitalName}
                                        </MenuItem>
                                    ))}
                            </TextField> */}
                            <TextField
                                name='storeRID'
                                sx={{ m: 0.25, width: "95%" }}
                                fullWidth
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Store"
                                variant="outlined"
                                onChange={onChange}
                            >
                                {masterData.storeList &&
                                    masterData.storeList.map((option) => (
                                        <MenuItem key={option.unitID} value={option.unitID}>
                                            {option.unitName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <TextField
                                name='searchString'
                                sx={{ m: 0.25, width: "95%" }}
                                fullWidth
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Item Name/Code"
                                variant="outlined"
                                onChange={onChange}
                            />
                            <TextField
                                name='batchCode'
                                sx={{ m: 0.25, width: "95%" }}
                                fullWidth
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Batch No."
                                variant="outlined"
                                onChange={onChange}
                            />
                            <TextField
                                name='itemType'
                                sx={{ m: 0.25, width: "95%" }}
                                fullWidth
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Item Type"
                                variant="outlined"
                                onChange={onChange}
                            >
                                {masterData.itemTypeList &&
                                    masterData.itemTypeList.map((option) => (
                                        <MenuItem key={option.itemTypeID} value={option.itemTypeID}>
                                            {option.itemTypeName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <TextField
                                name='groupValue'
                                sx={{ m: 0.25, width: "95%" }}
                                fullWidth
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Group"
                                variant="outlined"
                                onChange={onChange}
                            >
                                {groupData &&
                                    groupData.map((option) => (
                                        <MenuItem key={option.groupRID} value={option.groupRID}>
                                            {option.groupName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </item>
                    </Grid>
                    <Grid xs={3} item sx={{ p: 3 }}>
                        <item>
                            <TextField
                                name='subGroupValue'
                                sx={{ m: 0.25 }}
                                fullWidth
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="Sub Group"
                                variant="outlined"
                                onChange={onChange}
                            >
                                {subGroupData &&
                                    subGroupData.map((option) => (
                                        <MenuItem key={option.subGroupRID} value={option.subGroupRID}>
                                            {option.subGroupName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <TextField
                                name='vedcategory'
                                sx={{ m: 0.25 }}
                                fullWidth
                                select
                                size="small"
                                color="secondary"
                                id="outlined-basic"
                                label="VED Category"
                                variant="outlined"
                                onChange={onChange}
                            >
                                {masterData.vedCategoryList &&
                                    masterData.vedCategoryList.map((option) => (
                                        <MenuItem key={option.vedCategoryID} value={option.vedCategoryID}>
                                            {option.vedCategoryName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <Grid container>
                                <Grid item xs={5}>
                                    <Typography variant="body1" sx={{ paddingTop: "6px" }}>
                                        Stock Type
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <RadioGroup
                                        aria-labelledby="radio-buttons-group"
                                        name="radio-buttons-group1"
                                    >
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Consignment"
                                            label="Consignment"
                                            onChange={(e) => {
                                                const updatedValue = e.target.checked ? 1 : 0;
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    "consignment": updatedValue,
                                                }));
                                            }}
                                        />
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Normal"
                                            label=" Normal"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        "consignment": 0,
                                                    }));
                                                }

                                            }}
                                        />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={5}>
                                    <Typography variant="body1" sx={{ paddingTop: "8px" }}>
                                        View
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControlLabel
                                        control={<Checkbox size="small" />}
                                        label="Discontinued Items"
                                    />
                                </Grid>
                            </Grid>
                        </item>
                    </Grid>
                    <Grid xs={12} item>
                        <Box>
                            <Grid
                                xs={12}
                                item
                                sx={{ paddingBottom: 1 }}
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <Button
                                    sx={{ m: "9px", mb: "0" }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleShowList}
                                >
                                    List
                                </Button>
                                <Button
                                    sx={{ m: "9px", mb: "0" }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setViewTableData("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {viewTableData.length > 0 && (
                <Box display="flex" justifyContent="center"
                    m="5px 0 0 0"
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
                            rows={viewTableData}
                            columns={viewTableColumn}
                            getRowId={(row) => row.code}
                        />
                    </div>

                </Box>
            )}

        </Box>
    );
};
export default MANAGESTOCK;