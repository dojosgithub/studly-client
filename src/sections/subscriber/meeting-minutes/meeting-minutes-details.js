import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
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
  Tab,
  Tabs,
  Typography,
  alpha,
  styled,
  tabsClasses,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { addDays, isAfter, isBefore, isTomorrow, parseISO } from 'date-fns';
import { bgcolor } from '@mui/system';
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
import { getRfiDetails, submitRfiToArchitect } from 'src/redux/slices/rfiSlice';
//
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';

import { getStatusColor } from 'src/utils/constants';
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import { MultiFilePreview } from 'src/components/upload';
import { isIncluded } from 'src/utils/functions';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  changeToMinutes,
  createFollowup,
  getMeetingMinutesPDF,
  sendToAttendees,
  setCreateMeetingMinutes,
} from 'src/redux/slices/meetingMinutesSlice';
import { useBoolean } from 'src/hooks/use-boolean';
import Editor from 'src/components/editor/editor';
import Description from './meeting-minutes-details-description';
import InviteAttendee from './meeting-minutes-details-inviteAttendee';
import Notes from './meeting-minutes-details-notes';
import Permit from './meeting-minutes-details-permit';
import Plan from './meeting-minutes-details-plan';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
  '& .submittalTitle': {
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
  const params = useParams();
  const confirm = useBoolean();
  const [currentTab, setCurrentTab] = useState('description');

  const { id: parentSubmittalId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user?.user);
  const currentMeeting = useSelector((state) => state.meetingMinutes?.current);

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

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

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
  } = currentMeeting;

  useEffect(() => {
    getMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMenus = () => {
    const optionsArray = [];

    if (
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
      currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU
    ) {
      optionsArray.push(
        <MenuItem onClick={() => handleExportPDF()}>
          <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
            Export To PDF
          </LoadingButton>
        </MenuItem>
      );
      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={() => handleCreateFollowUp()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Create Follow-up
            </LoadingButton>
          </MenuItem>
        );
      }
      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={() => handleSendToAttendees()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Send to Attendees
            </LoadingButton>
          </MenuItem>
        );
      }

      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={() => handleChangeToMinutes()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Change to Minutes
            </LoadingButton>
          </MenuItem>
        );
      }

      setMenuItems(optionsArray);
    }
  };

  const handleExportPDF = async () => {
    // setIsSubmitting(true);
    // dispatch(submitSubmittalToArchitect(id));
    setIsSubmitting(true);
    console.log(currentMeeting, currentMeeting?.id);
    await dispatch(getMeetingMinutesPDF(currentMeeting?.id));
    setIsSubmitting(false);
    handleClose();
  };

  const handleCreateFollowUp = async () => {
    setIsSubmitting(true);
    // await dispatch(setCreateMeetingMinutes({ ...currentMeeting }));
    await dispatch(createFollowup(currentMeeting?.id));
    setIsSubmitting(false);
    // handleClose();
    enqueueSnackbar('Follow up created successfully', { variant: 'success' });
    navigate(paths.subscriber.meetingMinutes.list);
  };

  const handleSendToAttendees = () => {
    setIsSubmitting(true);
    // await dispatch(setCreateMeetingMinutes({ ...currentMeeting }));
    dispatch(sendToAttendees(currentMeeting?.id));
    setIsSubmitting(false);
    // handleClose();
    enqueueSnackbar('Send to attendess successfully', { variant: 'success' });
    navigate(paths.subscriber.meetingMinutes.list);
  };

  const handleChangeToMinutes = () => {
    setIsSubmitting(true);
    // await dispatch(setCreateMeetingMinutes({ ...currentMeeting }));
    dispatch(changeToMinutes(currentMeeting?.id));
    setIsSubmitting(false);
    // handleClose();
    enqueueSnackbar('Send to attendess successfully', { variant: 'success' });
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
            // mr: 1
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
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          width: 1,
          bottom: 0,
          zIndex: 9,
          bgcolor: '#F4F6F8',
          marginBottom: '35px',
          borderBottom: '2px solid #FFCC3F',
          mt: 1,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            sx={{
              fontFamily: 'Public Sans',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              textAlign: 'left',
              width: 197,
              color: 'inherit',

              '&.Mui-selected': {
                color: 'white',
                bgcolor: '#FFCC3F',
              },
            }}
          />
        ))}
      </Tabs>

      {currentTab === 'description' && <Description data={currentMeeting?.description} />}
      {currentTab === 'attendees' && <InviteAttendee data={currentMeeting?.inviteAttendee} />}
      {currentTab === 'agenda' && <Notes data={currentMeeting?.notes} />}
      {currentTab === 'permit' && <Permit data={currentMeeting?.permit} />}
      {currentTab === 'plan' && <Plan data={currentMeeting?.plan} />}
    </>
  );
};

export default MeetingMinutesDetails;

MeetingMinutesDetails.propTypes = {
  id: PropTypes.string,
};
