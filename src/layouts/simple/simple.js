import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import { useBoolean } from 'src/hooks/use-boolean';
import Header from '../dashboard/header';

// ----------------------------------------------------------------------

export default function SimpleLayout({ children }) {
    const nav = useBoolean();

    return (
        <>
            <Header onOpenNav={nav.onTrue} isOnboarding/>
            <Box
                sx={{
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    paddingTop:"5rem"
                }}
            >
                {children}
            </Box>
        </>
    );
}

SimpleLayout.propTypes = {
    children: PropTypes.node,
};
