import * as React from "react";
import { useState, useEffect } from "react";
import {
    Divider,
    Box,
    Button,
    useTheme,
    TextField,
    Grid,
    FormControl,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import { DataGrid } from "@mui/x-data-grid";

const ROLEMASTER = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [rows, setRows] = useState([]);
    const [featuresRows, setFeaturesRows] = useState([]);
    const [accessFeaturesRows, setAccessFeaturesRows] = useState([]);
    const [rolesPopup, setRolesPopup] = useState(false);

    const [searchForm, setSearchForm] = useState({
        searchString: "",
        showActive: 0,
    });
    const [saveForm, setSaveForm] = useState({
        roleRID: 0,
        roleName: "",
        newlyAssignedFeatures: [],
        deletedFeatures: [],
        roleValid: 0,
        roleProdRid: 0,
    });

    const columns = [
        {
            field: "roleName",
            headerName: "Roles",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
        {
            field: "roleValid",
            headerName: "Active",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
    ];

    const featuresColumns = [
        {
            field: "featureName",
            headerName: "Feature name",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
        {
            field: "fgGroupName",
            headerName: "Feature group",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
    ];

    const newlyAssignedColumns = [
        {
            field: "featureName",
            headerName: "Features recently added",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
        {
            field: "fgGroupName",
            headerName: "Groups",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
    ];

    const accessFeaturesColumns = [
        {
            field: "featureName",
            headerName: "Acccesible features",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
        {
            field: "fgGroupName",
            headerName: "Accessible groups",
            headerAlign: "center",
            align: "center",
            flex: 5,
        },
    ];

    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/rolemaster/open`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
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
                setRows(data);
                //console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching Role Master Data:", error);
            });
    }, []);

    const handleSearch = () => {
        const queryParams = new URLSearchParams(searchForm);
        const url = `http://10.197.8.17:2023/hmis/api/v1/rolemaster/search?${queryParams}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
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
                setRows(data);
            })
            .catch((error) => {
                console.error("Error fetching Role Search Details:", error);
            });
    };

    const handleRoleClick = (row) => {
        const url = `http://10.197.8.17:2023/hmis/api/v1/rolemaster/viewRoleDetails?roleRID=${row.tranrid}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
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
                setFeaturesRows(data.featuresHasRole);
                setAccessFeaturesRows(data.roleHasFeatures);
                setSaveForm((saveForm) => ({
                    ...saveForm,
                    roleRID: row.tranrid,
                    roleName: row.roleName,
                    roleValid: (row.roleValid == "YES") ? 1 : 0,
                }));
            })
            .catch((error) => {
                console.error("Error fetching Role Name Features Data:", error);
            });
    };

    const handleSave = () => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/rolemaster/saveRole`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(saveForm),
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
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Box m="10px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Role Master" />
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                {/* <FormControl fullWidth> */}
                <Grid
                    xs={12}
                    container
                    alignItems="center"
                    sx={{ paddingTop: 1, paddingLeft: 1.5 }}
                >
                    <Grid xs={4} item sx={{ p: 0.5 }}>
                        <TextField
                            sx={{ ml: 0.5, width: "75%" }}
                            fullWidth
                            size="small"
                            color="secondary"
                            id="outlined-basic"
                            label="Enter Role Name To Search"
                            variant="outlined"
                            onChange={(e) => {
                                setSearchForm(() => ({
                                    ...searchForm,
                                    searchString: e.target.value,
                                }));
                            }}
                            value={searchForm.searchString || ""}
                        ></TextField>
                    </Grid>
                    <Grid xs={2} item sx={{ p: 0.5 }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show active only"
                            checked={searchForm.showActive === 1}
                            onChange={(e) => {
                                setSearchForm({
                                    ...searchForm,
                                    showActive: e.target.checked ? 1 : 0,
                                });
                            }}
                        />
                    </Grid>
                    <Grid xs={1} item sx={{ p: 0.5 }}>
                        <Button
                            sx={{
                                marginLeft: 6,
                                backgroundColor: colors.blueAccent[700],
                                color: colors.grey[100],
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: "10px,20px",
                            }}
                            onClick={() => {
                                handleSearch();
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
                <Divider
                    textAlign="left"
                    variant="middle"
                    sx={{
                        p: 0.5,
                        borderColor: "#3da58a",
                        "&::before, &::after": { borderColor: "#3da58a" },
                        color: "primary.main",
                    }}
                ></Divider>
                <Grid>
                    <Box
                        display="flex"
                        m="5px"
                        height="80vh"
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
                        <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(row) => row.tranrid}
                                onRowClick={(params) => {
                                    setRolesPopup(true);
                                    handleRoleClick(params.row);
                                }}
                            />
                        </div>
                    </Box>
                    <Popup
                        title="Roles"
                        openPopup={rolesPopup}
                        setOpenPopup={setRolesPopup}
                        popupWidth={"xl"}
                        showCloseButton={true}
                    >
                        <Grid x={12} container>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="rolesName"
                                    contentEditable={false}
                                    fullWidth
                                    size="small"
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Role Name"
                                    variant="outlined"
                                    value={saveForm.roleName || ""}
                                ></TextField>
                            </Grid>
                        </Grid>
                        <Divider
                            textAlign="left"
                            variant="middle"
                            sx={{
                                borderColor: "#3da58a",
                                "&::before, &::after": { borderColor: "#3da58a" },
                                color: "primary.main",
                            }}
                        ></Divider>
                        <Grid
                            container
                            spacing={0.2}
                            justifyContent="space-evenly"
                            alignItems="center"
                        >
                            <Grid xs={5} item>
                                <Box
                                    display="flex"
                                    m="7px"
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
                                    <div style={{ height: "100%", width: "100%" }}>
                                        <DataGrid
                                            rows={featuresRows}
                                            columns={featuresColumns}
                                            getRowId={(row) => row.featureRid}
                                            onRowClick={(params) => {
                                                setSaveForm((saveForm) => ({
                                                    ...saveForm,
                                                    newlyAssignedFeatures: [
                                                        ...saveForm.newlyAssignedFeatures.concat(
                                                            params.row
                                                        ),
                                                    ],
                                                }));
                                                setFeaturesRows((deleteOne) => {
                                                    return deleteOne.filter(
                                                        (item) => item.featureRid !== params.row.featureRid
                                                    );
                                                });
                                                // <FormControlLabel
                                                //   control={<Checkbox />}
                                                //   label="Is Active"
                                                //   checked={saveForm.roleValid === 1}
                                                //   onChange={(e) => {
                                                //     setSaveForm({
                                                //       ...saveForm,
                                                //       roleValid: e.target.checked ? 1 : 0,
                                                //     });
                                                //   }}
                                                // />;
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Grid>
                            <Grid xs={5} item>
                                <Box
                                    display="flex"
                                    m="7px"
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
                                    <div style={{ height: "100%", width: "100%" }}>
                                        <DataGrid
                                            rows={saveForm.newlyAssignedFeatures}
                                            columns={newlyAssignedColumns}
                                            getRowId={(row) => row.featureRid}
                                            onRowClick={(params) => {
                                                setFeaturesRows(featuresRows.concat(params.row));
                                                setSaveForm((saveForm) => ({
                                                    ...saveForm,
                                                    newlyAssignedFeatures: [
                                                        ...saveForm.newlyAssignedFeatures.filter(
                                                            (item) =>
                                                                item.featureRid !== params.row.featureRid
                                                        ),
                                                    ],
                                                }));
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Grid>
                            <Grid xs={5} item>
                                <Box
                                    display="flex"
                                    m="7px"
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
                                    <div style={{ height: "100%", width: "100%" }}>
                                        <DataGrid
                                            rows={accessFeaturesRows}
                                            columns={accessFeaturesColumns}
                                            getRowId={(row) => row.featureRid}
                                            onRowClick={(params) => {
                                                setSaveForm((saveForm) => ({
                                                    ...saveForm,
                                                    deletedFeatures: [
                                                        ...saveForm.deletedFeatures.concat(params.row),
                                                    ],
                                                }));
                                                setAccessFeaturesRows((selectedDrop) => {
                                                    return selectedDrop.filter(
                                                        (item) => item.featureRid !== params.row.featureRid
                                                    );
                                                });
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Grid>

                            <Grid container style={{ justifyContent: "right" }}>
                                <Grid item sx={{ p: 1 }}>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            handleSave(saveForm);
                                            // console.log(saveForm);
                                            // console.log(newlyAssignedRows);
                                            // setSaveForm();
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* <Button sx={{ m: 1 }} variant="outlined" size="small">
                  Add Selected
                </Button>
                <Grid container style={{ justifyContent: "right" }}>
                  <Grid item sx={{ p: 1 }}>
                    <Button
                      sx={{ width: 100 }}
                      variant="contained"
                      color="secondary"
                    >
                      Remove Selected
                    </Button>
                  </Grid>
                </Grid>
                <Button
                  sx={{
                    m: 1,
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px,20px",
                  }}
                  onClick={(e) => {
                    handleSave();
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button> */}
                        </Grid>
                    </Popup>
                </Grid>
                {/* </FormControl> */}
            </Box>
        </Box>
    );
};

export default ROLEMASTER;
