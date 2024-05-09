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
    Input
} from "@mui/material";
import { tokens } from "../../../../theme";
import Header from "../../../../components/Header";
import Table from "../../../../components/waitingTable";
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid } from "@mui/x-data-grid";
//import Emr from "../EMR";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';

const OPENINGSTOCK = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const history = useNavigate();
    const jwtToken = localStorage.getItem("jwtToken");
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);
    const redirectToManageStockPage = () => {
        history('/manageStock'); // Redirect to Manage Stock page
    };

    const handleManageStock = () => {
        // clearBox(buttonId);
        // setSearchItemTable('');
        // setbatchTable('');
        redirectToManageStockPage();
        // setManageStock(
        // <Box
        //   display="flex"
        //   justifyContent="space-between"
        //   alignItems="center"
        //   backgroundColor={colors.primary[400]}
        // >
        //   <Grid xs={12} container>
        //     <Grid
        //       xs={12}
        //       item
        //       sx={{ padding: "5px", backgroundColor: colors.blueAccent[700] }}
        //     >
        //       <Box
        //         sx={{
        //           display: "inline-block",
        //           backgroundColor: "#FDF5E6",
        //           borderRadius: "8px",
        //         }}
        //       >
        //         <Typography variant="h3" sx={{ padding: "8px" }}>
        //           Manage Stock
        //         </Typography>
        //       </Box>
        //     </Grid>
        //     <Grid xs={12} item sx={{ p: 2, paddingRight: 0, paddingLeft: 0.5 }}>
        //       <RadioGroup
        //         aria-labelledby="radio-buttons-group"
        //         defaultValue="Stock Position as on"
        //         name="radio-buttons-group"
        //       >
        //         <Grid container sx={{ p: 0 }}>
        //           <Grid xs={12} item sx={{ p: 0 }}>
        //             <Grid container
        //             >
        //               <FormControlLabel
        //                 value="Stock Position as on"
        //                 control={<Radio size="small" />}
        //                 label="Stock Position as on"
        //                 sx={{
        //                   paddingTop: "3",
        //                   marginRight: 0.5
        //                 }}
        //               />
        //               <Typography
        //                 variant="body1"
        //                 sx={{
        //                   padding: "2px",
        //                   backgroundColor: "#FDF5E6",
        //                   border: '1px solid lightgray',
        //                   borderRadius: '4px',
        //                   display: 'flex',
        //                   alignItems: 'center',
        //                   userSelect: 'none',
        //                   marginTop: "4px",
        //                   height: "29px"
        //                 }}
        //               >
        //                 {new Date().toLocaleDateString()}
        //               </Typography>
        //             </Grid>
        //             <Box sx={{ p: 0, marginLeft: "25px", marginRight: "0" }}>
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Show Batch Wise"
        //                 checked={true}
        //               />
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Include Items with Zero Qty"
        //               />
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Exclude Expired Stock"
        //               />
        //             </Box>
        //           </Grid>
        //           <Grid xs={6.4} item>
        //             <Box sx={{ maxWidth: "350px" }}>
        //               <FormControlLabel
        //                 value="Stock Below Reorder Level"
        //                 control={<Radio size="small" />}
        //                 label="Stock Below Reorder Level"
        //               />
        //               <FormControlLabel
        //                 value="Expired Stock"
        //                 control={<Radio size="small" />}
        //                 label="Expired Stock"
        //               />
        //               <FormControlLabel
        //                 value="Show Items with Zero Qty"
        //                 control={<Radio size="small" />}
        //                 label="Show Items with Zero Qty"
        //               />
        //               <Box
        //                 sx={{
        //                   display: "flex",
        //                   alignItems: "center",
        //                 }}
        //               >
        //                 <FormControlLabel
        //                   value="Stock Expiring in"
        //                   control={<Radio size="small" />}
        //                   label="Stock Expiring in"
        //                 />
        //                 <TextField
        //                   size="small"
        //                   color="secondary"
        //                   id="outlined-basic"
        //                   variant="outlined"
        //                   inputProps={{ maxLength: 3 }}
        //                   sx={{ flex: 0.4, marginRight: 0.25, marginLeft: -1.5 }}
        //                 />
        //                 <TextField
        //                   sx={{ flex: 0.7, textAlign: "center" }}
        //                   fullWidth
        //                   select
        //                   size="small"
        //                   color="secondary"
        //                   id="outlined-basic"
        //                   // value={selectedDate}
        //                   // defaultValue="Months"
        //                   // onChange={handleDateChange}
        //                   variant="outlined"
        //                 >
        //                   <MenuItem value="Days">Days</MenuItem>
        //                   <MenuItem value="Months">Months</MenuItem>
        //                   <MenuItem value="Years">Years</MenuItem>
        //                 </TextField>
        //               </Box>
        //             </Box>
        //           </Grid>
        //         </Grid>
        //       </RadioGroup>
        //     </Grid>
        //     {/* <Grid xs={12} item sx={{ p: 3 }}>
        //       <item>
        //         <TextField
        //           sx={{ m: 1, width: "30%" }}
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Entity"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 1, width: "30%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Store"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 1, width: "30%" }}
        //           fullWidth
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Item Name/Code"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 1, width: "30%" }}
        //           fullWidth
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Batch No."
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 1, width: "30%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Item Type"
        //           variant="outlined"
        //         />
        //         {/* <TextField
        //           sx={{ m: 0.25, width: "40%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Group"
        //           variant="outlined"
        //         /> 
        //       </item>
        //     </Grid> */}
        //      <Grid xs={3} item sx={{ p: 3 }}>
        //       <item>
        //         <TextField
        //           sx={{ m: 0.25 }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Sub Group"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25 }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="VED Category"
        //           variant="outlined"
        //         />
        //         <Grid container>
        //           <Grid item xs={5}>
        //             <Typography variant="body1" sx={{ paddingTop: "6px" }}>
        //               Stock Type
        //             </Typography>
        //           </Grid>
        //           <Grid item xs={5}>
        //             <FormControlLabel
        //               control={<Radio size="small" />}
        //               label="Consignment"
        //             />
        //             <FormControlLabel
        //               control={<Radio size="small" />}
        //               label=" Normal"
        //             />
        //           </Grid>
        //         </Grid>
        //         <Grid container>
        //           <Grid item xs={5}>
        //             <Typography variant="body1" sx={{ paddingTop: "8px" }}>
        //               View
        //             </Typography>
        //           </Grid>
        //           <Grid item xs={5}>
        //             <FormControlLabel
        //               control={<Checkbox size="small" />}
        //               label="Discontinued Items"
        //             />
        //           </Grid>
        //         </Grid>
        //       </item>
        //     </Grid>
        //   </Grid>
        // </Box>
        // <Box
        //   display="flex"
        //   justifyContent="space-between"
        //   alignItems="center"
        //   backgroundColor={colors.primary[400]}
        // >
        //   <Grid xs={12} container>
        //     <Grid
        //       xs={12}
        //       item
        //       sx={{ padding: "5px", backgroundColor: colors.blueAccent[700] }}
        //     >
        //       <Box
        //         sx={{
        //           display: "inline-block",
        //           backgroundColor: "#FDF5E6",
        //           borderRadius: "8px",
        //         }}
        //       >
        //         <Typography variant="h3" sx={{ padding: "8px" }}>
        //           Manage Stock
        //         </Typography>
        //       </Box>
        //     </Grid>
        //     <Grid xs={7} item sx={{ p: 3, paddingRight: 0, paddingLeft: 0.5 }}>
        //       <RadioGroup
        //         aria-labelledby="radio-buttons-group"
        //         defaultValue="Stock Position as on"
        //         name="radio-buttons-group"
        //       >
        //         <Grid container sx={{ p: 0 }}>
        //           <Grid xs={5.6} item sx={{ p: 0 }}>
        //             <Grid
        //               container
        //             >
        //               <FormControlLabel
        //                 value="Stock Position as on"
        //                 control={<Radio size="small" />}
        //                 label="Stock Position as on"
        //                 sx={{
        //                   paddingTop: "3",
        //                   marginRight: 0.5
        //                 }}
        //               />
        //               <Typography
        //                 variant="body1"
        //                 sx={{
        //                   padding: "2px",
        //                   backgroundColor: "#FDF5E6",
        //                   border: '1px solid lightgray',
        //                   borderRadius: '4px',
        //                   display: 'flex',
        //                   alignItems: 'center',
        //                   userSelect: 'none',
        //                   marginTop: "4px",
        //                   height: "29px"
        //                 }}
        //               >
        //                 {new Date().toLocaleDateString()}
        //               </Typography>
        //             </Grid>
        //             <Box sx={{ p: 0, marginLeft: "25px", marginRight: "0" }}>
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Show Batch Wise"
        //               />
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Include Items with Zero Qty"
        //               />
        //               <FormControlLabel
        //                 control={<Checkbox size="small" />}
        //                 label="Exclude Expired Stock"
        //               />
        //             </Box>
        //           </Grid>
        //           <Grid xs={6.4} item>
        //             <Box sx={{ maxWidth: "350px" }}>
        //               <FormControlLabel
        //                 value="Stock Below Reorder Level"
        //                 control={<Radio size="small" />}
        //                 label="Stock Below Reorder Level"
        //               />
        //               <FormControlLabel
        //                 value="Expired Stock"
        //                 control={<Radio size="small" />}
        //                 label="Expired Stock"
        //               />
        //               <FormControlLabel
        //                 value="Show Items with Zero Qty"
        //                 control={<Radio size="small" />}
        //                 label="Show Items with Zero Qty"
        //               />
        //               <Box
        //                 sx={{
        //                   display: "flex",
        //                   alignItems: "center",
        //                 }}
        //               >
        //                 <FormControlLabel
        //                   value="Stock Expiring in"
        //                   control={<Radio size="small" />}
        //                   label="Stock Expiring in"
        //                 />
        //                 <TextField
        //                   size="small"
        //                   color="secondary"
        //                   id="outlined-basic"
        //                   variant="outlined"
        //                   inputProps={{ maxLength: 3 }}
        //                   sx={{ flex: 0.4, marginRight: 0.25, marginLeft: -1.5 }}
        //                 />
        //                 <TextField
        //                   sx={{ flex: 0.7, textAlign: "center" }}
        //                   fullWidth
        //                   select
        //                   size="small"
        //                   color="secondary"
        //                   id="outlined-basic"
        //                   // value={selectedDate}
        //                   // defaultValue="Months"
        //                   // onChange={handleDateChange}
        //                   variant="outlined"
        //                 >
        //                   <MenuItem value="Days">Days</MenuItem>
        //                   <MenuItem value="Months">Months</MenuItem>
        //                   <MenuItem value="Years">Years</MenuItem>
        //                 </TextField>
        //               </Box>
        //             </Box>
        //           </Grid>
        //         </Grid>
        //       </RadioGroup>
        //     </Grid>
        //     <Grid xs={2} item sx={{ paddingTop: 3, paddingLeft: 1 }}>
        //       <item>
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Entity"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Store"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           fullWidth
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Item Name/Code"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           fullWidth
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Batch No."
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Item Type"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25, width: "95%" }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Group"
        //           variant="outlined"
        //         />
        //       </item>
        //     </Grid>
        //     <Grid xs={3} item sx={{ p: 3 }}>
        //       <item>
        //         <TextField
        //           sx={{ m: 0.25 }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="Sub Group"
        //           variant="outlined"
        //         />
        //         <TextField
        //           sx={{ m: 0.25 }}
        //           fullWidth
        //           select
        //           size="small"
        //           color="secondary"
        //           id="outlined-basic"
        //           label="VED Category"
        //           variant="outlined"
        //         />
        //         <Grid container>
        //           <Grid item xs={5}>
        //             <Typography variant="body1" sx={{ paddingTop: "6px" }}>
        //               Stock Type
        //             </Typography>
        //           </Grid>
        //           <Grid item xs={5}>
        //             <FormControlLabel
        //               control={<Radio size="small" />}
        //               label="Consignment"
        //             />
        //             <FormControlLabel
        //               control={<Radio size="small" />}
        //               label=" Normal"
        //             />
        //           </Grid>
        //         </Grid>
        //         <Grid container>
        //           <Grid item xs={5}>
        //             <Typography variant="body1" sx={{ paddingTop: "8px" }}>
        //               View
        //             </Typography>
        //           </Grid>
        //           <Grid item xs={5}>
        //             <FormControlLabel
        //               control={<Checkbox size="small" />}
        //               label="Discontinued Items"
        //             />
        //           </Grid>
        //         </Grid>
        //       </item>
        //     </Grid>
        //   </Grid>
        // </Box>);
    };

    const serviceTableColumns = [
        {
            field: "code",
            headerName: "Code",
            // flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "item_name",
            headerName: "Item Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "uom",
            headerName: "Uom",
            //flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "batchNo",
            headerName: "Batch No",
            //flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "rate",
            headerName: "Rate",
            //  flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "qty",
            headerName: "Qty",
            //  flex: 1,
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
            formData.append("excelFile", selectedFile)
            fetch(`http://10.197.8.17:2023/hmis/api/v1/price/inventoryPriceUpload`, {
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
                    // setData(() => {
                    //   data[1].id = 1;
                    //   return data;
                    // });
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
                <Header title="Opening Stock" />
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
                    onClick={() => {
                        handleManageStock();
                    }}
                >
                    Manage Stock
                </Button>
            </Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <Grid container alignItems="center" justifyContent="center">
                    <Grid xs={11.5} item sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <a
                            href="/Opening_Stock_Template.xlsx"
                            download="Opening Stock_ Template.xlsx"
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
                        </Box>
                    </Grid>
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
                            height="43vh"
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
                                        getRowId={(row) => row.code}
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
export default OPENINGSTOCK;