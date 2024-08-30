import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from 'src/theme/css';
//
import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function MarkupPreviewButton({ onPreview }) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onPreview}
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: 'absolute',
        borderRadius: 'unset',
        justifyContent: 'center',
        bgcolor: 'grey.800',
        color: 'common.white',
        transition: theme.transitions.create(['opacity']),

        '&:hover': {
          opacity: 1,
          ...bgBlur({
            opacity: 0.64,
            color: theme.palette.grey[900],
          }),
        },
      }}
    >
      <Iconify icon="eva:eye-fill" width={24} />
    </IconButton>
  );
}

MarkupPreviewButton.propTypes = {
  onPreview: PropTypes.func,
};
