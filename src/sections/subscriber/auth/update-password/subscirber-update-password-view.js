// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
//

import SubscriberUpdatePassword from './subscriber-update-password';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SubscriberUpdatePasswordView() {
    const settings = useSettingsContext();


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Box sx={{
                display:"grid",
                placeItems:"center"
            }}>
                <SubscriberUpdatePassword />
            </Box>
        </Container>
    );
}
