import PropTypes from 'prop-types';
// redux
import { useSelector } from 'react-redux';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Logo from 'src/components/logo';
import SearchIllustration from 'src/assets/illustrations/search-illustration.svg';
import OnboardingProjects from '../onboarding-projects';
import OnboardingWithoutProjects from '../onboarding-without-project';

// ----------------------------------------------------------------------

// const projects = ['project 1', 'project 2', 'project 3', 'project 4', 'project 5',]
export default function OnboardingView() {
    const { method, user } = useAuthContext();
    const projects = useSelector(state => state.project.list);

    const theme = useTheme();

    const upMd = useResponsive('up', 'md');

    const renderContent = (
        <Box
            sx={{
                // width: 1,
                // maxWidth: 800,
                flexGrow: 1,
                mx: 'auto',
                px: { xs: 2, md: 4 },
                py: { xs: 5, md: 5 },
            }}
        >
            {projects?.length > 0 ?
                <OnboardingProjects projects={projects} /> :
                <OnboardingWithoutProjects />
            }
        </Box>
    );

    const renderSection = (
        <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            spacing={10}
            sx={{
                ...bgGradient({
                    color: alpha(
                        theme.palette.background.default,
                        theme.palette.mode === 'light' ? 0.88 : 0.94
                    ),
                    imgUrl: '/assets/background/overlay_2.jpg',
                }),
            }}
        >


            <Box
                component="img"
                alt="auth"
                src={SearchIllustration || '/assets/illustrations/search-illustration.svg'}
                sx={{ maxWidth: 720 }}
            />

        </Stack>
    );

    return (
        <Stack
            component="main"
            width="100%"
            sx={{
                // minHeight: '100vh',
            }}
        >

            <Typography variant="h3" my={2} sx={{ textAlign: 'center', height: '10rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Hi Bryan!  Which project would you <br /> like to start working on today?
            </Typography>
            <Stack
                component="div"
                direction="row"
            // sx={{
            //     minHeight: '100vh',
            // }}
            >
                {/* {renderLogo} */}

                {upMd && renderSection}

                {renderContent}

            </Stack>
        </Stack>
    );
}

// OnboardingView.propTypes = {
//     children: PropTypes.node,
//     image: PropTypes.string,
//     title: PropTypes.string,
// };
