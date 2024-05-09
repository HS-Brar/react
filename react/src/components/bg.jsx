import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import '../bck.css'
const Bg = () => {
  return (
    
    <Box>
    <div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
<div class="firefly"></div>
      <Link to="/">
        <Box sx={{ width: '80%' }} component="img" src="/static/bg.png" alt="logo" />
      </Link>
    </Box>
  );
};

export default Bg;