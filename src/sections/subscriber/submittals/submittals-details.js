import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { addDays, isAfter, isBefore, isTomorrow, parseISO } from 'date-fns';

//
import Scrollbar from 'src/components/scrollbar';
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
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import { MultiFilePreview } from 'src/components/upload';
import { isIncluded } from 'src/utils/functions';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
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

const getActions = (props) => {
  const {
    setMenuItems,
    currentUser,
    status,
    isSubmitting,
    navigate,
    id,
    currentSubmittal,
    isResponseSubmitted,
    parentSubmittalId,
    sentToAllModal,
    handleSubmitToArchitect,
    handleVoid,
    handleResendEmailSubcontractor,
    handleEditResponse,
    handleViewResponse,
    handleSubmittalResponse,
  } = props;

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
        <MenuItem onClick={() => navigate(paths.subscriber.submittals.revision(parentSubmittalId))}>
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
  if (isIncluded(currentSubmittal?.owner, currentUser?._id)) {
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
  setMenuItems(optionsArray)
  // return optionsArray;
};

const SubmittalsDetails = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id: parentSubmittalId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentSubmittal = useSelector((state) => state.submittal.current);
  const sentToAllModal = useBoolean();

  // const  = useBoolean();
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
  const hasSubcontractorId = !isEmpty(trade)
    ? Object.prototype.hasOwnProperty.call(trade, 'subcontractorId')
    : null;

  // const ccListUser = useSelector((state) => state?.submittal?.users) || [];
  // const ownerList = useSelector((state) => state?.submittal?.assigneeUsers) || [];
  // const userList = [...ccListUser, ...ownerList];

  useEffect(() => {
    console.log('currentSubmittal', currentSubmittal);
    console.log('OwnerList', currentSubmittal?.owner);
    console.log('currentUser:?._id', currentUser?._id);
    console.log('id', id);
    getMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubmittal, id, currentUser]);

  const getMenus = () => {
    getActions({
      currentSubmittal,
      currentUser,
      status,
      isSubmitting,
      navigate,
      paths,
      id,
      isResponseSubmitted,
      parentSubmittalId,
      sentToAllModal,
      handleSubmitToArchitect,
      handleVoid,
      handleResendEmailSubcontractor,
      handleEditResponse,
      handleViewResponse,
      handleSubmittalResponse,
      setMenuItems
    });
  };
  const handleSubmitToArchitect = async () => {
    console.log('SubmittalId', id);
    setIsSubmitting(true);
    const { error, payload } = await dispatch(submitSubmittalToArchitect(id));
    console.log('e-p', { error, payload });
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
    console.log('handleSubmittalResponse', handleSubmittalResponse);
    navigate(paths.subscriber.submittals.review(id));
  };
  const handleViewResponse = () => {
    console.log('handleViewResponse');
    navigate(paths.subscriber.submittals.responseDetails(id));
  };
  const handleEditResponse = () => {
    console.log('handleEditResponse');
    navigate(paths.subscriber.submittals.review(id));
  };
  const handleResendEmailSubcontractor = async () => {
    console.log('id', id);
    setIsSubmitting(true);
    const { error, payload } = await dispatch(resendToSubcontractor(id));
    console.log('e-p', { error, payload });
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Submittal response resends successfully', { variant: 'success' });
  };
  const handleVoid = async () => {
    console.log('id', id);
    setIsSubmitting(true);
    const { error, payload } = await dispatch(
      changeSubmittalStatus({ status: 'Void', submittalId: id })
    );
    console.log('e-p', { error, payload });
    setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(payload || 'Submittal status updated successfully', { variant: 'success' });
    navigate(paths.subscriber.submittals.list);
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
              {/* {getActions({
              currentSubmittal,
              currentUser,
              status,
              isSubmitting,
              navigate,
              paths,
              id,
              isResponseSubmitted,
              parentSubmittalId,
              sentToAllModal,
              handleSubmitToArchitect,
              handleVoid,
              handleResendEmailSubcontractor,
              handleEditResponse,
              handleViewResponse,
              handleSubmittalResponse,
            })} */}
              {menuItems}
            </Menu>
          </div>
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
            <Alert severity="success">
              Submittal is submitted to (architect/engineer/subcontractor). Is pending for review.
            </Alert>
          )}

        {isResponseSubmitted && isIncluded(currentSubmittal?.owner, currentUser?._id) && (
          <Alert severity="success">Your response to the submittal was submitted. Thankyou!</Alert>
        )}

        <StyledCard>
          <Typography className="submittalTitle">Trade</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {trade?.name}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Submittal ID</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {submittalId}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Name</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {name}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Lead Time</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {leadTime}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Description</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {description}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Type</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {type}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Status</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
            {/* <Chip size="medium" variant='soft' label={status} color={getStatusColor(status)} /> */}
            <Label color={getStatusColor(status)} variant="soft">
              {status}
            </Label>
            {/* // color={
                            //   (status === 'joined' && 'success') ||
                            //   (status === 'invited' && 'info') ||
                            //   (status === 'pending' && 'warning') ||
                            //   (status === 'banned' && 'error') ||
                            //   'default'
                            // } */}
            {/* {status?.length > 0 && status?.slice(0, 4).map((item) => (
                            <Chip key={item} size="small" variant='outlined' label={item} />
                        ))}
                        {status?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${status.length - 4} +`} />
                        )} */}
          </Box>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Submitted Date</Typography>
          <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
            {submittedDate && fDateISO(submittedDate)}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="submittalTitle">Requested Return Date</Typography>
          <Typography
            sx={{
              // color: (theme) => (isTomorrow(parseISO(returnDate)) ? 'red' : theme.palette.primary),
              color: (theme) =>
                isBefore(new Date(returnDate).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
                  ? 'red'
                  : theme.palette.secondary,
              flex: 0.75,
              px: 2,
            }}
          >
            {returnDate && fDateISO(returnDate)}
          </Typography>
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
            {/* {attachments?.length > 0 && attachments?.slice(0, 4).map((item) => (
                            <Avatar src={item?.preview} sx={{ width: 48, height: 48, mr: 2 }} />
                        ))}
                        {attachments?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${attachments.length - 4} +`} />
                        )} */}
            {/* {attachments?.length > 0 &&
              attachments.map((item) => (
                <FileThumbnail
                //   onDownload
                  tooltip
                  imageView
                  file={item}
                  sx={{ position: 'absolute' }}
                  imgSx={{ position: 'absolute', width: 100 }}
                />
              ))} */}
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
      {sentToAllModal?.value && (
        <SubmittalSendAllDialog
          open={sentToAllModal.value}
          onClose={() => sentToAllModal.onFalse()}
          // userList={userList}
        />
      )}
    </>
  );
};

export default SubmittalsDetails;

SubmittalsDetails.propTypes = {
  id: PropTypes.string,
};
