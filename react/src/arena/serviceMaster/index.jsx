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
    Paper,
    RadioGroup,
    Radio,
} from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import SearchIcon from '@mui/icons-material/Search';
import Popup from "../../components/Popup";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import normalIcon from '../../asset/normal01.png';
import abnormalIcon from '../../asset/abnormal01.png';
import ResponseAlert from '../../components/Alert';
import JasperReport from "../../components/JasperReport"

const SERVICEMASTER = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const jwtToken = localStorage.getItem("jwtToken");

    const [responseMessage, setResponseMessage] = useState('');
    const [messageSeverty, setMessageSeverty] = useState('');
    const [showResponseAlert, setShowResponseAlert] = useState(false);

    const [selectionPopup, setSelectionPopup] = useState(false);
    const [labServicePopup, setLabServicePopup] = useState(false);
    const [openServicePopup, setOpenServicePopup] = useState(false);
    const [normalRangePopup, setNormalRangePopup] = useState(false);
    const [abnormalValuesPopup, setAbnormalValuesPopup] = useState(false);
    const [permissibleValuesPopup, setPermissibleValuesPopup] = useState(false);
    const [observationProcedurePopup, setObservationProcedurePopup] = useState(false);

    const [masterData, setMasterData] = useState([]);
    const [openScreenData, setOpenScreenData] = useState();
    const [observationMasterData, setObservationMasterData] = useState({
        "normalRange": {},
        "abnormalValues": {},
        "permissibleValues": {},
        "observationProcedureValue": "",
        "normalRangeSave": {
            "paramRID": "",
            "paramType": "",
            "dataType": "",
            "lowRange": "",
            "highRange": "",
            "ageCategory": "",
            "gender": ""
        },
        "abnormalValuesSave": {
            "extremeParamRID": "",
            "paramType": "",
            "extremeLowRange": "",
            "extremeHighRange": "",
        },
        "permissibleValuesSave": {
            "extremeParamRID": "",
            "paramType": "",
            "extremeLowRange": "",
            "extremeHighRange": "",
        },
        "observationProcedureSave": {
            "observationParamRID": "",
            "observationTechnology": "",
        },
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const [serviceTableData, setServiceTableData] = useState([]);
    const [searchForm, setSearchForm] = useState({
        "slMasterCode": "",
        "slUnit": 0,
        "slServiceType": 0,
        "slServiceGroup": 0,
        "slServiceSubGroup": 0,
        "slServiceCode": "",
        "slServiceName": "",
        "showActive": 1,
        "mappingType": 0
    });
    const [saveForm, setSaveForm] = useState({
        "dataType": [
            {
                "ddIndex": "",
                "ddDdiTypeIndex": "",
                "ddAbbrv": "",
                "ddValue": "",
                "ddParentIndex": ""
            }
        ],
        "obsrvtnGrp": [
            {
                "ddIndex": "",
                "ddDdiTypeIndex": "",
                "ddAbbrv": "",
                "ddValue": "",
                "ddParentIndex": ""
            }
        ],
        "serviceName": {
            "serRid": 0,
            "oldSerRid": 0,
            "portId": 0,
            "recordExist": 0,
            "serAdmitAdvance": 0,
            "serAdmitBeforeProcHrs": 0,
            "serAllowZeroPriceInBill": "",
            "serAvailAcrossAllEntities": "",
            "serBillingClearanceRequired": 0,
            "serBookingAdvance": 0,
            "serCanAppendDesc": 0,
            "serCanBeEmergency": "",
            "serCanEditPriceInOrd": 0,
            "serCapacity": 0,
            "serCategory": 0,
            "serCoSigningRequired": 0,
            "serCode": "",
            "serConfigParentRid": 0,
            "serCostPrice": 0,
            "serCostPriceFlag": "",
            "serCreatedDatetime": "",
            "serCustClassificationIndex": 0,
            "serCustomRid": 0,
            "serDaysBeforeProcedure": 0,
            "serDcRid": 0,
            "serDoctorShare": 0,
            "serDummy1": 0,
            "serDuration": 0,
            "serEntityRid": 0,
            "serEstLenOfStayInHospital": 0,
            "serExplicitConversionReq": 0,
            "serGenderIndex": 0,
            "serGrpParentRid": 0,
            "serGrpRid": 0,
            "serIsActive": "",
            "serIsAvailableAcrossAllEntitys": "",
            "serIsBedTypePricing": "",
            "serIsChargeable": "",
            "serIsDaycareProcedure": 0,
            "serIsDoctorSpecific": "",
            "serIsExternalProvider": "",
            "serIsExternallyProcessed": 0,
            "serIsForcedInactive": "",
            "serIsGenderSpecific": 0,
            "serIsMajorProc": "",
            "serIsManualTest": "",
            "serIsOrderable": 0,
            "serIsPacOrderSet": 0,
            "serIsPercOnPackagePrice": 0,
            "serIsPregnancyClosing": 0,
            "serIsPriceEditable": "",
            "serIsQtyEditable": "",
            "serIsRevenueSharingApplicable": "",
            "serIsSchedulable": "",
            "serIsSTIBased": "",
            "serMarkAsProcessed": 0,
            "serModalityCode": "",
            "serModalityIndex": 0,
            "serModifiedDatetime": "",
            "serModifiedUserRid": 0,
            "serName": "",
            "serNursingStationTask": 0,
            "serOrdDocShareIsPercentage": "",
            "serOrdDoctorShare": 0,
            "serOrderTemplateId": 0,
            "serPackagePricePerc": 0,
            "serParentRid": 0,
            "serPostopCheckupOrder": 0,
            "serPreopAdmissionOrder": 0,
            "serPreopCheckupOrder": 0,
            "serPriceEditableProcessing": 0,
            "serProcDocShareIsPercentage": "",
            "serProcOrderSetRid": 0,
            "serRefDocShareIsPercentage": "",
            "serRefDoctorShare": 0,
            "serResRid": 0,
            "serResultExpected": 0,
            "serResultExpectedTime": 0,
            "serResultExpectedTimeHighPriorityLab": 0,
            "serResultTemplateId": 0,
            "serResultValid": 0,
            "serRowHistoryRid": 0,
            "serRowInvalidated": "",
            "serSigningRequired": 0,
            "serSnomedctCode": "",
            "serSnomedctDesc": "",
            "serSpecialityIndex": 0,
            "serStaffCategory": 0,
            "serStaffSpecific": 0,
            "serStaffSubCategory": 0,
            "serSubTypeIndex": 0,
            "serTemplateRid": 0,
            "serTypeIndex": 0,
            "serUserRid": 0,
            "serVatPer": 0,
            "serWorkingHrs": 0,
            "tempNewSerRid": 0,
            "tempSrcSerRid": 0,
            "tempTrgtGrpName": "",
            "tempTrgtGrpParentRid": 0,
            "tempTrgtGrpRid": 0,
            "tempTrgtSerRid": 0,
            "tempTrgtSpecialityIndex": 0
        },
        "category": [
            {
                "grp_rid": 0,
                "grpCode": "",
                "grpName": "",
                "grpParentRid": 0,
                "grpType": 0,
                "grpIsActive": 0,
                "grpEntityRid": 0,
                "grpModUserRid": 0,
                "grpModDatetime": "",
                "grp_root_parent_rid": 0,
                "grp_config_parent_rid": 0,
                "record_exist": 0,
                "temp_trgt_grp_rid": 0,
                "temp_src_grp_rid": 0,
                "temp_trgt_parent_grp_rid": 0
            }
        ],
        "sampleType": [
            {
                "ddIndex": "",
                "ddDdiTypeIndex": "",
                "ddAbbrv": "",
                "ddValue": "",
                "ddParentIndex": ""
            }
        ],
        "tubeColor": [
            {
                "ddIndex": "",
                "ddDdiTypeIndex": "",
                "ddAbbrv": "",
                "ddValue": "",
                "ddParentIndex": ""
            }
        ],
        "observations": [
            {
                "obRid": 0,
                "obSerRid": 0,
                "obObservationName": "",
                "obUnit": "",
                "obDataType": 0,
                "obGroupName": "",
                "obGroupRid": 0,
                "obNormalRange": "",
                "obPossibleValues": "",
                "obDataLength": 0,
                "obDefaultValue": "",
                "obNotificationHighRange": "",
                "obNotificationLowRange": "",
                "obSequanceNo": 0,
                "obIsClinicalObservation": 0,
                "obClinicalObservationCode": "",
                "obAbnormalIndex": 0,
                "obPermissibleLowRange": 0,
                "obPermissibleHighRange": 0,
                "obLoincCode": "",
                "obParentRid": 0,
                "obRecordExist": 0,
                "obTechnology": "",
                "obEntityRid": 0,
                "obSnomedctCode": "",
                "obSnomedctDesc": ""
            }
        ],
        "serviceDetails": [
            {
                "lsdSerRid": 0,
                "lsdSampleTypeIndex": 0,
                "lsdResultParameterRid": 0,
                "lsdResultType": 0,
                "lsdHasObservation": 0,
                "lsdSequenceNo": 0,
                "lsdPageNo": 0,
                "lsdHasRemarks": 0,
                "lsdTechnology": "",
                "lsdTubeColorIndex": 0,
                "lsdTechnicalNotes": "",
                "lsdShowTemplateAsNormalReport": 0,
                "lsdIsClinicalObservation": 0,
                "lsdClinicalObservationCode": "",
                "lsdIsResultsConfidential": 0,
                "lsdIsFastingRequired": 0,
                "lsdCollectionTimeAfterFood": 0,
                "lsdLoincCode": "",
                "lsdEntityRid": 0,
                "lsdSnomedctCode": "",
                "lsdSnomedctDesc": "",
                "lsdSiRid": 0
            }
        ],
        "paramRID": "",
        "snomedCode": "",
        "snomedDescription": "",
        "labTestDetails": [
            {
                "paramRid": 0,
                "paramCategoryRid": 0,
                "paramName": "",
                "paramUnit": "",
                "paramDesc": "",
                "paramLowRange": "",
                "paramHighRange": "",
                "paramValid": 0,
                "paramDataType": 0,
                "paramGroupId": 0,
                "paramLength": 0,
                "paramRangeDescription": "",
                "paramRangeEditable": 0,
                "paramPossibleValues": "",
                "paramEntityRid": 0,
                "paramDefaultValue": "",
                "pltpTempNewSerRid": 0,
                "paramNotificationHighRange": "",
                "paramNotificationLowRange": "",
                "newSerRid": 0,
                "paramAbnormalIndex": 0,
                "paramPermissibleLowRange": 0,
                "paramPermissibleHighRange": 0
            }
        ],
        "labSamplePrefix": [
            {
                "si_prefix": "",
                "siSeperator": "",
                "siStartNo": 0,
                "siSequence": 0,
                "siUnitRid": 0,
                "siSampleType": 0,
                "siRid": 0,
                "siParentRid": 0,
                "siEntityRid": 0,
                "siIsActive": 0,
                "siCreatedUserRid": 0,
                "siCreatedDatetime": "",
                "siModUserRid": 0,
                "siModDatetime": "",
                "tempOldCharPrefix": "",
                "siSuffix": ""
            }
        ],
        "labSampleSuffix": [
            {
                "si_prefix": "",
                "siSeperator": "",
                "siStartNo": 0,
                "siSequence": 0,
                "siUnitRid": 0,
                "siSampleType": 0,
                "siRid": 0,
                "siParentRid": 0,
                "siEntityRid": 0,
                "siIsActive": 0,
                "siCreatedUserRid": 0,
                "siCreatedDatetime": "",
                "siModUserRid": 0,
                "siModDatetime": "",
                "tempOldCharPrefix": "",
                "siSuffix": ""
            }
        ]
    });
    const serviceTableColumns = [
        {
            field: 'serCode',
            headerName: 'Code',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'grpName',
            headerName: 'Group',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'subGrpName',
            headerName: 'Sub Group',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'serName',
            headerName: 'Service Name',
            flex: 2,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'unitName',
            headerName: 'Unit',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'serviceTypeName',
            headerName: 'Service Type',
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        // {
        //     headerName: '',
        //     flex: 0.75,
        //     headerAlign: "center",
        //     align: "center",
        //     renderCell: (params) => {
        //         return (
        //             <TextField
        //                 select
        //                 size="small"
        //                 fullWidth
        //                 //value={selectedOption}
        //                 onChange={(e) => {
        //                     console.log(e);
        //                     if(e.target.value === "1"){
        //                         //show OPEN PopUp
        //                     }
        //                     if(e.target.value === "2"){
        //                         //show labServicePopup
        //                         handleLaboratoryService(selectedRow);
        //                     }
        //                 }}
        //             //variant="outlined" // optional: adds an outline to the TextField

        //             >
        //                 <MenuItem value="1">Open</MenuItem>
        //                 <MenuItem value="2">Laboratory Service Master</MenuItem>
        //             </TextField>
        //         );
        //     },
        // },
    ];
    const observationTableColumns = [
        {
            field: 'obObservationName',
            headerName: 'Name',
            flex: 0.80,
            headerAlign: "center",
            align: "left",
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.75,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    <div>
                        <Tooltip title="Set Normal Range By Age" placement="bottom-end">
                            <IconButton
                                onClick={() => handleNormalRangePopup(params)}
                            >
                                <img src={normalIcon} alt="Normal Icon" style={{ width: 24, height: 24 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notification For Extreme Abnormal Values" placement="bottom-end">
                            <IconButton
                                onClick={() => handleAbnormalValuesPopup(params)}
                            >
                                <img src={abnormalIcon} alt="Abnormal Icon" style={{ width: 24, height: 24 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Set Permissible Values" placement="bottom-end">
                            <IconButton
                                onClick={() => handlePermissibleValuesPopup(params)}
                            >
                                <img src={normalIcon} alt="permissible Icon" style={{ width: 24, height: 24 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Observation Procedure" placement="bottom-end">
                            <IconButton
                                onClick={() => handleObservationProcedurPopup(params)}
                            >
                                <img src={normalIcon} alt="observation Icon" style={{ width: 24, height: 24 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'obUnit',
            headerName: 'Unit',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obUnit = e.target.value;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                    </TextField>
                );
            },
        },
        {
            field: 'obDataType',
            headerName: 'Data Type',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        select
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const selectedDataType = e.target.value;
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obDataType = selectedDataType;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                        {saveForm.dataType.map((option) => (
                            <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                {option.ddValue}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            },
        },
        {
            field: 'obGroupRid',
            headerName: 'Group',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        select
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const selectedDataType = e.target.value;
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obGroupRid = selectedDataType;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                        {saveForm.obsrvtnGrp.map((option) => (
                            <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                {option.ddValue}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            },
        },
        {
            field: 'obDataLength',
            headerName: 'Lenght',
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obDataLength = e.target.value;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                    </TextField>
                );
            },
        },
        {
            field: 'obNormalRange',
            headerName: 'Normal Range',
            //flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obNormalRange = e.target.value;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                    </TextField>
                );
            },
        },
        {
            field: 'obPossibleValues',
            headerName: 'Possible Values',
            //flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'obSequanceNo',
            headerName: 'Sequance No',
            flex: 0.75,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obSequanceNo = e.target.value;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                    </TextField>
                );
            },
        },
        {
            field: 'obDefaultValue',
            headerName: 'Default Value',
            //flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const rowIndex = saveForm.observations.findIndex(observation => observation.obRid === params.row.obRid);
                return (
                    <TextField
                        size="small"
                        value={params.value}
                        onChange={(e) => {
                            const updatedObservations = [...saveForm.observations];
                            updatedObservations[rowIndex].obDefaultValue = e.target.value;
                            setSaveForm((prevForm) => ({
                                ...prevForm,
                                observations: updatedObservations,
                            }));
                        }}
                    >
                    </TextField>
                );
            },
        },
    ];

    useEffect(() => {
        fetch(`http://10.197.8.17:2023/hmis/api/v1/servicemaster/initialize`, {
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
            })
            .catch((error) => {
                console.error('Error fetching Service Master Data:', error);
            });
        setSearchForm((prevFormData) => ({
            ...prevFormData,
            showActive: 1,
        }));
    }, []);

    const handleSearch = () => {
        const queryParams = new URLSearchParams(searchForm);
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/seachService?${queryParams}`;

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
                setServiceTableData(data);
            })
            .catch((error) => {
                console.error('Error fetching Service Details:', error);
            });
    };
    const handleOpenService = (params) => {
        console.log(params.row);
        setSelectionPopup(false);
        fetch(`http://10.197.8.17:2023/hmis/api/v1/servicemaster/openService?serRID=${params.row.serRid}`, {
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
                setOpenScreenData(data);
            })
            .catch((error) => {
                console.error('Error fetching Lab Service Master Data:', error);
            });
        setOpenServicePopup(true);
    };
    const handleLaboratoryService = (params) => {
        setSelectionPopup(false);
        const queryParams = new URLSearchParams({
            //"serTypeIndex": searchForm.slServiceType,
            "serRID": params.row.serRid
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/openLabServiceSettings?${queryParams}`;

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
                setSaveForm(data);
                setLabServicePopup(true);
                // setSaveForm((prevFormData) => ({
                //     ...prevFormData,
                //     serName: data.serviceNames.serName,
                // }));
            })
            .catch((error) => {
                console.error('Error fetching Lab Service Master Data:', error);
            });
    };
    const handleNormalRangePopup = (params) => {
        setNormalRangePopup(true);
        const queryParams = new URLSearchParams({
            "paramRID": params.row.obRid,
            "fromObservationScreen": 1
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/setNormalRangeByAge?${queryParams}`;

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
                setObservationMasterData((prevForm) => ({
                    ...prevForm,
                    normalRange: data,
                    normalRangeSave: {
                        ...prevForm.normalRangeSave,
                        paramRID: params.row.obRid,
                        paramType: 2,
                        dataType: params.row.obDataType
                    }
                }));
            })
            .catch((error) => {
                console.error('Error fetching Normal Range By Age Data:', error);
            })
    };
    const handleAbnormalValuesPopup = (params) => {
        setAbnormalValuesPopup(true);
        const queryParams = new URLSearchParams({
            "paramRID": params.row.obRid,
            "fromObservationScreen": 1,
            "fromResultScreen": 0
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/setAbNormalRangeForNotification?${queryParams}`;

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
                setObservationMasterData((prevForm) => ({
                    ...prevForm,
                    abnormalValues: data,
                    abnormalValuesSave: {
                        ...prevForm.abnormalValuesSave,
                        extremeParamRID: params.row.obRid,
                        paramType: 2,
                        extremeLowRange: data.extremeAbnormalRange.obNotificationLowRange,
                        extremeHighRange: data.extremeAbnormalRange.obNotificationHighRange
                    }
                }));
            })
            .catch((error) => {
                console.error('Error fetching Extreme Abnormal Values Data:', error);
            });
    };
    const handlePermissibleValuesPopup = (params) => {
        setPermissibleValuesPopup(true);
        const queryParams = new URLSearchParams({
            "paramRID": params.row.obRid,
            "fromObservationScreen": 1,
            "fromResultScreen": 0
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/setPermissibleRange?${queryParams}`;

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
                setObservationMasterData((prevForm) => ({
                    ...prevForm,
                    permissibleValues: data,
                    permissibleValuesSave: {
                        ...prevForm.permissibleValuesSave,
                        extremeParamRID: params.row.obRid,
                        paramType: 2,
                        extremeLowRange: data.extremeAbnormalRange.obNotificationLowRange,
                        extremeHighRange: data.extremeAbnormalRange.obNotificationHighRange
                    }
                }));
            })
            .catch((error) => {
                console.error('Error fetching Permisible Range Values Data:', error);
            });
    };
    const handleObservationProcedurPopup = (params) => {
        setObservationProcedurePopup(true);
        const queryParams = new URLSearchParams({
            "paramRID": params.row.obRid,
        });
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/openTechniqueForObservation?${queryParams}`;

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
                return response.text();
            })
            .then((data) => {
                setObservationMasterData((prevForm) => ({
                    ...prevForm,
                    observationProcedureValue: data,
                    observationProcedureSave: {
                        observationParamRID: params.row.obRid,
                        observationTechnology: data
                    }
                }));
            })
            .catch((error) => {
                console.error('Error fetching Observation Procedure Value Data:', error);
            });

    };

    const handleNormalRangeSave = () => {
        const queryParams = new URLSearchParams(observationMasterData.normalRangeSave);
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/setAgeCategory?${queryParams}`;
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
                console.log(data);
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Set Normal Range By Age Data:', error);
            });
    };
    const handleAbnormalValuesSave = () => {
        const queryParams = new URLSearchParams(observationMasterData.abnormalValuesSave);
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/saveAbNormalRangeForNotification?${queryParams}`;
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
                console.log(data);
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Extreme Abnormal Values Data:', error);
            });
    };
    const handlePermissibleValuesSave = () => {
        const queryParams = new URLSearchParams(observationMasterData.permissibleValuesSave);
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/savePermissibleRange?${queryParams}`;
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
                console.log(data);
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Permissible Range Values Data:', error);
            });
    };
    const handleObservationProcedureSave = () => {
        const queryParams = new URLSearchParams(observationMasterData.observationProcedureSave);
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/saveObservationTechnology?${queryParams}`;
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
                console.log(data);
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Observation Procedure Values Data:', error);
            });
    };
    const handleLaboratoryServiceSave = () => {
        const url = `http://10.197.8.17:2023/hmis/api/v1/servicemaster/saveLabServiceSettings`;
        fetch(url, {
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
                setResponseMessage(`Success!(${Date.now()})`);
                setShowResponseAlert(true);
            })
            .catch((error) => {
                setResponseMessage(`Error !(${Date.now()})`);
                setShowResponseAlert(true);
                console.error('Error Saving Data:', error);
            });

    };
    return (
        <Box m="10px" >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Service Master" />
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >{showResponseAlert && <ResponseAlert responseMessage={responseMessage} messageSeverty={messageSeverty} />}
                <FormControl fullWidth >
                    <Grid x={12} container >
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="unit"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Unit"
                                variant="outlined"
                                value={searchForm.slUnit || ""}
                            >
                                {masterData.unitDtos &&
                                    masterData.unitDtos.map((option) => (
                                        <MenuItem key={option.unitRid} value={option.unitName}>
                                            {option.unitName}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="group"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Group"
                                variant="outlined"
                                value={searchForm.slServiceGroup || ""}
                            >
                            </TextField>

                        </Grid>
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="subGroup"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Sub Group"
                                variant="outlined"
                            //value={searchForm.grpRID}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="slServiceCode"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Service Code"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm(() => ({
                                        ...searchForm,
                                        [e.target.name]: e.target.value
                                    }));
                                }}
                                value={searchForm.slServiceCode || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="slServiceType"
                                select
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Service Type"
                                variant="outlined"
                                value={searchForm.slServiceType || ""}
                                onChange={(e) => {
                                    setSearchForm(() => ({
                                        ...searchForm,
                                        [e.target.name]: parseInt(e.target.value)
                                    }));
                                }}
                            >
                                {masterData.serviceTypes &&
                                    masterData.serviceTypes.map((option) => (
                                        <MenuItem key={option.ddIndex} value={option.ddIndex}>
                                            {option.ddValue}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={4} item sx={{ p: 1 }}>
                            <TextField
                                sx={{ m: 1 }}
                                name="slServiceName"
                                fullWidth
                                size='small'
                                color="secondary"
                                id="outlined-basic"
                                label="Service Name"
                                variant="outlined"
                                onChange={(e) => {
                                    setSearchForm(() => ({
                                        ...searchForm,
                                        [e.target.name]: e.target.value
                                    }));
                                }}
                                value={searchForm.slServiceName || ""}
                            >
                            </TextField>
                        </Grid>
                        <Grid xs={6} item sx={{ p: 1 }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Show active service only"
                                checked={searchForm.showActive === 1}
                                onChange={(e) => {
                                    setSearchForm({
                                        ...searchForm,
                                        showActive: e.target.checked ? 1 : 0
                                    });
                                }}
                            />
                        </Grid>
                        <Grid xs={6} item sx={{ p: 1 }}>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group"
                                name="radio-buttons-group1"
                            >
                                <Grid container alignItems="center" sx={{}}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Mapped"
                                            label="Mapped"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Unmapped"
                                            label="Unmapped"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio size="small" />}
                                            value="Both"
                                            label="Both"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button>
                                            <SearchIcon sx={{ fontSize: 40 }} onClick={() => handleSearch()} />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </Grid>
                    </Grid>
                    <Divider textAlign="left" variant="middle"
                        sx={{
                            borderColor: "#3da58a",
                            "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                        }}>
                    </Divider>
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
                                rows={serviceTableData}
                                columns={serviceTableColumns}
                                getRowId={(row) => row.serRid}
                                disableSelectionOnClick
                                onRowClick={(params) => {
                                    setSelectedRow(params);
                                    setSelectionPopup(true);
                                }}
                            />
                        </div>
                    </Box>
                    <Popup
                        title="Open Service"
                        openPopup={openServicePopup}
                        setOpenPopup={setOpenServicePopup}
                        popupWidth={"xl"}
                        showCloseButton={true}
                    >
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Service Master
                        </Divider>
                        <Grid x={12} container >
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Name"
                                    variant="outlined"
                                    readOnly
                                    value={openScreenData?.serviceName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Code"
                                    variant="outlined"
                                    readOnly
                                    value={openScreenData?.serviceCode || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    required
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Service Group"
                                    variant="outlined"
                                    readOnly
                                //value={xxxxxxxxx || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Sub Group"
                                    variant="outlined"
                                    readOnly
                                //value={xxxxxxx || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Category"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    required
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Entity Name"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Unit"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Service Type"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Service Sub Type"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Duration"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Speciality"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Gender"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Service Details
                        </Divider>
                        <Grid x={12} container >
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Result Expected"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Result Valid In Days"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Result Expected"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Explicit Conversion Required"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label=" Declaration Required(for Form F)"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Result Expected Time In Minutes"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={4.5} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Result Expected Time For High Priority Orders In Minutes"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Schedulable"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Nursing Station Task"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Mark As Processed"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Append Description At Ordering"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Active"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="STI Based"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Is NIROGI Haryana"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Staff Required For Processing"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{}}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Category"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{}}
                                    //name="serName"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Sub Category"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Price And Compensation Details
                        </Divider>
                        <Grid x={12} container >
                            <Grid xs={6} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Price Editable At Billing"
                                />
                            </Grid>
                            <Grid xs={6} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Price Editable At Ordering"
                                />
                            </Grid>
                            <Grid xs={6} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Lower Price Limit (INR)"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={6} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Upper Price Limit (INR)"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Billing Clearance Required"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Price Editable At Processing"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Qty editable At Billing"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="Can Be Zero-Priced"
                                />
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1, }}>
                                <TextField
                                    sx={{ m: 0 }}
                                    //name="serName"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Percentage Of Package Price In %"
                                    variant="outlined"
                                    readOnly
                                //value={saveForm.serviceName.serName || ""}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Revenue Sharing
                        </Divider>
                        <Grid x={12} container >

                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>
                        </Divider>
                        <Grid x={12} container >

                        </Grid>
                    </Popup>
                    <Popup
                        title="Laboratory Service Master"
                        openPopup={labServicePopup}
                        setOpenPopup={setLabServicePopup}
                        popupWidth={"xl"}
                        showCloseButton={true}
                    >
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Service Details
                        </Divider>
                        <Grid x={12} container >
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="serName"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Service Name"
                                    variant="outlined"
                                    value={saveForm.serviceName.serName || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceName: {
                                                ...prevState.serviceName,
                                                serName: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdSampleTypeIndex"
                                    select
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Sample Type"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdSampleTypeIndex || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdSampleTypeIndex: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {saveForm.sampleType &&
                                        saveForm.sampleType.map((option) => (
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
                                    name="serGrpRid"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Service Group"
                                    variant="outlined"
                                    value={saveForm.serviceName.serGrpRid || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceName: {
                                                ...prevState.serviceName,
                                                serGrpRid: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {saveForm.category &&
                                        saveForm.category.map((option) => (
                                            <MenuItem key={option.grp_rid} value={option.grp_rid}>
                                                {option.grpName}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="unit"
                                    select
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Result Type"
                                    variant="outlined"
                                    value={0}
                                >
                                    <MenuItem value="0">Normal</MenuItem>
                                    <MenuItem value="1">Template</MenuItem>
                                    <MenuItem value="2">Microbiology</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdPageNo"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Page No"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdPageNo || 0}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdPageNo: e.target.value
                                            }
                                        }));
                                    }}

                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="unit"
                                    select
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Tube Color"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdTubeColorIndex || 0}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdTubeColorIndex: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {saveForm.tubeColor &&
                                        saveForm.tubeColor.map((option) => (
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
                                    name="lsdSequenceNo"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Sequence No."
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdSequenceNo || 0}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdSequenceNo: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdLoincCode"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="LOINC Code"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdLoincCode || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdLoincCode: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdSiRid"
                                    select
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Prefix"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdSiRid || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdSiRid: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {saveForm.labSamplePrefix &&
                                        saveForm.labSamplePrefix.map((option) => (
                                            <MenuItem key={option.siRid} value={option.siRid}>
                                                {option.si_prefix}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="unit"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Suffix"
                                    variant="outlined"
                                //value={searchForm.slUnit || ""}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Result Details
                        </Divider>
                        <Grid x={12} container >
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="paramUnit"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Unit"
                                    variant="outlined"
                                    value={saveForm.labTestDetails.paramUnit || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            labTestDetails: {
                                                ...prevState.labTestDetails,
                                                paramUnit: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="paramLength"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Length"
                                    variant="outlined"
                                    value={saveForm.labTestDetails.paramLength || 0}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            labTestDetails: {
                                                ...prevState.labTestDetails,
                                                paramLength: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="paramDataType"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Data Type"
                                    variant="outlined"
                                    value={saveForm.labTestDetails.paramDataType || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            labTestDetails: {
                                                ...prevState.labTestDetails,
                                                paramDataType: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {saveForm.dataType &&
                                        saveForm.dataType.map((option) => (
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
                                    name="paramPossibleValues"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Possible Values"
                                    variant="outlined"
                                    value={saveForm.labTestDetails.paramPossibleValues || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            labTestDetails: {
                                                ...prevState.labTestDetails,
                                                paramPossibleValues: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="paramDefaultValue"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Default Value"
                                    variant="outlined"
                                    value={saveForm.labTestDetails.paramDefaultValue || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            labTestDetails: {
                                                ...prevState.labTestDetails,
                                                paramDefaultValue: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    //name="unit"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Normal Range"
                                    variant="outlined"
                                //value={searchForm.slUnit || ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdTechnology"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Procedure"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdTechnology || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdTechnology: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={3} item sx={{ p: 1 }}>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lsdTechnicalNotes"
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Technical Note"
                                    variant="outlined"
                                    value={saveForm.serviceDetails.lsdTechnicalNotes || ""}
                                    onChange={(e) => {
                                        setSaveForm(prevState => ({
                                            ...prevState,
                                            serviceDetails: {
                                                ...prevState.serviceDetails,
                                                lsdTechnicalNotes: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Observations
                        </Divider>
                        <Grid x={12} container >
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
                                        rows={saveForm.observations}
                                        columns={observationTableColumns}
                                        getRowId={(row) => row.obRid}
                                        disableSelectionOnClick
                                    //onRowClick={(params) => { handleLaboratoryService(params) }}
                                    />
                                </div>
                            </Box>
                        </Grid>
                        <Grid container style={{ justifyContent: 'flex-end' }}>
                            <Grid item sx={{ p: 1 }}>
                                <Button
                                    sx={{ width: 100 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { handleLaboratoryServiceSave() }}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Popup>
                    <Popup
                        title=""
                        openPopup={selectionPopup}
                        setOpenPopup={setSelectionPopup}
                        popupWidth={"xs"}
                        showCloseButton={true}
                    >
                        <Grid xs={12} container justifyContent="center" marginTop={2.5}>
                            {/* <Button
                                sx={{ mr: 1 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleOpenService(selectedRow) }}
                            >
                                Open
                            </Button> */}
                            <Button
                                sx={{ ml: 1 }}
                                variant="contained"
                                color="secondary"
                                onClick={() => { handleLaboratoryService(selectedRow) }}
                            >
                                Laboratory Service
                            </Button>
                        </Grid>
                    </Popup>
                    <Popup
                        title="Set Normal Range By Age"
                        openPopup={normalRangePopup}
                        setOpenPopup={setNormalRangePopup}
                        popupWidth={"md"}
                        showCloseButton={true}
                        onClose={() => {
                            setObservationMasterData(prevState => ({
                                ...prevState,
                                normalRangeSave: {
                                    "paramRID": "",
                                    "paramType": "",
                                    "dataType": "",
                                    "lowRange": "",
                                    "highRange": "",
                                    "ageCategory": "",
                                    "gender": ""
                                }
                            }));
                        }}
                    >
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>
                        </Divider>
                        <Grid xs={12} container marginTop={2.5} spacing={1}>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="ageCategory"
                                    select
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Age Category"
                                    variant="outlined"
                                    value={observationMasterData.normalRangeSave.ageCategory || ''}
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            normalRangeSave: {
                                                ...prevState.normalRangeSave,
                                                ageCategory: e.target.value
                                            }
                                        }));
                                    }}
                                >
                                    {observationMasterData.normalRange.ageCategory &&
                                        observationMasterData.normalRange.ageCategory.map((option) => (
                                            <MenuItem key={option.ac_rid} value={option.ac_rid}>
                                                {option.acConcat}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="gender"
                                    select
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Gender"
                                    variant="outlined"
                                    onChange={(e) => {

                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            normalRangeSave: {
                                                ...prevState.normalRangeSave,
                                                gender: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.normalRangeSave.gender || ''}
                                >
                                    {observationMasterData.normalRange.genderCategory &&
                                        observationMasterData.normalRange.genderCategory.map((option) => (
                                            <MenuItem key={option.dd_index} value={option.dd_index}>
                                                {option.dd_value}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="lowRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Low Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            normalRangeSave: {
                                                ...prevState.normalRangeSave,
                                                lowRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.normalRangeSave.lowRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="highRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="High Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            normalRangeSave: {
                                                ...prevState.normalRangeSave,
                                                highRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.normalRangeSave.highRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { handleNormalRangeSave() }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setObservationMasterData(prevState => ({
                                                ...prevState,
                                                normalRangeSave: {
                                                    "paramRID": "",
                                                    "paramType": "",
                                                    "dataType": "",
                                                    "lowRange": "",
                                                    "highRange": "",
                                                    "ageCategory": "",
                                                    "gender": ""
                                                }
                                            }));
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>Normal Range Details
                        </Divider>
                    </Popup>
                    <Popup
                        title="Set Extreme Abnormal Values"
                        openPopup={abnormalValuesPopup}
                        setOpenPopup={setAbnormalValuesPopup}
                        popupWidth={"md"}
                        showCloseButton={true}
                        onClose={() => {
                            setObservationMasterData(prevState => ({
                                ...prevState,
                                abnormalValuesSave: {
                                    "extremeParamRID": "",
                                    "paramType": "",
                                    "extremeLowRange": "",
                                    "extremeHighRange": "",
                                }
                            }));
                        }}
                    >
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>
                        </Divider>
                        <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="extremeLowRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Low Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            abnormalValuesSave: {
                                                ...prevState.abnormalValuesSave,
                                                extremeLowRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.abnormalValuesSave.extremeLowRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="extremeHighRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="High Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            abnormalValuesSave: {
                                                ...prevState.abnormalValuesSave,
                                                extremeHighRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.abnormalValuesSave.extremeHighRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { handleAbnormalValuesSave() }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setObservationMasterData(prevState => ({
                                                ...prevState,
                                                abnormalValuesSave: {
                                                    "extremeParamRID": "",
                                                    "paramType": "",
                                                    "extremeLowRange": "",
                                                    "extremeHighRange": "",
                                                }
                                            }));
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Popup>
                    <Popup
                        title="Set Permissible Values"
                        openPopup={permissibleValuesPopup}
                        setOpenPopup={setPermissibleValuesPopup}
                        popupWidth={"md"}
                        showCloseButton={true}
                        onClose={() => {
                            setObservationMasterData(prevState => ({
                                ...prevState,
                                permissibleValuesSave: {
                                    "extremeParamRID": "",
                                    "paramType": "",
                                    "extremeLowRange": "",
                                    "extremeHighRange": "",
                                }
                            }));
                        }}
                    >
                        <Divider textAlign="left" variant="middle"
                            sx={{
                                "&::before, &::after": { borderColor: "#3da58a" }, color: "primary.main"
                            }}>
                        </Divider>
                        <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="extremeLowRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Low Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            permissibleValuesSave: {
                                                ...prevState.permissibleValuesSave,
                                                extremeLowRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.permissibleValuesSave.extremeLowRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid xs={6} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="extremeHighRange"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="High Range"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            permissibleValuesSave: {
                                                ...prevState.permissibleValuesSave,
                                                extremeHighRange: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.permissibleValuesSave.extremeHighRange || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { handlePermissibleValuesSave() }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setObservationMasterData(prevState => ({
                                                ...prevState,
                                                permissibleValuesSave: {
                                                    "extremeParamRID": "",
                                                    "paramType": "",
                                                    "extremeLowRange": "",
                                                    "extremeHighRange": "",
                                                }
                                            }));
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Popup>
                    <Popup
                        title="Set Procedure Values"
                        openPopup={observationProcedurePopup}
                        setOpenPopup={setObservationProcedurePopup}
                        popupWidth={"md"}
                        showCloseButton={true}
                        onClose={() => {
                            setObservationMasterData(prevState => ({
                                ...prevState,
                                observationProcedureSave: {
                                    "observationParamRID": "",
                                    "observationTechnology": "",
                                }
                            }));
                        }}
                    >
                        <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                            <Grid xs={12} item>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="observationTechnology"
                                    required
                                    fullWidth
                                    size='small'
                                    color="secondary"
                                    id="outlined-basic"
                                    label="Procedure (Separated by # if multiple)"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setObservationMasterData(prevState => ({
                                            ...prevState,
                                            observationProcedureSave: {
                                                ...prevState.observationProcedureSave,
                                                observationTechnology: e.target.value
                                            }
                                        }));
                                    }}
                                    value={observationMasterData.observationProcedureSave.observationTechnology || ''}
                                >
                                </TextField>
                            </Grid>
                            <Grid container style={{ justifyContent: 'flex-end' }} spacing={1}>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { handleObservationProcedureSave() }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        sx={{ width: 100 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setObservationMasterData(prevState => ({
                                                ...prevState,
                                                observationProcedureSave: {
                                                    "observationParamRID": "",
                                                    "observationTechnology": "",
                                                }
                                            }));
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Popup>
                </FormControl>
            </Box >
        </Box >
    );
};

export default SERVICEMASTER;
