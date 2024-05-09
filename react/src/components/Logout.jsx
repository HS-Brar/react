import React from 'react';
import { IconButton } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
const LogoutIcon= ({ onLogout }) => {
  return (
     <IconButton onClick={onLogout}>
     <ExitToAppOutlinedIcon sx={{color:'#e91e63'}}/>
   </IconButton>
  );
};

export default LogoutIcon;