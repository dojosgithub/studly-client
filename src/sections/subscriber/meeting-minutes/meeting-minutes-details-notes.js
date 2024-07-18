import PropTypes from 'prop-types';
import React from 'react';
// @mui

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
 import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';



// ----------------------------------------------------------------------

const Notes = ({ data }) => (
  <div>
    {data.map((note, noteIndex) => (
      <Accordion key={noteIndex}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${noteIndex}-content`}
          id={`panel${noteIndex}-header`}
        >
          <Typography>{note.subject}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Topic</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {note.topics.map((topic, topicIndex) => (
                  <TableRow key={topicIndex}>
                    <TableCell>{topic.topic}</TableCell>
                    <TableCell>{topic.action}</TableCell>
                    <TableCell>{new Date(topic.date).toLocaleDateString()}</TableCell>
                    <TableCell>{topic.assignee}</TableCell>
                    <TableCell>{topic.status}</TableCell>
                    <TableCell>{topic.priority}</TableCell>
                    <TableCell>{topic.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    ))}
  </div>
);

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
