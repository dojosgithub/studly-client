import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Card,
  Chip,
  Stack,
  Typography,
  alpha,
  styled,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';

import { paths } from 'src/routes/paths';
import { fDateISO } from 'src/utils/format-time';
import { getRfiDetails, submitRfiToArchitect } from 'src/redux/slices/rfiSlice';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { getStatusColor } from 'src/utils/constants';
import Label from 'src/components/label';
import { MultiFilePreview } from 'src/components/upload';

import { isIncluded } from 'src/utils/functions';
import { useBoolean } from 'src/hooks/use-boolean';
import RfiResponseDialog from './rfi-response-dialog';

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

const RfiDetails = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state?.user?.user?.role?.shortName);

  const confirm = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentRfi = useSelector((state) => state.rfi?.current);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Responsive check

  const {
    name,
    description,
    drawingSheet,
    createdDate,
    dueDate,
    costImpact,
    scheduleDelay,
    attachments,
    status,
    creator,
    owner,
    ccList,
    isResponseSubmitted,
    response,
  } = currentRfi;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log('currentRfi', currentRfi);
  }, [currentRfi, id, currentUser, isSubmitting]);

  const handleSubmitToArchitect = async () => {
    setIsSubmitting(true);
    const { error, payload } = await dispatch(submitRfiToArchitect(id));
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error?.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(`RFI is submitted to architect/engineer.`, { variant: 'success' });
    await dispatch(getRfiDetails(id));
    navigate(paths.subscriber.rfi.list);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
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
          label={status}
        />
        {(currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
          currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) &&
          status === 'Draft' && (
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              onClick={handleSubmitToArchitect}
            >
              Submit for Review
            </LoadingButton>
          )}
        {status === 'Submitted' &&
          !isResponseSubmitted &&
          (isIncluded(currentRfi?.owner, currentUser?._id) || role === 'CAD' || role === 'PWU') && (
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              onClick={() => confirm.onToggle()}
            >
              Add Response
            </LoadingButton>
          )}
      </Box>
      <Grid container spacing={2} sx={{ mt: 3, mb: 5 }}>
        {status === 'Submitted' &&
          (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
            currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
            <Grid item xs={12}>
              <Alert severity="success">RFI is submitted successfully!.</Alert>
            </Grid>
          )}

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Title</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {name}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Description</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {description}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          {isResponseSubmitted && (
            <StyledCard
              sx={{
                width: '100%',
                marginBottom: '10px',
                flexDirection: isSmallScreen ? 'column' : 'row', // Responsive layout
              }}
            >
              <Typography className="submittalTitle" sx={{ color: 'green', fontWeight: 'bold' }}>
                Official Response
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                <Stack direction="column">
                  <Box dangerouslySetInnerHTML={{ __html: response?.text }} />
                  {/* <Chip
                    size="small"
                    color="secondary"
                    variant="outlined"
                    label={response?.date && fDateISO(response?.date)}
                    sx={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    /> */}
                  <Typography>
                    Reviewed By {creator.firstName} {creator.lastName} on{' '}
                    {createdDate && fDateISO(createdDate)}
                  </Typography>
                </Stack>
              </Box>
              {/* 
              <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                <Box dangerouslySetInnerHTML={{ __html: response?.text }} />
              </Typography> */}
            </StyledCard>
          )}
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Drawing Sheet</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {drawingSheet}
            </Typography>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Created Date</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {createdDate && fDateISO(createdDate)}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Due Date</Typography>
            <Typography
              sx={{
                color: (theme) =>
                  isBefore(new Date(dueDate).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
                    ? 'red'
                    : theme.palette.secondary,
                flex: 0.75,
                px: 2,
              }}
            >
              {dueDate && fDateISO(dueDate)}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Cost Impact</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {costImpact}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Schedule Delay</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {scheduleDelay}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Status</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
              <Label color={getStatusColor(status)} variant="soft">
                {status}
              </Label>
            </Box>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Attachments</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
              <MultiFilePreview files={attachments} thumbnail onDownload />
            </Box>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Creator</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {creator?.firstName} {creator?.lastName}
            </Typography>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Owner</Typography>
            {owner?.map((own) => (
              <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                {own?.firstName} {own?.lastName}
              </Typography>
            ))}
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          {!isEmpty(ccList) && (
            <StyledCard
              sx={{
                width: '100%',
                marginBottom: '20px',
                flexDirection: isSmallScreen ? 'column' : 'row',
              }}
            >
              <Typography className="submittalTitle">CC List</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                {ccList.length > 0 &&
                  ccList.map((el) => (
                    <Chip
                      key={el}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      label={el}
                      // sx={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    />
                  ))}
              </Box>
            </StyledCard>
          )}
        </Grid>
      </Grid>

      <RfiResponseDialog open={confirm.value} onClose={confirm.onFalse} />
    </>
  );
};

RfiDetails.propTypes = {
  id: PropTypes.string.isRequired,
};

export default RfiDetails;
