import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Card, Chip, Stack, Typography, alpha, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';

//
import { paths } from 'src/routes/paths';
import { fDateISO } from 'src/utils/format-time';

import { getRfiDetails, submitRfiToArchitect } from 'src/redux/slices/rfiSlice';
//
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
  alignItems: 'center',
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
  const confirm = useBoolean();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentRfi = useSelector((state) => state.rfi?.current);

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
    docStatus,
  } = currentRfi;

  useEffect(() => {
    // getMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          isIncluded(currentRfi?.owner, currentUser?._id) && (
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              onClick={() => confirm.onToggle()}
            >
              Add Response
            </LoadingButton>
          )}
      </Box>
      <Stack
        sx={{
          mt: 3,
          mb: 5,
          gap: 2,
        }}
      >
        {/* // ? If General Contractor has submitted Submittal to the (Architect || Engineer || Sub Contractor) */}
        {status === 'Submitted' &&
          (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
            currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
            <Alert severity="success">RFI is submitted successfully!.</Alert>
          )}

        <StyledCard>
          <Typography className="submittalTitle">Title</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {name}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Description</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {description}
          </Typography>
        </StyledCard>
        {isResponseSubmitted && (
          <StyledCard>
            <Typography className="submittalTitle" sx={{ color: 'green', fontWeight: 'bold' }}>
              Official Response
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
              <Stack direction="column">
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={response?.date && fDateISO(response?.date)}
                  sx={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
                <Box dangerouslySetInnerHTML={{ __html: response?.text }} />
              </Stack>
            </Box>
          </StyledCard>
        )}
        <StyledCard>
          <Typography className="submittalTitle">Drawing Sheet</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {drawingSheet}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Created Date</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {createdDate && fDateISO(createdDate)}
          </Typography>
        </StyledCard>
        <StyledCard>
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
        <StyledCard>
          <Typography className="submittalTitle">Cost Impact</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {costImpact}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Schedule Delay</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {scheduleDelay}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Status</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
            <Label color={getStatusColor(status)} variant="soft">
              {status}
            </Label>
          </Box>
        </StyledCard>

        <StyledCard>
          <Typography className="submittalTitle">Creator</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {creator?.firstName} {creator?.lastName}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Attachments</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
            <MultiFilePreview files={attachments} thumbnail onDownload />
          </Box>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Assignee / Owner</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {owner?.length > 0 &&
              owner.map((item, index) => (
                <span key={index}>
                  {item?.firstName} {item?.lastName}
                  {index < owner.length - 1 ? ', ' : ''}
                </span>
              ))}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">CC List</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
            {ccList?.length > 0 &&
              ccList
                ?.slice(0, 4)
                .map((item) => (
                  <Chip key={item} size="small" color="secondary" variant="outlined" label={item} />
                ))}
            {ccList?.length > 4 && (
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                label={`${ccList.length - 4} +`}
              />
            )}
          </Box>
        </StyledCard>
      </Stack>

      <RfiResponseDialog open={confirm.value} onClose={() => confirm.onFalse()} />
    </>
  );
};

export default RfiDetails;

RfiDetails.propTypes = {
  id: PropTypes.string,
};
