import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
// // import { ProjectView } from 'src/sections/project/view';


// theme
import { paper } from 'src/theme/css';
//
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
//
// import { useSettingsContext } from './context';


// ----------------------------------------------------------------------

export default function CustomDrawer({ open, onClose, Component, type = "project" }) {
    const theme = useTheme();

    const renderHead = (
        <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent={type === "template" ? "flex-end" : "space-between"}
            sx={{ py: 2, pr: 2.5, pl: 5 }}
        >

            {type === "template" ?
                (<IconButton onClick={onClose} >
                    <Iconify icon="gg:close-o" color="black" height='2rem' width='2rem' />
                </IconButton>)
                : (<CustomBreadcrumbs
                    heading="Create Project"
                    links={[
                        {
                            name: 'Dashboard',
                            // href: paths.subscriber.root
                        },
                        { name: 'Projects', href: paths.subscriber.submittals.list },
                        { name: 'Create' },
                    ]}

                    action={
                        <IconButton onClick={onClose} >
                            <Iconify icon="gg:close-o" color="black" height='2rem' width='2rem' />
                        </IconButton>
                    }
                    sx={{
                        mb: { xs: 3, md: 5 },
                        mt: { xs: 3, md: 5 },
                        flexGrow: 1
                    }}
                />)}



        </Stack>
    );


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: { invisible: true },
            }}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    // ...paper({ theme, bgcolor: theme.palette.background.default }),
                    width: `calc(100% - ${280}px)`,
                    'background': 'white'
                },
            }}
        >
            {renderHead}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <ProjectView /> */}
            <Component type={type} onClose={onClose}/>

        </Drawer>
    );
}
CustomDrawer.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    Component: PropTypes.node,
    type: PropTypes.string,
};
