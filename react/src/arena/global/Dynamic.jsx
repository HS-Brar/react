import React from 'react';
import { Tabs, Tab, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DynamicTabs = ({ activeTab, tabContent, handleTabChange, handleCloseTab }) => {
  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange}>
        {tabContent.map((tab, index) => (
          <Tab
            key={index}
            label={
              <div>
                {tab.label}
                <IconButton
                  size="small"
                  onClick={() => handleCloseTab(index)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            }
          />
        ))}
      </Tabs>
      <div>{tabContent[activeTab].content}</div>
    </div>
  );
};

export default DynamicTabs;
