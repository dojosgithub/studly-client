import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';


import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { setCurrentProject } from 'src/redux/slices/projectSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from '../scrollbar';

export default function CustomNavCollapseList({ onOpen }) {
    const [open, setOpen] = React.useState(true);
    const projects = useSelector(state => state.project.list);
    const currentProject = useSelector(state => state.project.current);
    const dispatch = useDispatch();

    const handleClick = () => {
        setOpen(!open);
    };
    const handleProject = (project) => {
        dispatch(setCurrentProject(project))
        dispatch(getSubmittalList())

    };

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent', color: 'grey' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        // subheader={
        //     <ListSubheader component="div" id="nested-list-subheader">
        //        Project
        //     </ListSubheader>
        // }
        >

            <ListItemButton onClick={handleClick}>
                <ListItemText primary={currentProject ? currentProject?.name : "Project"} sx={{ "& .MuiListItemText-primary": { fontSize: "1.25rem" } }} />
                {open ? <Iconify width={24}
                    icon="ion:chevron-down" /> : <Iconify width={24}
                        icon="ion:chevron-up" />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {/* SERACHBAR */}
                <List component="div" disablePadding sx={{ borderBottom: '1px solid lightgrey', fontWeight: 'semi-bold', pb: 1 }}>
                    <Scrollbar>
                        {projects && projects.map((project) => (
                            <ListItemButton sx={{ pl: 4 }} key={project._id} onClick={() => handleProject(project)}>
                                <ListItemText primary={project?.name} />
                            </ListItemButton>
                        )
                        )}
                    </Scrollbar>
                </List>
                {/* Add New Project */}
                <ListItemButton sx={{ pl: 2 }} onClick={onOpen}>
                    <ListItemIcon>
                        <Iconify width={24}
                            icon="mi:circle-add" />
                    </ListItemIcon>
                    <ListItemText primary="Add New Project" />
                </ListItemButton>
            </Collapse>
        </List>
    );
}

CustomNavCollapseList.propTypes = {
    onOpen: PropTypes.func,
};
