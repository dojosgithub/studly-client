import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Unstable_Grid2';

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
  getDailyLogsPDF,
  sendToAttendees,
} from 'src/redux/slices/dailyLogsSlice';
import { useBoolean } from 'src/hooks/use-boolean';
import Editor from 'src/components/editor/editor';
import Logs from './daily-logs-details-logs';
// import Description from './meeting-minutes-details-description';
// import InviteAttendee from './meeting-minutes-details-inviteAttendee';
// import Notes from './meeting-minutes-details-notes';
// import Permit from './meeting-minutes-details-permit';
// import Plan from './meeting-minutes-details-plan';

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

const DailyLogsDetails = ({ id }) => {
  const currentLog = useSelector((state) => state.dailyLogs?.current);
  console.log('raahim', currentLog);
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
  } = currentLog;

  console.log('isSubmitting', isSubmitting);
  // useEffect(() => {
  //   getMenus();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentMeeting]);

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
      // if (status === 'Draft') {
      optionsArray.push(
        <MenuItem onClick={() => handleSendToAttendees()}>
          <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
            Distribute
          </LoadingButton>
        </MenuItem>
      );
      // }

      if (status === 'Draft') {
        optionsArray.push(
          <MenuItem onClick={() => handleChangeToMinutes()}>
            <LoadingButton type="submit" variant="outlined" fullWidth loading={isSubmitting}>
              Change to Minutes
            </LoadingButton>
          </MenuItem>
        );
      }

      // setMenuItems(optionsArray);
    }
    return optionsArray;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, status, isSubmitting, currentLog]);

  // useMemo to avoid unnecessary state updates
  const memoizedMenuItems = useMemo(() => getMenus(), [getMenus]);

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [memoizedMenuItems]);

  const handleExportPDF = async (e) => {
    setIsSubmitting(true);
    await dispatch(getDailyLogsPDF(currentLog?.id));
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

  const handleSendToAttendees = async () => {
    setIsSubmitting(true);
    // await dispatch(setCreateMeetingMinutes({ ...currentMeeting }));
    await dispatch(sendToAttendees(currentLog?.id));
    setIsSubmitting(false);
    // handleClose();
    enqueueSnackbar('daily Logs have been successfully distributed', { variant: 'success' });
    navigate(paths.subscriber.logs.list);
  };

  const handleChangeToMinutes = async () => {
    setIsSubmitting(true);
    // await dispatch(setCreateMeetingMinutes({ ...currentMeeting }));
    await dispatch(changeToMinutes(currentMeeting?.id));
    // handleClose();
    enqueueSnackbar('Meeting status changed successfully', { variant: 'success' });
    setIsSubmitting(false);
    navigate(paths.subscriber.meetingMinutes.list);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        {/* <Chip
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
        /> */}
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
      <Grid container spacing={3}>
        <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '30px' }}>
          <Typography className="submittalTitle">Date</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {new Date(currentLog?.date).toLocaleDateString()}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
          <Typography className="submittalTitle">Visitors</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {currentLog?.visitors?.map((item) => item).join(', ') || 'N/A'}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
          <Typography className="submittalTitle">Inspection</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {currentLog?.inspection
              ?.map((item) => {
                if (item.status) {
                  return `${item.value} - Pass`;
                }
                return `${item.value} - Fail (${item.reason})`;
              })

              .join(' | ') || 'N/A'}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
          <Typography className="submittalTitle">Weather</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {currentLog?.weather?.length > 0
              ? currentLog.weather.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    sx={{
                      margin: '2px',
                      backgroundColor: '#FFAB00',
                      color: 'black',
                    }}
                  />
                ))
              : 'N/A'}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
          <Typography className="submittalTitle">Subcontractor Attendance</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {currentLog?.subcontractorAttendance
              ?.map((attendance) => attendance.companyName)
              .join(', ')}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%' }}>
          <Typography className="submittalTitle">Distribution List</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            {currentLog?.distributionList?.map((item) => item.name).join(', ')}
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '30px' }}>
          <Typography className="submittalTitle">Attachments</Typography>
          <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
              <MultiFilePreview files={attachments} thumbnail onDownload />
            </Box>
          </Typography>
        </StyledCard>

        <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '20px' }}>
          <Typography className="submittalTitle">Summary</Typography>
          <Typography
            sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 1 }}
            dangerouslySetInnerHTML={{ __html: currentLog?.summary }}
          />
        </StyledCard>
      </Grid>

      {/* <Tabs
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
          '& .MuiTabs-indicator': {
            display: 'none',
          },
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
      </Tabs> */}
    </>
  );
};

export default DailyLogsDetails;

DailyLogsDetails.propTypes = {
  id: PropTypes.string,
};
