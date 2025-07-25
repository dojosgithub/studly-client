import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fData } from 'src/utils/format-number';
//
import Iconify from '../iconify';
import { varFade } from '../animate';
import FileThumbnail, { fileData, MarkedUpFileThumbnail } from '../file-thumbnail';

// ----------------------------------------------------------------------

export default function MultiFilePreview({ thumbnail, files, onRemove, downloadAble, sx }) {
  return (
    <AnimatePresence initial={false}>
      {files?.map((file) => {
        const { key, name = '', size = 0 } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          let fileName = isNotFormatFile ? file : name;
          if (fileName.length > 20) {
            fileName = `${name.slice(0, 20)}...`;
          }
          return (
            <Stack direction="column" sx={{ mr: 1 }}>
              <Stack
                key={key}
                component={m.div}
                {...varFade().inUp}
                alignItems="center"
                display="inline-flex"
                justifyContent="center"
                sx={{
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                  ...sx,
                }}
              >
                {file.isMarkedUp ? (
                  <MarkedUpFileThumbnail
                    tooltip
                    imageView
                    file={file}
                    sx={{ position: 'absolute' }}
                    imgSx={{ position: 'absolute' }}
                  />
                ) : (
                  <FileThumbnail
                    downloadAble
                    tooltip
                    imageView
                    file={file}
                    sx={{ position: 'absolute' }}
                    imgSx={{ position: 'absolute' }}
                  />
                )}

                {onRemove && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      p: 0.5,
                      top: 4,
                      right: 4,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      },
                    }}
                  >
                    <Iconify icon="mingcute:close-line" width={14} />
                  </IconButton>
                )}
              </Stack>

              <ListItemText
                primary={fileName}
                secondary={isNotFormatFile ? '' : fData(size)}
                secondaryTypographyProps={{
                  component: 'span',
                  typography: 'caption',
                }}
              />
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file} />

            <ListItemText
              primary={isNotFormatFile ? file : name}
              secondary={isNotFormatFile ? '' : fData(size)}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </AnimatePresence>
  );
}

MultiFilePreview.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
  // onDownload: PropTypes.func,
  downloadAble: PropTypes.bool,
};
