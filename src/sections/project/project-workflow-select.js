import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
// _mock
// components
import Iconify from 'src/components/iconify';
import { setCurrentWorkflow, setIsNewWorkflow, setSelectedWorkflow } from 'src/redux/slices/workflowSlice';
import { setProjectWorkflow } from 'src/redux/slices/projectSlice';

// ----------------------------------------------------------------------

export default function ProjectWorkflowSelect() {
    // for template and workflow
    const dispatch = useDispatch()
    const { setValue } = useFormContext()
    const workflows = useSelector(state => state.workflow.list);
    const cWorkflow = useSelector(state => state.workflow.current);

    const [selectedWorkflowName, setSelectedWorkflowName] = useState(cWorkflow?.name)
    const [workflowList, setWorkflowList] = useState(workflows)




    useEffect(() => {
        setSelectedWorkflowName(cWorkflow?.name)
        setWorkflowList(workflows)

    }, [cWorkflow?.name, workflows])


    const handleSelect = (value) => {
        // Find the selected item based on the value
        if (value !== 'create') {
            const selectedItem = workflowList.find(item => item.name === value || value === 'default');
            handleSelectWorkflow(selectedItem);
            setValue('workflow', selectedItem)
            dispatch(setProjectWorkflow(selectedItem))
            dispatch(setSelectedWorkflow(value))



            // const { id, ...rest } = selectedItem;
            // console.log('rest', rest)

        }
        // if (value === 'default') {
        //     dispatch(setIsDefaultWorkflow(!!value))
        // }

        if (value === 'create') {
            dispatch(setIsNewWorkflow(!!value))
        }
    };



    const handleSelectWorkflow = (value) => {
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
            <Select
                onChange={(e) => handleSelect(e.target.value)}
                name='workflow'
                value={selectedWorkflowName}
                label=""
                // displayEmpty
                defaultValue='default'
                disabled
                //
                sx={{
                    "& .MuiSelect-select": {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                    }
                }}
            >
                <MenuItem
                    value='default'
                    sx={{ height: 50, px: 3, borderRadius: 0 }}
                    selected
                >
                    Studly Default Workflow
                    <Iconify
                        icon='mdi:crown-outline'
                        width={28}
                        sx={{ mx: 1 }}
                    />

                </MenuItem>
                {workflowList.map((item) => (
                    item.name !== 'default' &&
                    (<MenuItem
                        key={item.id}
                        value={item.name}
                        sx={{ height: 50, px: 3, borderRadius: 0 }}
                    >
                        {item.name.toUpperCase()}

                    </MenuItem>)
                ))}
                {/* {workflowList.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.name === 'default' ? 'default' : item.name}
                        sx={{ height: 50, px: 3, borderRadius: 0 }}
                        >
                        {item.name === 'default' ? `Studly Default Workflow` : item.name.toUpperCase()}
                        {item.name === 'default' && (
                            <Iconify
                                icon='mdi:crown-outline'
                                width={28}
                                sx={{ mx: 1 }}
                            />
                        )}
                    </MenuItem>
                ))} */}
                <MenuItem value='create' sx={{ height: 50, px: 3, borderTop: '1px solid black', borderRadius: 0 }}>
                    <Iconify
                        icon='material-symbols:add-circle-outline'
                        width={20}
                        sx={{ mr: 1 }}
                    />
                    Create New Template
                </MenuItem>
            </Select>
        </Box>


    );
}
