import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

// Styled Components
const TopicContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),  // Increased padding
  border: '1px solid #ddd',
  borderRadius: theme.shape.borderRadius,
}));

const Notes = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
            <Typography sx={{ fontSize: '1.6rem' }} fontWeight="bold">
              {note.subject}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {note.topics.map((topic, topicIndex) => (
              <TopicContainer key={topicIndex}>
                <div>
                  <Typography sx={{ fontSize: '1.4rem' }} fontWeight="bold" marginBottom={3}>
                    {topic.topic}
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                    Description:
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                    {topic.description}
                  </Typography>
                </div>
                <div>
                  <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                    Action:
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                    {topic.action}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                      Due Date:
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                      {new Date(topic.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                      Status:
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                      {topic.status}
                    </Typography>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                      Assignee:
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                      {topic.assignee}
                    </Typography>
                  </div>
                  <div>
                    <Typography sx={{ fontSize: '1.2rem' }} fontWeight="bold" marginBottom={1}>
                      Priority:
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem' }} marginBottom={2}>
                      {topic.priority}
                    </Typography>
                  </div>
                </div>
              </TopicContainer>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

Notes.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      subject: PropTypes.string.isRequired,
      topics: PropTypes.arrayOf(
        PropTypes.shape({
          topic: PropTypes.string.isRequired,
          action: PropTypes.string,
          date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
          assignee: PropTypes.string,
          status: PropTypes.string,
          priority: PropTypes.string,
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Notes;
