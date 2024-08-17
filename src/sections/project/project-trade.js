import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
// @mui
import { alpha, styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { Divider, Typography } from '@mui/material';

//
import { useFormContext } from 'react-hook-form';
import {
  setActiveTab,
  setProjectTrades,
  setSelectedTradeTemplate,
} from 'src/redux/slices/projectSlice';

import { PROJECT_TEMPLATES } from 'src/_mock';
// components
import { CustomSelect } from 'src/components/custom-select';
import uuidv4 from 'src/utils/uuidv4';
import ProjectCreateTrade from './project-create-trade';
import ProjectCreateCsiTrade from './project-create-csi-template';
import ProjectExistingTrade from './project-existing-trade';
import ProjectTradeSelect from './project-trade-select';

export default function ProjectTrade({ onSelect, selectedTemplate, onTabChange }) {
  const { getValues, setValue } = useFormContext();
  const projectName = getValues('name');

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.project?.create?.activeTab);
  const selectedTradeTemplate = useSelector(
    (state) => state.project?.create?.selectedTradeTemplate
  );
  const defaultObj = {
    name: '',
    tradeId: '',
    _id: uuidv4(),
  };

  // ? Reset trades and selected trade template on tab change
  const handleTabChange = (e, value) => {
    dispatch(setActiveTab(value));
    if (value === 'create') {
      dispatch(setSelectedTradeTemplate(''));
      dispatch(setProjectTrades([defaultObj]));
      setValue('trades', [defaultObj]);
    } else {
      setValue('trades', []);
      dispatch(setProjectTrades([]));
    }
  };
  // onClick={(e) => {
  //   onTabChange(e.target.name)
  //   dispatch(setActiveTab(e.target.name))
  //   console.log('activeTab', e.target.name)
  // }}
  return (
    <>
      <Typography sx={{ my: 2 }} fontSize="1.5rem" fontWeight="bold">
        Which trades will you be using for {projectName}
      </Typography>
      <Divider
        sx={{
          minHeight: '1px',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          mb: 4,
        }}
      />

      <Tabs value={activeTab} onChange={handleTabChange}>
        <TabsList>
          <Tab value="create" name="create">
            Create Trade
          </Tab>
          <Tab value="existing" name="existing">
            Use Exisiting Template
          </Tab>
        </TabsList>
        <TabPanel value="create">
          <ProjectCreateTrade />
        </TabPanel>
        <TabPanel value="existing">
          {/* PROJECT_TEMPLATES */}
          <ProjectTradeSelect />
          {/* {selectedTradeTemplate && <ProjectExistingTrade />} */}
          {selectedTradeTemplate && <ProjectCreateCsiTrade />}

          {/* <CustomSelect selectedOption={selectedTemplate} onSelect={onSelect} type="template" options={[]} />
          {!!selectedTemplate && <ProjectExistingTrade isTemplateSelected={!!selectedTemplate} />} */}
        </TabPanel>
      </Tabs>
    </>
  );
}

ProjectTrade.propTypes = {
  selectedTemplate: PropTypes.string,
  onSelect: PropTypes.func,
  onTabChange: PropTypes.func,
};

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
    transition: 0.2s ease-in;
  }

  &:focus {
    color: ${grey[900]};
  }

  &.${tabClasses.selected} {
    background-color: ${grey[50]};
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
  `
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
  `
);
