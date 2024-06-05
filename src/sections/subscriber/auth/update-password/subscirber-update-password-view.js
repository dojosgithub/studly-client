// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
//

import Logo from 'src/components/logo/logo';
import SubscriberUpdatePassword from './subscriber-update-password';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SubscriberUpdatePasswordView() {
    const settings = useSettingsContext();


    return (
        <Container sx={{ height: "100%" }} maxWidth={settings.themeStretch ? false : 'lg'}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "2rem"
            }}>
                <Box>
                    <Logo sx={{ width: "100%", height: '2.5rem', }} />
                </Box>
                <SubscriberUpdatePassword />
            </Box>
        </Container>
    );
}
