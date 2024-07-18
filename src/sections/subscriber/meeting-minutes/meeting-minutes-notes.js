import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';

import { addDays, isTomorrow, startOfDay } from 'date-fns';

// @mui
import {
  IconButton,
  alpha,
  Box,
  Button,
  Stack,
  Typography,
  Card,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

// hook-form
import { RHFEditor, RHFTextField } from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import Iconify from 'src/components/iconify';

import MeetingMinutesDatePicker from './meeting-minutes-date-picker';


const StyledIconButton = styled(IconButton)(({ theme, top }) => ({
  width: 50,
  height: 50,
  opacity: 1,
  borderRadius: '100%',
  // outline: `1px solid ${alpha(theme.palette.grey[700], .2)} `,
  '&:hover': {
    opacity: 1,
    // outline: `1px solid ${alpha(theme.palette.grey[700], 1)} `,
  },
  position: 'absolute',
  top: top ? '-0.5rem' : '-1.25rem',
  right: top ? 0 : '-1.25rem',
  zIndex: 10,
}));




const MeetingMinutesNotes = () => {
  const inviteAttendee = useSelector(state => state.meetingMinutes.create.inviteAttendee);
  
  console.log('raahim',inviteAttendee);

  
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: 'notes',
  });

  

  // note
  const handleAddNote = useCallback(() => {
    appendNote({
      subject: '',
      topics: [{ topic: '', action: '', date: new Date(), description: '' }],
    });
  }, [appendNote]);

  const handleRemoveNote = (index) => {
    removeNote(index);
  };
 const formContext = useFormContext();
  

  return (
    
    <Box sx={{ marginBottom: '2rem', position: 'relative' }}>
      <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
        Meeting Notes
      </Typography>
      <Card
        variant="outlined"
        sx={{ padding: '1rem', border: 0, borderRadius: 0, boxShadow: 'none' }}
      >
        <Stack gap="1.5rem">
          {noteFields &&
            noteFields?.map((note, noteIndex) => (
              <Card variant="outlined" elevation={0}>
                <StyledIconButton color="inherit" onClick={() => handleRemoveNote(noteIndex)} top>
                  <Iconify icon="ion:close-circle" width="40px" height="40px" />
                </StyledIconButton>
                <Box key={note.id} sx={{ position: 'relative' }}>
                  <Stack gap={3} mx={2} my={3}>
                    <RHFTextField
                      name={`notes[${noteIndex}].subject`}
                      label="Subject"
                      InputLabelProps={{ shrink: true }}
                    />
                    <NestedTopicFieldArray control={control} noteIndex={noteIndex} note={note} />
                  </Stack>
                </Box>
              </Card>
            ))}
        </Stack>
        <Button
          component="button"
          variant="outlined"
          startIcon={<Iconify icon="mingcute:add-line" />}
          color="secondary"
          onClick={handleAddNote}
          sx={{ mt: 3 }}
        >
          Add Another Subject
        </Button>
      </Card>
    </Box>
  );
};

export default MeetingMinutesNotes;

const NestedTopicFieldArray = ({ control, noteIndex, note }) => {
  const inviteAttendee = useSelector(state => state.meetingMinutes.create.inviteAttendee);
  
  const dropdownOptions1 = inviteAttendee.map(attendee => ({
    value: attendee.email,  // Use a unique identifier for comparison
    label: attendee.name,
    attendee,  // Keep the full object for later use
  }));
  

const dropdownOptions2 = [
  { value: 'Open', label: 'Open' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Closed', label: 'Closed' },
];

const dropdownOptions3 = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `notes[${noteIndex}].topics`,
  });
  console.log('topicFields', topicFields);
  const handleAddTopic = () => {
    appendTopic({
      topic: '',
      action: '',
      date: new Date(),
      assignee: null,
      status: 'Open',
      priority: null,
      description: '',
      // _id: uuidv4(),
    });
  };

  return (
    <>
      {topicFields.map((topic, topicIndex) => (
        <Box key={topic?.id} sx={{ position: 'relative' }}>
          <StyledIconButton color="inherit" onClick={() => removeTopic(topicIndex)}>
            <Iconify icon="ion:close-circle" width="40px" height="40px" />
          </StyledIconButton>
          <Card
            variant="outlined"
            sx={{ px: 2, py: 3, display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(3, 1fr)',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <RHFTextField
                name={`notes[${noteIndex}].topics[${topicIndex}].topic`}
                label="Topic"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name={`notes[${noteIndex}].topics[${topicIndex}].action`}
                label="Action"
                InputLabelProps={{ shrink: true }}
              />
              <MeetingMinutesDatePicker
                name={`notes[${noteIndex}].topics[${topicIndex}].date`}
                label="Date"
              />
              

              {/* Dropdown 1 */}
              
<FormControl>
  <InputLabel>Assignee</InputLabel>
  <Controller
    name={`notes[${noteIndex}].topics[${topicIndex}].assignee`}
    control={control}
    defaultValue={null}
    render={({ field }) => (
      <Select
        {...field}
        label="Assignee"
        onChange={(event) => {
          const selectedEmail = event.target.value;
          const selectedAssignee = inviteAttendee.find(attendee => attendee.email === selectedEmail);
          field.onChange(selectedAssignee);
        }}
        value={field.value?.email || ''}
      >
        {dropdownOptions1.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    )}
  />
</FormControl>
              {/* Dropdown 2 */}
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Controller
                  name={`notes[${noteIndex}].topics[${topicIndex}].status`}
                  control={control}
                  defaultValue={dropdownOptions2[0].value} // Set the default value to the first option
                  render={({ field }) => (
                    <Select {...field} label="Status">
                      {dropdownOptions2.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              {/* Dropdown 3 */}
              <FormControl>
                <InputLabel>Priority</InputLabel>
                <Controller
                  name={`notes[${noteIndex}].topics[${topicIndex}].priority`}
                  control={control}
                  defaultValue="null"
                  render={({ field }) => (
                    <Select {...field} label="Priority">
                      {dropdownOptions3.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
            <RHFEditor
              simple
              name={`notes[${noteIndex}].topics[${topicIndex}].description`}
              id={`description-${topic.id}`}
              label="Description"
              InputLabelProps={{ shrink: true }}
            />
          </Card>
        </Box>
      ))}
      <Button
        component="button"
        variant="outlined"
        startIcon={<Iconify icon="mingcute:add-line" />}
        color="secondary"
        onClick={handleAddTopic}
        sx={{ maxWidth: 'fit-content' }}
      >
        Add Another Topic
      </Button>
    </>

  );
};

NestedTopicFieldArray.propTypes = {
  control: PropTypes.func,
  note: PropTypes.object,
  noteIndex: PropTypes.number,
};
