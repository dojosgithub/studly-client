import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { styled, Typography } from '@mui/material';
import useResponsive from '@mui/material/useMediaQuery'; // Import useResponsive

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
  width: '100%',
  ...(isSubcontractor && {
    maxHeight: 300,
  }),
}));

export default function MeetingMinutesDetailsDescription({ data }) {
  // Use useResponsive to determine the screen size and apply conditional styles
  const isSmallScreen = useResponsive((theme) => theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={3}>
      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          marginTop: '30px',
          flexDirection: isSmallScreen ? 'column' : 'row', // Responsive layout
        }}
      >
        <Typography className="submittalTitle">Title</Typography>
        <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
          {data?.title}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Date</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {new Date(data?.date).toLocaleDateString()}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Video Conference ID</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.conferenceCallId}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Minutes By</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.minutesBy}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Site</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.site}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Time</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.timeInString}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Time Zone</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.timezone?.zone} {data?.timezone?.utc}
        </Typography>
      </StyledCard>

      <StyledCard
        sx={{
          width: '100%',
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <Typography className="submittalTitle">Video Conference Link</Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
          {data?.conferenceCallLink}
        </Typography>
      </StyledCard>
    </Grid>
  );
}

MeetingMinutesDetailsDescription.propTypes = {
  data: PropTypes.object,
};
