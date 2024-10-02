import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
//
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function CustomDrawer({
  open,
  onClose,
  isOnboarding = false,
  Component,
  type = 'project',
  setTrades,
}) {
  const smDown = useResponsive('down', 'sm');
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 2.5, pl: 5 }}
    >
      <>
        <Typography fontSize="1.5rem" fontWeight="bold">
          Create New {type.charAt(0).toUpperCase() + type.slice(1)}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="gg:close-o" color="black" height={32} width={32} />
        </IconButton>
      </>
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
          width: `calc(100% - ${280}px)`,
          background: 'white',
          ...(isOnboarding && {
            width: '100%',
          }),
          ...(smDown && {
            width: '100%',
          }),
        },
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Component type={type} onClose={onClose} open={open} setTrades={setTrades} />
    </Drawer>
  );
}
CustomDrawer.propTypes = {
  onClose: PropTypes.func,
  setTrades: PropTypes.func,
  open: PropTypes.bool,
  Component: PropTypes.node,
  type: PropTypes.string,
  isOnboarding: PropTypes.bool,
};
