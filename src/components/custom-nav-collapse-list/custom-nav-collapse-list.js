import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { truncate } from 'lodash';
import { Box, Divider, IconButton, ListItem, Menu, MenuItem } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import {
  getProjectList,
  setCurrentProject,
  setCurrentProjectRole,
} from 'src/redux/slices/projectSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';
// components
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { authSwitchProject } from 'src/redux/slices/userSlice';
import { getKeyByValue, SUBSCRIBER_USER_ROLE_STUDLY, USER_TYPES_STUDLY } from 'src/_mock';
import Scrollbar from '../scrollbar';

export default function CustomNavCollapseList({ onOpen, isShirinked = false }) {
  // const [open, setOpen] = React.useState(true);
  const projects = useSelector((state) => state.project.list);
  const email = useSelector((state) => state.user?.user?.email);
  const currentProject = useSelector((state) => state.project.current);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const userType = useSelector((state) => state?.user?.user?.userType);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleClose = () => {
  //     setOpen(!open);
  // };
  // const handleProject = (project, redirect) => {
  //   dispatch(setCurrentProject(project));
  //   // dispatch(getSubmittalList())
  //   const { members } = project;
  //   if (role !== 'CAD') {
  //     if (members && members.length > 0) {
  //       const projectRole = members.find((member) => member.email === email);
  //       dispatch(setCurrentProjectRole(projectRole?.role));
  //     }
  //   }
  //   if (redirect) {
  //     dispatch(getSubmittalList({ search: '', page: 1, status: [] }));
  //     navigate(paths.subscriber.submittals.list);
  //   }
  //   handleClose();
  // };

  const handleProject = (project, redirect) => {
    dispatch(setCurrentProject(project));

    const { members, id: projectId, company: companyId } = project;
    const isCompanyAdmin = role === 'CAD';
    let projectData;
    let updatedRole;

    if (!isCompanyAdmin && role !== 'PWU') {
      // Non-Company Admin and Non-Power User Logic
      const projectMember = members.find((member) => member.email === email);

      if (projectMember) {
        updatedRole = projectMember.role;
        projectData = {
          role: updatedRole,
          userType: updatedRole.loggedInAs,
          projectId,
          companyId,
        };
        dispatch(setCurrentProjectRole(updatedRole));
      }
    } else {
      // Company Admin Logic
      updatedRole = {
        name: SUBSCRIBER_USER_ROLE_STUDLY.CAD,
        shortName: getKeyByValue(SUBSCRIBER_USER_ROLE_STUDLY, SUBSCRIBER_USER_ROLE_STUDLY.CAD),
        loggedInAs: USER_TYPES_STUDLY.SUB,
      };
      projectData = {
        role: updatedRole,
        userType: USER_TYPES_STUDLY.SUB,
        projectId,
        companyId,
      };
      dispatch(setCurrentProjectRole(updatedRole));
      console.log('Company Admin');
    }

    if (projectData) {
      dispatch(authSwitchProject(projectData));
    }

    if (redirect) {
      dispatch(getSubmittalList({ search: '', page: 1, status: [] }));
      navigate(paths.subscriber.submittals.list);
    }

    handleClose();
  };

  React.useEffect(() => {
    async function getProjects() {
      await dispatch(getProjectList());
    }
    getProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const updatedCurrentProject = projects.findIndex((project) => project.id === currentProject.id);
    if (updatedCurrentProject !== -1) {
      handleProject(projects[updatedCurrentProject], false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

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
    handleClose();
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent', color: 'white' }}
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

      <ListItem
        id="nested-list-subheader"
        onClick={handleClick}
        size="small"
        sx={{
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          borderBottom: '1px solid grey',
          mb: 2,
          '&:hover': {
            bgcolor: (theme) => theme.palette.secondary.dark,
            transition: 'ease-in-out .3s',
          },
          // fontSize: isShirinked ? '1rem' : '2rem',

          ...(isShirinked && { fontSize: '.75rem', textAlign: 'center' }),
        }}
        aria-controls={open ? 'project-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {truncate(currentProject?.name || 'Create New Project', {
          length: isShirinked ? 12 : 20,
          omission: '...',
        })}
      </ListItem>
      <Scrollbar>
        <Menu
          anchorEl={anchorEl}
          id="project-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          slotProps={{
            elevation: 0,
            paper: {
              sx: {
                position: 'fixed',
                top: '0 !important',
                left: '0 !important',
                width: 280,
                maxWidth: '100%',
                minHeight: '100%',
                borderRadius: 0,
              },
            },
          }}
        >
          {(role === 'CAD' || role === 'PWU') && (
            <MenuItem
              MenuItem
              onClick={handleCreateNewProject}
              sx={{
                // position: "sticky",
                // bottom: 0,
                // left: 0,
                backgroundColor: (theme) => theme.palette.background.paper,
                '&.MuiMenuItem-root': {
                  marginBottom: '1rem',
                  padding: '1rem',
                },
                '&:hover': {
                  opacity: 0.75,
                  bgcolor: 'white',
                },
              }}
            >
              {/* <ListItemButton onClick={onOpen}> */}
              <ListItemIcon sx={{ m: 0 }}>
                <Iconify width={24} icon="mi:circle-add" />
              </ListItemIcon>
              <ListItemText primary="Add New Project" />
              {/* </ListItemButton> */}
            </MenuItem>
          )}
          <Divider
            sx={{ '.MuiDivider-root': { marginBottom: '1rem' }, border: '1px solid white' }}
          />
          {projects &&
            projects.map((project) => (
              <MenuItem
                sx={{ justifyContent: 'center', border: '1px solid grey' }}
                key={project._id}
                onClick={() => handleProject(project, true)}
              >
                {project?.name}
              </MenuItem>
            ))}
        </Menu>
      </Scrollbar>
    </List>
  );
}

CustomNavCollapseList.propTypes = {
  onOpen: PropTypes.func,
  isShirinked: PropTypes.bool,
};
