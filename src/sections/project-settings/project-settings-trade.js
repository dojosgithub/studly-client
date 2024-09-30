import { useSelector } from 'react-redux';
// @mui
import { alpha, styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { Divider, Typography } from '@mui/material';

//
import { useFormContext } from 'react-hook-form';

// components
import ProjectSettingsCreateTrade from './project-settings-create-trade';
import ProjectSettingsCreateCsiTrade from './project-settings-create-csi-template';

export default function ProjectSettingsTrade() {
  const { getValues } = useFormContext();
  const projectName = getValues('name');

  const isCreatedWithCSI = useSelector((state) => state.project?.update?.isCreatedWithCSI);

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

      <Tabs value="create">
        <TabPanel value="create">
          {isCreatedWithCSI ? <ProjectSettingsCreateCsiTrade /> : <ProjectSettingsCreateTrade />}
        </TabPanel>
      </Tabs>
    </>
  );
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
