import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  FormControl,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useNavigate } from 'react-router-dom';

const INVENTORY = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const history = useNavigate();

  const [openingStock, setOpeningStock] = useState("");
  const [manageStock, setManageStock] = useState("");
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    handleOpeningStock();
  }, []);

  const redirectToOpeningStockPage = () => {
    history('/openingStock'); // Redirect to Opening Stock page
  };
  const handleOpeningStock = () => {
    redirectToOpeningStockPage();
  };

  const redirectToManageStockPage = () => {
    history('/manageStock'); // Redirect to Manage Stock page
  };
  const handleManageStock = () => {
    redirectToManageStockPage();
  };

  return (
    <Box m="10px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Inventory" />
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
          onClick={() => {
            handleOpeningStock();
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
        <FormControl fullWidth>
          {openingStock}
          {manageStock}
        </FormControl>
      </Box>
    </Box>
  );
};

export default INVENTORY;
