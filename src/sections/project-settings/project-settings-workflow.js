import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Divider, Typography, alpha } from '@mui/material';

import { useFormContext } from 'react-hook-form';
import { setProjectWorkflow } from 'src/redux/slices/projectSlice';
// components
import { CustomDrawer } from 'src/components/custom-drawer';
import ProjectCreateWorkflow from './project-create-workflow';
import ProjectWorkflowSelect from './project-workflow-select';

const ProjectWorkflow = () => {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  // const workflows = useSelector(state => state.project.workflows)
  const workflows = useSelector((state) => state.workflow.list);
  const dispatch = useDispatch();

  const { getValues, setValue } = useFormContext();

  const handleSelect = (val) => {
    if (val === 'create') {
      setOpen(true);
      return;
    }
    const selectedWorkflow = workflows.filter((w) => w.name === val)[0];

    dispatch(setProjectWorkflow(selectedWorkflow));
    setValue('workflow', selectedWorkflow);
    setSelected(val);
  };

  return (
    <>
      <Typography sx={{ mt: 1, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
        Create a Project Workflow
      </Typography>
      <Divider
        sx={{
          minHeight: '1px',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          mb: 4,
        }}
      />
      <ProjectWorkflowSelect />
    </>
  );
};

export default ProjectWorkflow;
