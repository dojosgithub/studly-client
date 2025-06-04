/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Chip, Stack, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';
import { getRfiDetails, getSubmittalsDetails } from 'src/redux/slices/meetingMinutesSlice';

// Styled Components
const TopicContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),
  border: '1px solid #ddd',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#F2F3F5',
}));

const MeetingMinutesDetailsNotes = ({ data }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (data?.length) {
      const allReferedTo = data.flatMap((note) =>
        note.topics.flatMap((topic) => topic.referedTo || [])
      );

      const submittalIds = allReferedTo
        .filter((ref) => ref.startsWith('submittals/'))
        .map((ref) => ref.split('/')[1]);

      const rfiIds = allReferedTo
        .filter((ref) => ref.startsWith('rfi/'))
        .map((ref) => ref.split('/')[1]);

      if (submittalIds.length > 0) {
        dispatch(getSubmittalsDetails(submittalIds));
      }

      if (rfiIds.length > 0) {
        dispatch(getRfiDetails(rfiIds)); // new dispatch for RFI details
      }
    }
  }, [data, dispatch]);

  const rfiDetailList = useSelector((state) => state?.meetingMinutes?.rfiDetailsList);
  const submittalDetailList = useSelector((state) => state?.meetingMinutes?.detailsList);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNavigateRfi = (link) => {
    const url = `${paths.subscriber.meetingMinutes.referedItem}/rfi/${link}`;
     window.open(url, '_blank');
  };

  const handleNavigateSubmittal = (link) => {
    console.log(link);
    const url = `${paths.subscriber.meetingMinutes.referedItem}/submittals/${link}`;
     window.open(url, '_blank');
  };

 
  return (
    <div>
      {data.map((note, noteIndex) => (
        <Accordion
          key={noteIndex}
          expanded={expanded === `panel${noteIndex}`}
          onChange={handleChange(`panel${noteIndex}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${noteIndex}-content`}
            id={`panel${noteIndex}-header`}
          >
            <Stack direction="column">
              <Typography sx={{ fontSize: '16px', marginBottom: '0.7rem' }} fontWeight="bold">
                {note.subject}
              </Typography>
              <Stack direction="row" spacing={1}>
                {note.topics.map((topic, topicIndex) => (
                  <Chip
                    key={topicIndex}
                    label={topic.topic}
                    size="small"
                    sx={{
                      height: '40px',
                      backgroundColor: '#FFAB00',
                      minWidth: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      marginRight: '10px',
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {note.topics.map((topic, topicIndex) => (
              <TopicContainer key={topicIndex}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* <Stack direction="row" justifyContent="space-between"> */}
                    <Typography sx={{ fontSize: '16px' }} fontWeight="bold" marginBottom={3}>
                      {topic.topic}
                    </Typography>
                    {/* <Button
                        variant="contained"
                        onClick={() => handleNavigate(topic?.referedTo)}
                        sx={{ color: '#F2F3F5', background: '#3E3E3E', borderRadius: '8px' }}
                      >
                        View Related Item &nbsp;
                        <Iconify
                          icon="lucide:external-link"
                          color="#F2F3F5"
                          sx={{}}
                          height={14}
                          width={14}
                        />
                      </Button> */}
                    {/* </Stack> */}
                    <Typography sx={{ fontSize: '16px' }} fontWeight="bold" marginBottom={1}>
                      Description:
                    </Typography>
                    <Typography
                      sx={{ fontSize: '14px' }}
                      marginBottom={2}
                      dangerouslySetInnerHTML={{ __html: topic.description }}
                    />
                  </Grid>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '14px' }} fontWeight="bold" marginBottom={1}>
                        Due Date:
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        {new Date(topic.date).toLocaleDateString()}
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} fontWeight="bold" marginBottom={1}>
                        Status:
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        {topic?.status}
                      </Typography>

                      <Typography sx={{ fontSize: '14px' }} fontWeight="bold" marginBottom={1}>
                        Related Items:
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        <strong>
                          <u>Submittals</u>
                        </strong>
                        <ul>
                          {submittalDetailList?.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleNavigateSubmittal(item?._id)}
                            >
                              <p
                                style={{
                                  color: '#1976d2',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                [{item?.submittalId}] - {item?.name}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </Typography>

                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        <strong>
                          <u>RFIs</u>
                        </strong>
                        <ul>
                          {rfiDetailList?.map((item, index) => (
                            <li key={index} onClick={() => handleNavigateRfi(item?._id)}>
                              <p
                                style={{
                                  color: '#1976d2',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                [{item?.rfiId}] - {item?.name}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '14px' }} fontWeight="bold" marginBottom={1}>
                        Assignee:
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        {topic?.assignee?.name}
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} fontWeight="bold" marginBottom={1}>
                        Priority:
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }} marginBottom={2}>
                        {topic?.priority}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </TopicContainer>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

MeetingMinutesDetailsNotes.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      subject: PropTypes.string.isRequired,
      topics: PropTypes.arrayOf(
        PropTypes.shape({
          topic: PropTypes.string.isRequired,
          action: PropTypes.string,
          date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
          assignee: PropTypes.object,
          status: PropTypes.string,
          priority: PropTypes.string,
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default MeetingMinutesDetailsNotes;
