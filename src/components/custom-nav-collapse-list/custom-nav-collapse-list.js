import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';


import { Box, Divider, IconButton, ListItem, Menu, MenuItem } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import { setCurrentProject } from 'src/redux/slices/projectSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from '../scrollbar';

export default function CustomNavCollapseList({ onOpen }) {
    // const [open, setOpen] = React.useState(true);
    const projects = useSelector(state => state.project.list);
    const currentProject = useSelector(state => state.project.current);
    const dispatch = useDispatch();

    // const handleClose = () => {
    //     setOpen(!open);
    // };
    const handleProject = (project) => {
        dispatch(setCurrentProject(project))
        dispatch(getSubmittalList())
        handleClose()
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateNewProject = () => {
        onOpen();
        handleClose()
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

            {/* <ListItemButton onClick={handleClose}>
                <ListItemText primary={currentProject ? currentProject?.name : "Project"} sx={{ "& .MuiListItemText-primary": { fontSize: "1.25rem" } }} />
                {open ? <Iconify width={24}
                    icon="ion:chevron-down" /> : <Iconify width={24}
                        icon="ion:chevron-up" />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
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
                <ListItemButton sx={{ pl: 2 }} onClick={onOpen}>
                    <ListItemIcon>
                        <Iconify width={24}
                            icon="mi:circle-add" />
                    </ListItemIcon>
                    <ListItemText primary="Add New Project" />
                </ListItemButton>
            </Collapse> */}


            <ListItem id="nested-list-subheader" onClick={handleClick}
                size="small"
                sx={{
                    justifyContent: "center", cursor: "pointer", fontWeight: "bold",
                    borderBottom: "1px solid grey",
                    mb: 2,
                    "&:hover": {
                        bgcolor: (theme) => theme.palette.secondary.dark,
                        transition: 'ease-in-out .3s'
                    }
                }}
                aria-controls={open ? "project-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
            >
                {currentProject?.name || 'Create New Project'}
            </ListItem>
            <Scrollbar>

                <Menu
                    anchorEl={anchorEl}
                    id="project-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                    anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                    slotProps={{
                        elevation: 0,
                        paper: {
                            sx: {
                                position: 'fixed',
                                top: "0 !important",
                                left: "0 !important",
                                width: 280,
                                maxWidth: '100%',
                                minHeight: '100%',
                                borderRadius: 0,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleCreateNewProject} sx={{
                        // position: "sticky",
                        // bottom: 0,
                        // left: 0,
                        backgroundColor: (theme) => theme.palette.background.paper,
                        "&.MuiMenuItem-root": {
                            marginBottom: "1rem",
                            padding: "1rem",
                        },
                        "&:hover": {
                            opacity: .75,
                            bgcolor: 'white'
                        }
                    }}>
                        {/* <ListItemButton onClick={onOpen}> */}
                        <ListItemIcon sx={{ m: 0 }}>
                            <Iconify width={24}
                                icon="mi:circle-add" />
                        </ListItemIcon>
                        <ListItemText primary="Add New Project" />
                        {/* </ListItemButton> */}
                    </MenuItem>
                    <Divider sx={{ ".MuiDivider-root": { marginBottom: "1rem" }, border: "1px solid white" }} />
                    {projects && projects.map((project) => (
                        <MenuItem sx={{ justifyContent: "center", border: "1px solid grey" }} key={project._id} onClick={() => handleProject(project)}>{project?.name}</MenuItem>
                    ))}
                </Menu>
            </Scrollbar>

        </List >
    );
}

CustomNavCollapseList.propTypes = {
    onOpen: PropTypes.func,
};
