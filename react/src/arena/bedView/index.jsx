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
    Card,
    Tabs,
    Tab,
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
import IconButton from '@mui/material/IconButton';
import HotelIcon from '@mui/icons-material/Hotel';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import HER from './Her';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const BEDVIEW = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");
    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);
    const [unitRid, setUnitRid] = useState(135);
    const [bedList, setBedList] = useState([]);
    const [value, setValue] = React.useState(0);
    const [selectedBeds, setSelectedBeds] = useState([]);
    

    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/nursing/bed/view/${unitRid}`, {
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
                if (data != null) {
                    setBedList(data);
                } else {
                    setBedList([]);
                }
            })
            .catch((error) => {
                console.error(`Error fetching Bed details for unitRid= ${unitRid}:`, error);
            });
    }, []);
    const BedCard = styled(Card)(({ theme, bedStatus }) => ({
        backgroundColor: bedStatus === 1 ? colors.greenAccent[700] : colors.blueAccent[700],
        color: theme.palette.grey[100],
        height: "200px",
        width: '100%',
        // marginLeft:'10px',
        // marginRight:'0px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: '',
        alignItems: 'center',
        cursor: 'pointer',
    }));
    const BedView = ({ bed }) => {
        let statusString = "";
        if (bed.patRID != 0 && bed.bedStatus === 1) {
            statusString = "Bed Is Occupied";
        }
        if (bed.patRID == 0 && bed.bedStatus === 0) {
            statusString = "Bed Is Available";
        }
        if (bed.patRID != 0 && bed.visitStatus === 0) {
            statusString = "Not Yet Arrived";
        }
        if (bed.patRID != 0 && bed.bedStatus === 1 && bed.visitStatus === 2) {
            statusString = "Bed is Reserved";
        }
        return (
            <BedCard bedStatus={bed.bedStatus} onClick={() => handleBedClick(bed)}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div>
                        <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 'bold', color: "black" }}>{bed.bedNo}</Typography>
                        <Typography variant="h6" sx={{ color: "black" }}>{bed.patientName}</Typography>
                        <Typography variant="h6" sx={{ color: "black" }}>{bed.patientMRN}</Typography>
                        <Typography variant="h6" sx={{ color: "black" }}>{(bed.age > 0) ? bed.age + " " + bed.ageUnit : ""}</Typography>
                        <Typography variant="h6" sx={{ color: "black" }}>{bed.staffName}</Typography>
                        <Typography variant="h6" sx={{ color: "black" }}>{bed.staffSpec}</Typography>
                        {bed.patGendrIndx === 1 && <MaleIcon fontSize="medium" sx={{ color: 'black' }} />}
                        {bed.patGendrIndx === 2 && <FemaleIcon fontSize="medium" sx={{ color: 'black' }} />}
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Typography variant="h4.5" sx={{ color: "black" }}>{statusString}</Typography>
                    </div>
                </div>
            </BedCard>

        );
    };


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleBedClick = (bed) => {
        console.log('Bed Clicked:', bed.bedNo);
        if (bed.bedStatus !== 1) {
            // Handle the click event for inactive beds
        } else {
            // Check if the bed is already selected
            const isBedSelected = selectedBeds.some((selectedBed) => selectedBed.bedNo === bed.bedNo);

            if (!isBedSelected) {
                setSelectedBeds((prevSelectedBeds) => [...prevSelectedBeds, bed]);

                // Automatically switch to the newly created tab
                setValue(selectedBeds.length + 1);
            }
        }
    };

    const handleCloseTab = (index) => {
        setSelectedBeds((prevSelectedBeds) => {
            const newSelectedBeds = [...prevSelectedBeds];
            newSelectedBeds.splice(index, 1);

            // Automatically switch to the "Bed View" tab
            setValue(0);

            return newSelectedBeds;
        });
    };

    return (
        <Box m="10px" sx={{ width: '97%' }} >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="BED VIEW" />
                {/* {showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />} */}
            </Box>
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
                <FormControl fullWidth>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Bed View" {...a11yProps(0)} />
                            {selectedBeds.map((bed, index) => (
                                <Tab
                                    key={bed.bedNo}
                                    label={
                                        <Box sx={{}}>
                                            {`${bed.bedNo}`}
                                            <IconButton size="small" onClick={() => handleCloseTab(index)}>
                                                <CancelIcon />
                                            </IconButton>
                                        </Box>
                                    } {...a11yProps(index + 1)} />
                            ))}
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Grid container spacing={1} sx={{ p: 1 }}>
                            {bedList.map((bed) => (
                                <Grid key={bed.bedNo} item sm={2} sx={{}}>
                                    <BedView bed={bed} />
                                </Grid>
                            ))}
                        </Grid>
                    </CustomTabPanel>
                </FormControl>
                {selectedBeds.map((bed, index) => (
                    <CustomTabPanel key={bed.bedNo} value={value} index={index + 1}>
                        <HER bed={bed}></HER>
                    </CustomTabPanel>
                ))}
            </Box>
        </Box>
    );
};
export default BEDVIEW;