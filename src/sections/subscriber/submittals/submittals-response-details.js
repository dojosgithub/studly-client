import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, Chip, Grid, Stack, Typography, alpha, styled } from '@mui/material';
import { MultiFilePreview } from 'src/components/upload';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
  '& .submittalTitle': {
    color: theme.palette.primary,
    flex: 0.15,
    flexBasis: '40px',
    borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
    fontWeight: 'bold',
  },
  display: 'flex',
  borderRadius: '10px',
  padding: '1rem',
  gap: '1rem',
  flexDirection: 'row', // Default to row layout
  '@media (max-width:600px)': {
    flexDirection: 'column', // Column layout for small screens
  },
  ...(isSubcontractor && {
    maxHeight: 300,
  }),
}));

const SubmittalsDetails = ({ id }) => {
  const currentUser = useSelector((state) => state.user?.user);
  const currentSubmittal = useSelector((state) => state.submittal.current);
  const { isResponseSubmitted, response } = currentSubmittal;

  useEffect(() => {}, [currentSubmittal, id, currentUser]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {isResponseSubmitted && (
          <Chip
            size="large"
            color="secondary"
            variant="outlined"
            sx={{
              '&.MuiChip-root': {
                height: '50px',
                fontSize: '1rem',
                maxWidth: 'max-content',
                width: '100%',
                paddingInline: '.75rem',
              },
            }}
            label={response?.status}
          />
        )}
      </Box>

      <Stack sx={{ mt: 3, mb: 5, gap: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <Typography className="submittalTitle">Status</Typography>
              <Chip size="medium" variant="outlined" label={response?.status} />
            </StyledCard>
          </Grid>

          <Grid item xs={12}>
            <StyledCard>
              <Typography className="submittalTitle">Comment</Typography>
              <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                {response?.comment}
              </Typography>
            </StyledCard>
          </Grid>

          <Grid item xs={12}>
            <StyledCard>
              <Typography className="submittalTitle">Attachments</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                {isResponseSubmitted && response?.attachments.length > 0 && (
                  <MultiFilePreview files={response?.attachments} thumbnail onDownload />
                )}
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default SubmittalsDetails;

SubmittalsDetails.propTypes = {
  id: PropTypes.string,
};
