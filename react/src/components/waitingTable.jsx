import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
const columns = [
  { field: 'tokenNumber', headerName: 'Token No.', flex: 1 },
  { field: 'visitType', headerName: 'Visit Type', flex: 1 },
  { field: 'uhid', headerName: 'UHID', flex: 1 },
  { field: 'patientName', headerName: 'Patient Name', flex: 1 },
  { field: 'gender', headerName: 'Gender', flex: 1 },
  { field: 'age', headerName: 'Age', flex: 1 },
  { field: 'phoneNo', headerName: 'Phone No.', flex: 1 },
  { field: 'visitReason', headerName: 'Visit Reason', flex: 1 },
];

const Table = (props) => {
  const { data,onRowClick} = props;
  if (!data || !data.patientList || data.patientList.length === 0) {
    return <h3>No Patient to Consult!</h3>;
  }
  const rows = data.patientList.map(patient => {
    const wliDescriptorParts = patient.wliDescriptor.split('&').filter(part => part.trim() !== '');
    return {
      id: patient.wliRid,
      tokenNumber: wliDescriptorParts[0] || '',
      visitType: wliDescriptorParts[1] || '',
      uhid: wliDescriptorParts[2] || '',
      patientName: wliDescriptorParts[3] || '',
      gender: wliDescriptorParts[4] || '',
      age: wliDescriptorParts[5] || '',
      phoneNo: wliDescriptorParts[6] || '',
      visitReason: wliDescriptorParts[7] || '',
      visitRid:patient.visitRid || '',
      wliRid:patient.wliRid || '',
      patientRID: patient.visitPatientRid || '',
      visitConsultingDoctor: patient.visitConsultingDoctor || ''
    };
  });

  return (
    <Box style={{ height: "100%", width: '100%' }} sx={{
      width: '100%',
      '& .MuiDataGrid-columnHeaders ': {
        backgroundColor: '#2f7ade',
        fontSize:'13pt',
      },
      '& .MuiDataGrid-columnHeaderTitle':{
        color:'#fff',
       }
    }}>
      <DataGrid rows={rows} columns={columns}  onRowClick={onRowClick} />
    </Box>
  );
};

export default Table;