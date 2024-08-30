import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
//
import { useBoolean } from 'src/hooks/use-boolean';
import SubmittalPdfViewerDrawer from 'src/sections/subscriber/submittals/submittal-pdf-viewer-drawer';

import { fileData, fileFormat, fileThumb } from './utils'; 
// import MarkupPreviewButton from './download-button';
import MarkupPreviewButton from './markup-preview-button';
// ----------------------------------------------------------------------

export default function MarkedUpFileThumbnail({
  file,
  tooltip,
  imageView,
  downloadAble = false,
  sx,
  imgSx,
}) {
  const { name = '', path = '', preview = '' } = fileData(file);
  // console.log(name, path, preview);
  const format = fileFormat(path || preview);
  const confirm = useBoolean();

  const onPreviewHandler = () => {
    // window.open(preview, '_blank', 'noreferrer');
    console.log('PREVIEW');
    confirm.onTrue();
  };

  const openDrawer = () => {
    confirm.onTrue();
  };

  const closeEditor = () => {
    confirm.onFalse();
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

  return (
    <>
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
          <MarkupPreviewButton onPreview={onPreviewHandler} />
        </Stack>
      </Tooltip>
      {confirm.value && (
        <SubmittalPdfViewerDrawer open={confirm.value} onClose={closeEditor} file={file} />
      )}
    </>
  );
}

MarkedUpFileThumbnail.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  // onDownload: PropTypes.func,
  downloadAble: PropTypes.bool,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
