import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function SimpleLayout({ children }) {

    return (

        <Box
            sx={{
                minHeight: 1,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            {children}
        </Box>
    );
}

SimpleLayout.propTypes = {
    children: PropTypes.node,
};
