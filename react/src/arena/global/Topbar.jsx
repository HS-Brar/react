import { Box, IconButton,AppBar, Tabs, Tab, Grid, Button, useTheme, Typography } from "@mui/material";
import { useContext,useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TabContainer from './Nat';
import { red } from "@mui/material/colors";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from "../../components/Logout";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';
import UnitSelect from "../../components/Unit";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';



const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    // Clear cached
    setIsLoggedIn(false); 
    // Redirect to the login page 
    history('/login');
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  return (
    <Box backgroundColor={colors.primary[400]} display="flex" justifyContent="space-between" p={0}>
      <Box display="flex" >
      <LocationOnIcon sx={{color:'#e91e63',m:1}}/><Typography sx={{m:1}}>{localStorage.getItem("entityName")}</Typography>
      </Box>
      <Box display="flex">
        <MeetingRoomOutlinedIcon sx={{color:'#e91e63',m:1}}/><UnitSelect/></Box>
      
      <Box display="flex" >
  
      </Box>
      
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon sx={{color:'#e91e63'}}/>
          ) : (
            <LightModeOutlinedIcon sx={{color:'#e91e63'}}/>
          )}
        </IconButton>
        <IconButton onClick={toggleFullScreen}>
          <FullscreenOutlinedIcon sx={{color:'#e91e63'}}/>
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon sx={{color:'#e91e63'}}/>
        </IconButton>
        {isLoggedIn ? (
          <LogoutIcon onLogout={handleLogout} />
        ) : (
          <p>Please login to access the app.</p>
        )}
      
      </Box>
    </Box>
  );
};

export default Topbar;