import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box>
      <Link to="/">
        <Box sx={{ width: '80%' }} component="img" src="/static/euphar_logo1.png" alt="logo" />
      </Link>
    </Box>
  );
};

export default Logo;