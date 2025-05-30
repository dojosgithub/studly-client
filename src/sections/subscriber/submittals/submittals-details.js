import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import {
  LoadingButton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';
import useResponsive from '@mui/material/useMediaQuery'; // Import useResponsive

//
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { fDateISO } from 'src/utils/format-time';
import {
  changeSubmittalStatus,
  getSubmittalDetails,
  resendToSubcontractor,
  submitSubmittalToArchitect,
} from 'src/redux/slices/submittalSlice';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { getStatusColor } from 'src/utils/constants';
import Label from 'src/components/label';
import { MultiFilePreview } from 'src/components/upload';
import { isIncluded } from 'src/utils/functions';
import { useBoolean } from 'src/hooks/use-boolean';
import { getStatusStyle } from 'src/utils/chips-color';
import SubmittalSendAllDialog from './submittal-send-all-dialog';

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

const SubmittalsDetails = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id: parentSubmittalId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentSubmittal = useSelector((state) => state.submittal.current);
  console.log('currentSubmittal', currentSubmittal.history);
  const sentToAllModal = useBoolean();

  const [historyOpen, setHistoryOpen] = useState(false);

  const [menuItems, setMenuItems] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    isResponseSubmitted,
    trade,
    submittalId,
    name,
    leadTime,
    description,
    type,
    status,
    submittedDate,
    returnDate,
    creator,
    owner,
    attachments,
    ccList,
  } = currentSubmittal;

  useEffect(() => {
    getMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubmittal, id, currentUser, isSubmitting]);

  const getMenus = () => {
    const optionsArray = [];

    if (
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU
    ) {
      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={handleSubmitToArchitect}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Submit for Review
            </LoadingButton>
          </MenuItem>
        );
      }
      if (status === 'Rejected (RJT)' || status === 'Make Corrections and Resubmit (MCNR)') {
        optionsArray.push(
          <MenuItem
            onClick={() => navigate(paths.subscriber.submittals.revision(parentSubmittalId))}
          >
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Create Revised Submittal
            </LoadingButton>
          </MenuItem>
        );
      }
      if (status !== 'Draft' && status !== 'Submitted') {
        optionsArray.push(
          <MenuItem onClick={sentToAllModal.onTrue}>
            <LoadingButton
              fullWidth
              //   sx={{ minWidth: 'max-content' }}
              type="submit"
              variant="outlined"
              //   size="large"
              loading={isSubmitting}
              // color="info"
            >
              Send To
            </LoadingButton>
          </MenuItem>
        );
        optionsArray.push(
          <MenuItem onClick={handleVoid}>
            <LoadingButton
              fullWidth
              type="submit"
              variant="outlined"
              //   size="large"
              loading={isSubmitting}
              // color="error"
            >
              VOID
            </LoadingButton>
          </MenuItem>
        );
        optionsArray.push(
          <MenuItem onClick={handleResendEmailSubcontractor}>
            <LoadingButton
              //   sx={{ minWidth: 'max-content' }}
              fullWidth
              type="submit"
              variant="outlined"
              //   size="large"
              loading={isSubmitting}
              // color="primary"
            >
              Resend to Subcontractor
            </LoadingButton>
          </MenuItem>
        );
      }
      // return null;
    }
    if (status !== 'Draft' && status !== 'Submitted' && isResponseSubmitted) {
      optionsArray.push(
        <MenuItem onClick={handleViewResponse}>
          <Button fullWidth variant="outlined">
            View Response
          </Button>
        </MenuItem>
      );
    }
    if (isResponseSubmitted && isIncluded(currentSubmittal?.owner, currentUser?._id)) {
      optionsArray.push(
        <MenuItem onClick={handleEditResponse}>
          <Button fullWidth variant="outlined">
            Edit Response
          </Button>
        </MenuItem>
      );
    }
    if (
      !isResponseSubmitted &&
      status === 'Submitted' &&
      isIncluded(currentSubmittal?.owner, currentUser?._id)
    ) {
      optionsArray.push(
        <MenuItem onClick={handleSubmittalResponse}>
          <Button fullWidth variant="outlined" onClick={handleSubmittalResponse}>
            Add Submittal Response
          </Button>
        </MenuItem>
      );
    }
    setMenuItems(optionsArray);
  };

  const handleSubmitToArchitect = async () => {
    setIsSubmitting(true);
    const { error, payload } = await dispatch(submitSubmittalToArchitect(id));
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Submittal submitted to architect successfully', { variant: 'success' });
    await dispatch(getSubmittalDetails(id));
    navigate(paths.subscriber.submittals.list);
  };

  const handleSubmittalResponse = () => {
    navigate(paths.subscriber.submittals.review(id));
  };
  const handleViewResponse = () => {
    navigate(paths.subscriber.submittals.responseDetails(id));
  };
  const handleEditResponse = () => {
    navigate(paths.subscriber.submittals.review(id));
  };
  const handleResendEmailSubcontractor = async () => {
    setIsSubmitting(true);
    const { error, payload } = await dispatch(resendToSubcontractor(id));
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Submittal response has been resent to subcontractor', { variant: 'success' });
  };
  const handleVoid = async () => {
    setIsSubmitting(true);
    const { error, payload } = await dispatch(
      changeSubmittalStatus({ status: 'Void', submittalId: id })
    );
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(payload || 'Submittal status updated successfully', { variant: 'success' });
    navigate(paths.subscriber.submittals.list);
  };
  const isSmallScreen = useResponsive((theme) => theme.breakpoints.down('sm'));

  const openDrawer = () => {
    setHistoryOpen(true);
  };
  const closeDrawer = () => {
    setHistoryOpen(false);
  };

  const drawerContent = (
    <Box sx={{ width: 650, p: 4, height: '100%' }} role="presentation">
      <Stack
        pt={1}
        pb={2.5}
        mb={7}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid #D9D9D9"
      >
        <Typography
          sx={{ fontSize: '26px', fontWeight: '700', lineHeight: '36px', color: '#000000' }}
        >
          Submittal History
        </Typography>
        <IconButton onClick={closeDrawer}>
          <Iconify icon="gg:close-o" color="black" height={22} width={24} />
        </IconButton>
      </Stack>
      {currentSubmittal.history && currentSubmittal.history.length > 0 ? (
        <Box>
          <Timeline
            sx={{
              m: 0,
              p: 0,
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
            }}
          >
            {currentSubmittal.history?.map((item, index) => {
              const dateObj = new Date(item.dateTime);
              const day = String(dateObj.getDate()).padStart(2, '0');
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const year = dateObj.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;

              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <TimelineItem key={index}>
                  <TimelineOppositeContent
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'pre-line',
                      pl: 0,
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                        lineHeight: '18px',
                        color: '#0F172A',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {`${formattedDate}\n   ${formattedTime}`}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator
                    sx={{
                      '& .MuiTimelineDot-root': {
                        backgroundColor: '#28D0B0',
                      },
                      '& .MuiTimelineConnector-root': {
                        backgroundColor: '#D9D9D9',
                        width: '0.5px',
                      },
                    }}
                  >
                    <TimelineDot sx={{ color: '#28D0B0' }} />
                    {index !== currentSubmittal.history.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography sx={{ fontSize: '18px', fontWeight: '500', color: '#0F172A' }}>
                      {item.description}
                    </Typography>

                    {item.status && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: '500',
                            lineHeight: '18px',
                            color: '#0F172A',
                          }}
                        >
                          Status:
                        </Typography>
                        <Chip
                          sx={{ ml: '1rem', ...getStatusStyle(item.status) }}
                          label={item.status}
                          size="small"
                        />
                      </Box>
                    )}

                    {item.nextActionBy?.length > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: '18px', fontWeight: '500', color: '#0F172A' }}
                      >
                        Next Action By:{' '}
                        {item.nextActionBy.map((next, i) => (
                          <span key={i}>
                            {next}
                            {i < item.nextActionBy.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </Typography>
                    )}

                    <Box sx={{ height: 20 }} />
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Box>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="center" mt={8}>
        <Typography sx={{textAlign:"center"}} variant='h4'>No history present at the moment</Typography>
      </Stack>
      )}
      
    </Box>
  );
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
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
          <Button size="large" variant="contained" onClick={openDrawer}>
            History
          </Button>
          <Drawer
            anchor="right"
            open={historyOpen}
            onClose={openDrawer}
            ModalProps={{
              hideBackdrop: true,
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        {menuItems.length > 0 && (
          <div>
            <Button
              variant="outlined"
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Actions
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {menuItems}
            </Menu>
          </div>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mt: 3, mb: 5 }}>
        {/* Display alert if submittal is submitted */}
        {status === 'Submitted' &&
          (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
            currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
            <Grid item xs={12}>
              <Alert severity="success">
                Submittal is submitted to (architect/engineer/subcontractor). Is pending for review.
              </Alert>
            </Grid>
          )}

        {/* Display alert if user's response to the submittal was submitted */}
        {isResponseSubmitted && isIncluded(currentSubmittal?.owner, currentUser?._id) && (
          <Grid item xs={12}>
            <Alert severity="success">
              Your response to the submittal was submitted. Thank You!
            </Alert>
          </Grid>
        )}

        {/* Trade */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Trade</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {trade?.name}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Submittal ID */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Submittal ID</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {submittalId}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Name */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Name</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {name}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Lead Time */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Lead Time</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {leadTime}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Description */}
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

        {/* Type */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Type</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {type}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Status */}
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

        {/* Submitted Date */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Submitted Date</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
              {submittedDate && fDateISO(submittedDate)}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Requested Return Date */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">Requested Return Date</Typography>
            <Typography
              sx={{
                color: (theme) =>
                  isBefore(
                    new Date(returnDate).setHours(0, 0, 0, 0),
                    new Date().setHours(0, 0, 0, 0)
                  )
                    ? 'red'
                    : theme.palette.secondary,
                flex: 0.75,
                px: 2,
              }}
            >
              {returnDate && fDateISO(returnDate)}
            </Typography>
          </StyledCard>
        </Grid>

        {/* Creator */}
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

        {/* Attachments */}
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

        {/* Assignee / Owner */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
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
        </Grid>

        {/* CC List */}
        <Grid item xs={12}>
          <StyledCard
            sx={{
              width: '100%',
              marginBottom: '20px',
              flexDirection: isSmallScreen ? 'column' : 'row',
            }}
          >
            <Typography className="submittalTitle">CC List</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
              {ccList?.length > 0 &&
                ccList
                  .slice(0, 4)
                  .map((item) => (
                    <Chip
                      key={item}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      label={item}
                    />
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
        </Grid>
      </Grid>

      {sentToAllModal?.value && (
        <SubmittalSendAllDialog
          open={sentToAllModal.value}
          onClose={() => sentToAllModal.onFalse()}
        />
      )}
    </>
  );
};

export default SubmittalsDetails;

SubmittalsDetails.propTypes = {
  id: PropTypes.string,
};
