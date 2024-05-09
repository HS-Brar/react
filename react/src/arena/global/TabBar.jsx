import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {Divider} from "@mui/material";
import {gk} from "./Sidebar";
import DynamicTabs from "./Dynamic"
import AddTabButton from './Closable';


  
export default function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [tabContent, setTabContent] = useState([
    { label: 'Tab 1' },
    { label: 'Tab 2' },
    { label: 'Tab 3'},
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseTab = (index) => {
    const updatedTabs = tabContent.filter((_, i) => i !== index);
    setTabContent(updatedTabs);

    // Adjust activeTab index if the active tab is removed
    if (activeTab === index) {
      setActiveTab(0);
    }
  };

  function handleAddTab () {
    const newTab = {
      label: `Tab ${tabContent.length + 1}`,
      
    };

    setTabContent([...tabContent, newTab]);
    setActiveTab(tabContent.length);
  };
 

  return (
    
    <Box sx={{ width: 1, bgcolor: 'background.paper' }}>
    <Divider variant="middle" sx={{ bgcolor: "#3da58a" }} />
    <DynamicTabs
        activeTab={activeTab}
        tabContent={tabContent}
        handleTabChange={handleTabChange}
        handleCloseTab={handleCloseTab}
      />
   <AddTabButton handleAddTab={handleAddTab} />
    </Box>
  );
}
