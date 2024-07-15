import PropTypes from 'prop-types';
import React from 'react';
// import { makeStyles } from '@mui/styles';
// import { makeStyles } from '@mui/system'; // Updated import
import { Paper, Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import Scrollbar from '../scrollbar';

// const useStyles = makeStyles((theme) => ({
//     root: {
//       display: 'flex',
//       justifyContent: 'center',
//       marginTop: theme.spacing(2),
//     },
//     thumbnail: {
//       border: '1px solid #ccc',
//       cursor: 'pointer',
//       margin: theme.spacing(1),
//       padding: theme.spacing(1),
//       '&:hover': {
//         boxShadow: theme.shadows[4],
//       },
//     },
//   }));

// Define a styled Paper component with custom styles
const ThumbnailPaper = styled(Paper)(({ theme, isActive }) => ({
  // border: '1px solid #ccc',
  border: isActive ? '2px solid blue' : '1px solid #ccc',
  cursor: 'pointer',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ThumbnailsViewer = ({ currentSheetIndex, setCurrentSheetIndex }) => {
  //   const classes = useStyles();
  const planroom = useSelector((state) => state?.planRoom?.current);

  const truncateTitle = (title) => (title.length > 15 ? `${title.slice(0, 15)} ...` : title);

  return (
    <div>
      <Scrollbar sx={{ p: 3, pt: 2, height: '85vh' }}>
        <Grid container spacing={2} justifyContent="center">
          {planroom?.sheets?.map((sheet, index) => (
            <Grid item key={index}>
              <Stack direction="column" justifyContent="center" alignItems="center">
                <ThumbnailPaper
                  isActive={index === currentSheetIndex}
                  onClick={() => setCurrentSheetIndex(index)}
                >
                  <img src={sheet.src.thumbnail} alt={`Thumbnail ${index}`} width={100} />
                </ThumbnailPaper>
                <Typography>{truncateTitle(sheet.title)}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Scrollbar>
    </div>
  );
};

export default ThumbnailsViewer;
ThumbnailsViewer.propTypes = {
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
