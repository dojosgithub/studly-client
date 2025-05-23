import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Chip, Stack, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';

// Styled Components
const TopicContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),
  border: '1px solid #ddd',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#F2F3F5',
}));

const MeetingMinutesDetailsNotes = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
   const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNavigate = (link) => {
    navigate(paths.subscriber.meetingMinutes.referedTo(link));
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
                    <Typography sx={{ fontSize: '16px' }} fontWeight="bold" marginBottom={3}>
                      {topic.topic}
                    </Typography>
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
                        Refered to:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          cursor: 'pointer',
                          color: 'blue',
                          textDecoration: 'underline',
                        }}
                        marginBottom={2}
                        onClick={() => handleNavigate(topic?.referedTo)}
                      >
                        {`${process.env.REACT_APP_FRONTEND_URL}/subscriber/${topic?.referedTo}`}
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
