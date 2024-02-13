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

// theme
import { paper } from 'src/theme/css';
//
import { ProjectView } from 'src/sections/project/view';
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
//
// import { useSettingsContext } from './context';


// ----------------------------------------------------------------------

export default function CustomDrawer({ open, onClose }) {
    const theme = useTheme();

    //   const settings = useSettingsContext();

    const labelStyles = {
        mb: 1.5,
        color: 'text.disabled',
        fontWeight: 'fontWeightSemiBold',
    };

    const renderHead = (
        <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ py: 2, pr: 2.5, pl: 5 }}
        >

            <CustomBreadcrumbs
                heading="Create Project"
                links={[
                    {
                        name: 'Dashboard',
                        // href: paths.subscriber.root
                    },
                    { name: 'Projects', href: paths.subscriber.submittals.list },
                    { name: 'Create' },
                ]}
                // action={
                //     <Button
                //         component={RouterLink}
                //         href={paths.subscriber.submittals.new}
                //         variant="outlined"
                //         startIcon={<Iconify icon="mingcute:add-line" />}
                //     >
                //         Create New Submittal
                //     </Button>
                // }
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
            />



        </Stack>
    );

    const renderMode = (
        <div>
            <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
                Mode
            </Typography>


        </div>
    );

    const renderContrast = (
        <div>
            <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
                Contrast
            </Typography>


        </div>
    );

    const renderDirection = (
        <div>
            <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
                Direction
            </Typography>


        </div>
    );

    const renderLayout = (
        <div>
            <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
                Layout
            </Typography>


        </div>
    );

    const renderStretch = (
        <div>
            <Typography
                variant="caption"
                component="div"
                sx={{
                    ...labelStyles,
                    display: 'inline-flex',
                    alignItems: 'center',
                }}
            >
                Stretch
                <Tooltip title="Only available at large resolutions > 1600px (xl)">
                    <Iconify icon="eva:info-outline" width={16} sx={{ ml: 0.5 }} />
                </Tooltip>
            </Typography>

        </div>
    );

    const renderStepper = (
        <ProjectView />

    );

    const renderPresets = (
        <div>
            <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
                Presets
            </Typography>


        </div>
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

            <Scrollbar>
                {/* <Stack spacing={3} sx={{ py: 0, px: 5, height: '100%' }}>
                    {renderMode}

                    {renderContrast}

                    {renderDirection}

                    {renderLayout}

                    {renderStretch}

                    {renderPresets}
                   

                </Stack> */}

                <ProjectView />
            </Scrollbar>

        </Drawer>
    );
}
CustomDrawer.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
