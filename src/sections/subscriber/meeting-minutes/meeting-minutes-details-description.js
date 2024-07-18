import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { styled, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
  '& .submittalTitle': {
    color: theme.palette.primary,
    flex: 0.25,
    borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
    fontWeight: 'bold',
  },
  display: 'flex',
  borderRadius: '10px',
  padding: '1rem',
  gap: '1rem',
  ...(isSubcontractor && {
    maxHeight: 300,
  }),
}));

// meetingNumber: '',
//         name: '',
//         // title: '',
//         site: '',
//         date: new Date(),
//         time: '',
//         minutesBy: '',
//         conferenceCallId: '',
//         conferenceCallLink: '',

export default function Description({ data }) {
  console.log('DATA:', data);
  return (
    <Grid container spacing={3}>
      <StyledCard sx={{ width: '100%' ,marginBottom:'20px',marginTop:'30px'}}>
        <Typography className="submittalTitle">Title</Typography>
        <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
          {data?.meetingNumber}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Date</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.date?.toString()}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Meeting ID</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.conferenceCallId}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Minutes By</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.minutesBy}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Name</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.name}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Site</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.site}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%' ,marginBottom:'20px'}}>
        <Typography className="submittalTitle">Time</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.time}
        </Typography>
      </StyledCard>

      <StyledCard sx={{ width: '100%',}}>
  <Typography className="submittalTitle">URL</Typography>
  <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
    {data?.conferenceCallLink}
  </Typography>
</StyledCard>

    </Grid>
  );
}

Description.propTypes = {
  data: PropTypes.object,
};
