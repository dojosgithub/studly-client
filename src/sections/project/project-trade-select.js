import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Select } from '@mui/material';
// _mock
import { PROJECT_TEMPLATES, PROJECT_TEMPLATE_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import {
  setCurrentTemplate,
  setIsDefaultTemplate,
  setIsNewTemplate,
  setIsTemplateNameAdded,
  setSelectedTemplate,
} from 'src/redux/slices/templateSlice';
import { setCurrentWorkflow } from 'src/redux/slices/workflowSlice';
import {
  setProjectTrades,
  setProjectWorkflow,
  setSelectedTradeTemplate,
} from 'src/redux/slices/projectSlice';

// ----------------------------------------------------------------------

export default function ProjectTradeSelect() {
  // for template and workflow
  const dispatch = useDispatch();
  const { setValue } = useFormContext();
  const templates = useSelector((state) => state.template.list);
  const cTemplate = useSelector((state) => state.template.current);
  const selectedTradeTemplate = useSelector(
    (state) => state.project?.create?.selectedTradeTemplate
  );
  const [selectedTemplateName, setSelectedTemplateName] = useState(cTemplate?.name);
  const [templateList, setTemplateList] = useState(templates);

  useEffect(() => {
    setSelectedTemplateName(cTemplate?.name);
    setTemplateList(templates);
  }, [cTemplate, templates]);
  const handleSelect = (value) => {
    // Find the selected item based on the value
    dispatch(setSelectedTradeTemplate(value));
    if (value !== 'create') {
      const selectedItem = templateList.find((item) => item.name === value);
      handleSelectTemplate(selectedItem);
      setValue('trades', selectedItem?.trades);
      dispatch(setProjectTrades(selectedItem?.trades));
      dispatch(setSelectedTemplate(value));
    }
    if (value === 'default') {
      dispatch(setIsDefaultTemplate(!!value));
    }

    if (value === 'create') {
      dispatch(setIsNewTemplate(!!value));
    }
  };

  const handleSelectTemplate = (value) => {
    dispatch(setCurrentTemplate(value));
    // Additional logic for selected item
  };
  return (
    <Box rowGap={3} columnGap={2} display="grid" sx={{ marginBottom: '2rem' }}>
      <Select
        onChange={(e) => handleSelect(e.target.value)}
        name="template"
        // value={selectedTemplateName}
        value={selectedTradeTemplate}
        label=""
        placeholder="Select an existing trade template from this dropdown"
        displayEmpty
        inputProps={{ 'aria-label': 'Select an existing trade template' }}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          },
        }}
      >
        <MenuItem disabled value="" sx={{ height: 50, px: 3, borderRadius: 0 }}>
          Select an existing trade template from this dropdown
        </MenuItem>
        {templateList.map((item) => (
          <MenuItem
            key={item.id}
            value={item.name === 'default' ? 'default' : item.name}
            sx={{ height: 50, px: 3, borderRadius: 0 }}
          >
            {item.name === 'default' ? `CSI Code Template` : item.name.toUpperCase()}
            {item.name === 'default' && (
              <Iconify icon="mdi:crown-outline" width={28} sx={{ mx: 1 }} />
            )}
          </MenuItem>
        ))}
        <MenuItem
          value="create"
          sx={{ height: 50, px: 3, borderTop: '1px solid black', borderRadius: 0 }}
        >
          <Iconify icon="material-symbols:add-circle-outline" width={20} sx={{ mr: 1 }} />
          Create New Template
        </MenuItem>
      </Select>
    </Box>
  );
}
