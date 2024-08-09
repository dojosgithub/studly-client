import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
//
import { fileData, fileFormat, fileThumb } from './utils';
import DownloadButton from './download-button';

// ----------------------------------------------------------------------

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  downloadAble = false,
  sx,
  imgSx,
}) {
  const { name = '', path = '', preview = '' } = fileData(file);
console.log(name, path, preview)
  const format = fileFormat(path || preview);

  const onDownloadHandler = () => {
    // if (format === 'image') {
    //   window.open(preview, '_blank', 'noreferrer');
    // } else {
    //   window.open(preview, '_blank', 'noreferrer');
    // }
    window.open(preview, '_blank', 'noreferrer');
  };

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'contain',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {downloadAble && <DownloadButton onDownload={onDownloadHandler} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {downloadAble && <DownloadButton onDownload={onDownloadHandler} />}
    </>
  );
}

FileThumbnail.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  // onDownload: PropTypes.func,
  downloadAble: PropTypes.bool,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
