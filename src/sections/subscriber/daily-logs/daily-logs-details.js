import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Unstable_Grid2';

import { Box, Button, Card, Chip, Menu, MenuItem, Typography, alpha, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { MultiFilePreview } from 'src/components/upload';
import {
  changeToMinutes,
  createFollowup,
  getDailyLogsPDF,
  sendToAttendees,
} from 'src/redux/slices/dailyLogsSlice';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
  '& .submittalTitle': {
    flex: 0.25,
    borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
    fontWeight: 'bold',
  },
  display: 'flex',
  flexDirection: 'column', // Stack items for small screens
  borderRadius: '10px',
  padding: '1rem',
  gap: '1rem',
  ...(isSubcontractor && {
    maxHeight: 300,
  }),
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem', // Reduce padding for small screens
    '& .submittalTitle': {
      fontSize: '0.9rem', // Adjust font size for small screens
    },
  },
}));

const DailyLogsDetails = ({ id }) => {
  const currentLog = useSelector((state) => state.dailyLogs?.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const { attachments, status } = currentLog;

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
            Distribute
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
  }, [currentUser, status, isSubmitting, currentLog]);

  const memoizedMenuItems = useMemo(() => getMenus(), [getMenus]);

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [memoizedMenuItems]);

  const handleExportPDF = async (e) => {
    setIsSubmitting(true);
    await dispatch(getDailyLogsPDF(currentLog?._id));
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
    await dispatch(sendToAttendees(currentLog?._id));
    setIsSubmitting(false);
    enqueueSnackbar('daily Logs have been successfully distributed', { variant: 'success' });
    navigate(paths.subscriber.logs.list);
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
      <Box display="flex" alignItems="center" justifyContent="flex-end">
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
        {[
          { title: 'Date', content: new Date(currentLog?.date).toLocaleDateString() },
          {
            title: 'Accident and safety issues',
            content: (
              <span dangerouslySetInnerHTML={{ __html: currentLog?.accidentSafetyIssues }} />
            ),
          },
          {
            title: 'Visitors',
            content: currentLog?.visitors?.join(', ') || 'N/A',
          },
          {
            title: 'Inspection',
            content:
              currentLog?.inspection
                ?.map((item) => (item.status ? `${item.value} - Pass` : `${item.value} - Fail`))
                ?.join(' | ') || 'N/A',
          },
          {
            title: 'Weather',
            content:
              currentLog?.weather?.length > 0
                ? currentLog.weather.map((condition, index) => (
                    <Chip
                      key={index}
                      label={condition}
                      sx={{ margin: '2px', backgroundColor: '#FFAB00', color: 'black' }}
                    />
                  ))
                : 'N/A',
          },
          {
            title: 'Subcontractor Attendance',
            content:
              currentLog?.subcontractorAttendance
                ?.map((item) =>
                  item.companyName
                    ? `${item.companyName} - (${item.headCount || 'N/A'}) people`
                    : 'N/A'
                )
                ?.join(' | ') || 'N/A',
          },
          {
            title: 'Distribution List',
            content: currentLog?.distributionList?.map((item) => item.name).join(', '),
          },
          {
            title: 'Attachments',
            content: (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75 }}>
                <MultiFilePreview files={attachments} thumbnail onDownload />
              </Box>
            ),
          },
          {
            title: 'Summary',
            content: <span dangerouslySetInnerHTML={{ __html: currentLog?.summary }} />,
          },
        ].map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <Typography className="submittalTitle">{section.title}</Typography>
              <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
                {section.content}
              </Typography>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

DailyLogsDetails.propTypes = {
  id: PropTypes.string,
};

export default DailyLogsDetails;
