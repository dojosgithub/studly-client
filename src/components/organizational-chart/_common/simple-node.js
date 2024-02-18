import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const getColor=()=>{
  
}
export default function SimpleNode({ node, sx, onDelete }) {

  return (
    <Card
      sx={{
        p: 2,
        pt: '1.25rem',
        minWidth: 'max-content',
        minHeight: 40,
        boxShadow: 'none',
        borderRadius: 1.5,
        display: 'inline-flex',
        textTransform: 'capitalize',
        textAlign: 'left',
        position: 'relative',
        flexDirection: 'column',
        color: (theme) => (theme.palette.mode === 'light' ? 'success.darker' : 'success.lighter'),
        bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.24)}`,
        ...sx,
      }}
    >
      <IconButton
        color='inherit'
        onClick={() => onDelete(node.name)}
        sx={{ position: 'absolute', top: 4, right: 4, p: 0, height: '1rem', width: '1rem' }}
      >
        <Iconify icon="ic:round-close" />
      </IconButton>
      <Typography variant="subtitle2">{node.name}</Typography>
    </Card>
  );
}

SimpleNode.propTypes = {
  node: PropTypes.object,
  sx: PropTypes.object,
  onDelete: PropTypes.func
};
