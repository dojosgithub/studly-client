import { useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import { alpha, styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { Divider, MenuItem, Typography } from '@mui/material';
// components
import { CustomTwoFields } from 'src/components/custom-two-fields';
import { RHFSelect } from 'src/components/hook-form';
// mock
import { PROJECT_DEFAULT_TEMPLATE, USER_STATUS_OPTIONS } from 'src/_mock';
import { CustomSelect } from 'src/components/custom-select';
import ProjectCreateTrade from './project-create-trade';
import ProjectExistingTrade from './project-existing-trade';


export default function ProjectTrade({ onSelect,selectedTemplate, isDefaultTemplate, onTabChange }) {

  return (
    <>
      <Typography sx={{ my: 2 }} fontSize='1.5rem' fontWeight='bold'>Trades</Typography>
      <Divider sx={{
        minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        mb: 4
      }} />

      <Tabs>
        <TabsList onClick={(e) => onTabChange(e.target.name)}>
          <Tab value={0} name="create">Create Trade</Tab>
          <Tab value={1} name="existing">Use Exisiting Template</Tab>
        </TabsList>
        <TabPanel value={0}>
          {/* <CustomTwoFields /> */}
          <ProjectCreateTrade />
        </TabPanel>
        <TabPanel value={1}>
          {/* {template && <CustomTwoFields template={template} trades={PROJECT_DEFAULT_TEMPLATE}/>} */}
          <CustomSelect selectedTemplate={selectedTemplate} onSelect={onSelect} />
          {/* this should be changed to template value */}
          {!!selectedTemplate && <ProjectExistingTrade isTemplateSelected={!!selectedTemplate} />}
        </TabPanel>
      </Tabs>
      
    </>
  );
}


ProjectTrade.propTypes = {
  selectedTemplate: PropTypes.string,
  onSelect: PropTypes.func,
  onTabChange: PropTypes.func,
  isDefaultTemplate: PropTypes.bool,
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: ${grey[900]};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 16px 14px;
  margin: 0px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  outline: 1px solid ${grey[200]};

  &:hover {
    background-color: ${grey[50]};
    transition:0.2s ease-in;
  }

  &:focus {
    color: ${grey[900]};
  }

  &.${tabClasses.selected} {
    background-color:  ${grey[50]};
    color: ${grey[900]};
    outline: 1px solid ${grey[50]};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  padding: 20px 0px;
  // background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  // border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  border-radius: 12px;
  opacity: 0.6;
  `,
);

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  gap:1rem;
  // box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);
