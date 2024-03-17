import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
// _mock
import { PROJECT_TEMPLATES, PROJECT_TEMPLATE_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { setCurrentTemplate } from 'src/redux/slices/templateSlice';
import { setCurrentWorkflow } from 'src/redux/slices/workflowSlice';
import { setProjectTrades, setProjectWorkflow } from 'src/redux/slices/projectSlice';

// ----------------------------------------------------------------------

export default function CustomSelect({ onSelect, selectedOption, type = 'template', options }) {
    // for template and workflow
    const dispatch = useDispatch()
    const { setValue } = useFormContext()
    const templateList = useSelector(state => state.template.list);
    const workflowList = useSelector(state => state.workflow.list);
    const currentTradeTemplate = useSelector(state => state.template.current);
    const currentWorkflow = useSelector(state => state.workflow.current);
    const currentTemplate = type === "template" ? currentTradeTemplate : currentWorkflow;
    const renderList = type === "template" ? templateList : workflowList


    const handleSelect = (value) => {
        onSelect(value)
        console.log('handleSelect', value)
        // Find the selected item based on the value
        if (value !== 'create') {
            const selectedItem = renderList.find(item => item.name === value || value === 'default');
            if (type === "template") {
                handleSelectTemplate(selectedItem);
                setValue('trades', selectedItem?.trades)
                dispatch(setProjectTrades(selectedItem?.trades))
            } else if (type === "workflow") {
                const { id, ...rest } = selectedItem;
                console.log('rest', rest)
                handleSelectWorkflow(selectedItem);
                setValue('workflow', rest)
                dispatch(setProjectWorkflow(rest))

            }

        }
    };

    const handleSelectTemplate = (value) => {
        console.log("Selected template:", value);
        dispatch(setCurrentTemplate(value))
        // Additional logic for selected item
    };
    const handleSelectWorkflow = (value) => {
        console.log("Selected workflow:", value);
        dispatch(setCurrentWorkflow(value))
        // Additional logic for selected item
    };
    return (

        <Box
            rowGap={3}
            columnGap={2}
            display="grid"

            sx={{ marginBottom: "2rem" }}
        >
            {/* name='template' */}
            {/* <Select onChange={(e) => handleSelect(e.target.value)} name={type} value={selectedOption} label="" placeholder='Choose Template' sx={{
                "& .MuiSelect-select": {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                }
            }}>
                <MenuItem value='default' sx={{ height: 50, px: 3, borderRadius: 0 }}>
                    {`Studly Default ${type === "template" ? 'Template' : 'Workflow'}`}
                    <Iconify
                        icon='mdi:crown-outline'
                        width={28}
                        sx={{ mx: 1 }}
                    />
                </MenuItem>
                {renderList.map((item) => (
                    item?.name !== 'default' && (
                        <MenuItem key={item?.id} value={item?.name} onClick={()=>handleSelectTemplate(item)} sx={{ height: 50, px: 3, borderRadius: 0 }}>
                            {item?.name?.toUpperCase()}
                        </MenuItem>
                    )
                ))}
            
                <MenuItem value='create' sx={{ height: 50, px: 3, borderTop: '1px solid black', borderRadius: 0 }}>
                    <Iconify
                        icon='material-symbols:add-circle-outline'
                        width={20}
                        sx={{ mr: 1 }}
                    />
                    Create New {type === "template" ? 'Template' : 'Workflow'}
                </MenuItem>
            </Select> */}
            <Select
                onChange={(e) => handleSelect(e.target.value)}
                name={type}
                value={currentTemplate?.name}
                label=""
                displayEmpty
                sx={{
                    "& .MuiSelect-select": {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                    }
                }}
            >
                {renderList.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.name === 'default' ? 'default' : item.name}
                        sx={{ height: 50, px: 3, borderRadius: 0 }}
                    >
                        {item.name === 'default' ? `Studly Default ${type === "template" ? 'Template' : 'Workflow'}` : item.name.toUpperCase()}
                        {item.name === 'default' && (
                            <Iconify
                                icon='mdi:crown-outline'
                                width={28}
                                sx={{ mx: 1 }}
                            />
                        )}
                    </MenuItem>
                ))}
                <MenuItem value='create' sx={{ height: 50, px: 3, borderTop: '1px solid black', borderRadius: 0 }}>
                    <Iconify
                        icon='material-symbols:add-circle-outline'
                        width={20}
                        sx={{ mr: 1 }}
                    />
                    Create New {type === "template" ? 'Template' : 'Workflow'}
                </MenuItem>
            </Select>
        </Box>


    );
}


CustomSelect.propTypes = {
    onSelect: PropTypes.func,
    selectedOption: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.array,
};
