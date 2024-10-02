import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      sx={{
        display: 'flex', // Flexbox for centering
        justifyContent: 'center', // Horizontal centering
        alignItems: 'center', // Vertical centering
        width: '100%', // Full width of the container
      }}
    >
      <Box
        component="img"
        src="/logo/new-logo-1.png"
        sx={{
          width: { xs: '50%', sm: '30%', md: '20%' }, // Responsive width
          height: 'auto', // Maintain aspect ratio
          maxHeight: 60, // Control maximum height
          cursor: 'pointer', // Pointer cursor for interaction
        }}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
