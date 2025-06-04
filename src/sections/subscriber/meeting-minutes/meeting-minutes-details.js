import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Chip, Menu, MenuItem, Paper, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
//
import { paths } from 'src/routes/paths';

//
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';

import {
  changeToMinutes,
  createFollowup,
  getMeetingMinutesPDF,
  sendToAttendees,
} from 'src/redux/slices/meetingMinutesSlice';
import { getPlanRoomListSameProj } from 'src/redux/slices/planRoomSlice';
import MeetingMinutesDetailsDescription from './meeting-minutes-details-description';
import MeetingMinutesDetailsInviteAttendee from './meeting-minutes-details-inviteAttendee';
import MeetingMinutesDetailsNotes from './meeting-minutes-details-notes';
import MeetingMinutesDetailsPermit from './meeting-minutes-details-permit';
import MeetingMinutesDetailsPlan from './meeting-minutes-details-plan';

const TABS = [
  {
    value: 'description',
    label: 'Description',
  },
  {
    value: 'attendees',
    label: 'Attendees',
  },
  {
    value: 'agenda',
    label: 'Agenda',
  },
  {
    value: 'permit',
    label: 'Permit',
  },
  {
    value: 'plan',
    label: 'Plan',
  },
];

const MeetingMinutesDetails = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('description');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentMeeting = useSelector((state) => state.meetingMinutes?.current);

  const [menuItems, setMenuItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(getPlanRoomListSameProj({ status: [] }));
  }, [dispatch]);

  const sameProjListData = useSelector((state) => state?.planRoom?.sameProjlist);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const { status } = currentMeeting;

  const getMenus = useCallback(() => {
    const optionsArray = [];
    if (
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU
    ) {
      optionsArray.push(
        <MenuItem onClick={() => handleExportPDF()}>
          <LoadingButton type="button" variant="outlined" fullWidth loading={isSubmitting}>
            Export To PDF
          </LoadingButton>
        </MenuItem>
      );
      if (status === 'Minutes') {
        optionsArray.push(
          <MenuItem onClick={() => handleCreateFollowUp()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Create Follow-up
            </LoadingButton>
          </MenuItem>
        );
      }
      optionsArray.push(
        <MenuItem onClick={() => handleSendToAttendees()}>
          <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
            Send to Attendees
          </LoadingButton>
        </MenuItem>
      );

      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={() => handleChangeToMinutes()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Change to Minutes
            </LoadingButton>
          </MenuItem>
        );
      }
    }
    return optionsArray;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, status, isSubmitting, currentMeeting]);

  // useMemo to avoid unnecessary state updates
  const memoizedMenuItems = useMemo(() => getMenus(), [getMenus]);

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [memoizedMenuItems]);

  const handleExportPDF = async (e) => {
    setIsSubmitting(true);
    await dispatch(getMeetingMinutesPDF(currentMeeting?._id));
    setIsSubmitting(false);
    handleClose();
  };

  const handleCreateFollowUp = async () => {
    setIsSubmitting(true);
    await dispatch(createFollowup(currentMeeting?._id));
    setIsSubmitting(false);
    enqueueSnackbar('Follow up created successfully', { variant: 'success' });
    navigate(paths.subscriber.meetingMinutes.list);
  };

  const handleSendToAttendees = async () => {
    setIsSubmitting(true);
    await dispatch(sendToAttendees(currentMeeting?._id));
    setIsSubmitting(false);
    enqueueSnackbar('Meeting Minutes have been successfully distributed', { variant: 'success' });
    navigate(paths.subscriber.meetingMinutes.list);
  };

  const handleChangeToMinutes = async () => {
    setIsSubmitting(true);
    await dispatch(changeToMinutes(currentMeeting?._id));
    enqueueSnackbar('Meeting status changed successfully', { variant: 'success' });
    setIsSubmitting(false);
    navigate(paths.subscriber.meetingMinutes.list);
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
              size="large"
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

      <Stack
        direction="row" // Keep direction as row for all screen sizes
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: '#F4F6F8',
          width: '100%',
          borderBottom: '2px solid rgb(239,170,26)',
          overflowX: 'auto', // Allow horizontal scrolling if necessary
        }}
        justifyContent="flex-start" // Align items to the start
        alignItems="center"
      >
        {TABS.map((tab) => (
          <Paper
            key={tab.value} // Add a key prop for React list items
            sx={{
              backgroundColor: tab.value === currentTab ? 'rgb(239,170,26)' : '#F4F6F8',
              p: 2,
              fontFamily: 'Public Sans',
              cursor: 'pointer',
              width: 'auto', // Set width to auto to prevent wrapping
              minWidth: '120px', // Set a minimum width for each tab
              textAlign: 'center',
              borderRadius: 0,
              mb: 0, // No bottom margin
            }}
            onClick={() => handleChangeTab(null, tab.value)}
          >
            {tab.label}
          </Paper>
        ))}
      </Stack>

      {currentTab === 'description' && (
        <MeetingMinutesDetailsDescription data={currentMeeting?.description} />
      )}
      {currentTab === 'attendees' && (
        <MeetingMinutesDetailsInviteAttendee data={currentMeeting?.inviteAttendee} />
      )}
      {currentTab === 'agenda' && <MeetingMinutesDetailsNotes data={currentMeeting?.notes} />}
      {currentTab === 'permit' && <MeetingMinutesDetailsPermit data={currentMeeting?.permit} />}
      {currentTab === 'plan' && <MeetingMinutesDetailsPlan data={sameProjListData} />}
    </>
  );
};

export default MeetingMinutesDetails;

MeetingMinutesDetails.propTypes = {
  id: PropTypes.string,
};
