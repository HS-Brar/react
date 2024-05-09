import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Input,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import UploadIcon from '@mui/icons-material/Upload';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const ADMIN = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);
    const jwtToken = localStorage.getItem("jwtToken");
    const serviceTableColumns = [
        {
            field: "itemName",
            headerName: "Item Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "itemCode",
            headerName: "Item Code",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "visitType",
            headerName: "Visit Type",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },

        {
            field: "resident",
            headerName: "Resident",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "defaultPrice",
            headerName: "Service Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
        }
    ];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);

            // const reader = new FileReader();
            // reader.onload = (e) => {
            //     const data = e.target.result;
            //     const workbook = XLSX.read(data, { type: "binary" });
            //     const sheetName = workbook.SheetNames[0];
            //     const sheet = workbook.Sheets[sheetName];


            //     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            //     if (jsonData.length < 2) {
            //         setData([]);
            //     } else {
            //         const headers = jsonData[0];
            //         const jsonObject = jsonData.slice(1).map((row, index) => {
            //             const obj = { id: index + 1 };
            //             headers.forEach((header, index) => {
            //                 obj[header] = row[index];
            //             });
            //             return obj;
            //         });
            //         setData(jsonObject);
            //     }
            // };

            // reader.readAsBinaryString(file);
        }
    };


    const handleUploadButtonClick = () => {

        if (selectedFile) {
            console.log("Uploading file:", selectedFile);
            const formData = new FormData();
            formData.append("excel", selectedFile)
            fetch(`http://10.197.8.17:2023/hmis/api/v1/price/upload`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData,
                redirect: 'follow'
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
                    setData(data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error in Uploading File:', error);
                });

        } else {
            console.log("No file selected.");
        }
    };

    return (
        <Box m="10px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title="Hospital Pricing Master"
                />
            </Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <Grid container alignItems="center" justifyContent="center">
                    <Grid xs={11.5} item sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <a
                            href="/Registration Fee-Price Master.xlsx"
                            download="Registration Fee-Price Master.xlsx"
                        >
                            <Button
                                sx={{ width: '100px' }}
                                variant="contained"
                                color="secondary"
                            >
                                Download
                            </Button>
                        </a>
                    </Grid>
                    <Grid xs={6} sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="center">
                            <TextField
                                value={selectedFile ? selectedFile.name : "No file selected"}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <Input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="fileInput"
                            />
                            <label htmlFor="fileInput">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ height: '58px', marginLeft: 1 }}
                                >
                                    Browse
                                </Button>
                            </label>
                            {/* <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                                id="fileInput"
                            />
                            <label htmlFor="fileInput">
                                <IconButton
                                    sx={{
                                        fontSize: "large",
                                        width: "120px",
                                        height: "120px",
                                        m: "10px",
                                    }}
                                    color="secondary"
                                    component="span"
                                >
                                    <UploadIcon />
                                </IconButton>
                            </label> */}
                        </Box>
                    </Grid>

                    {/* <Grid xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Typography variant="body1" gutterBottom>
                                {selectedFile
                                    ? `Selected File: ${selectedFile.name}`
                                    : "No file selected"}
                            </Typography>
                        </Box>
                    </Grid> */}
                    <Grid xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleUploadButtonClick}
                                disabled={!selectedFile}
                            >
                                Upload
                            </Button>
                        </Box>
                    </Grid>
                    <Grid xs={12}>
                        <Box display="flex" justifyContent="center"
                            m="5px 0 0 0"
                            height="57vh"
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
                            {data.length > 0 && (
                                <div style={{ width: '100%', minHeight: '300px' }}>
                                    <DataGrid
                                        rows={data}
                                        columns={serviceTableColumns}
                                        getRowId={(row) => row.priceRID}
                                    />
                                </div>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ADMIN;
