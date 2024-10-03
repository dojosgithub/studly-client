import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';

// @mui
import {
  IconButton,
  Box,
  Button,
  Stack,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

// hook-form
import { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
//
import Iconify from 'src/components/iconify';

import MeetingMinutesDatePicker from './meeting-minutes-date-picker';

const StyledIconButton = styled(IconButton)(({ theme, top }) => ({
  width: 50,
  height: 50,
  opacity: 1,
  borderRadius: '100%',
  '&:hover': {
    opacity: 1,
  },
  position: 'absolute',
  top: top ? '-0.5rem' : '-1.25rem',
  right: top ? 0 : '-1.25rem',
  zIndex: 10,
}));

const MeetingMinutesNotes = () => {
  const { control } = useFormContext();

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
      topics: [{ topic: '', date: null, description: '', status: 'Open', priority: 'Low' }],
    });
  }, [appendNote]);

  const handleRemoveNote = (index) => {
    removeNote(index);
  };

  return (
    <Box sx={{ marginBottom: '2rem', position: 'relative' }}>
      <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
        Meeting Agenda
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
                <Box key={note._id} sx={{ position: 'relative' }}>
                  <Stack gap={3} mx={2} my={3}>
                    <RHFTextField
                      name={`notes[${noteIndex}].subject`}
                      label="Section"
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
          Add Another Section
        </Button>
      </Card>
    </Box>
  );
};

export default MeetingMinutesNotes;

const NestedTopicFieldArray = ({ control, noteIndex, note }) => {
  const inviteAttendee = useSelector((state) => state.meetingMinutes.create.inviteAttendee);

  const dropdownOptions1 = inviteAttendee.map((attendee) => ({
    ...attendee, // Keep the full object for later use
    value: attendee.email, // Use a unique identifier for comparison
    label: attendee.name,
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
  const handleAddTopic = () => {
    appendTopic({
      topic: '',
      date: null,
      assignee: null,
      status: 'Open',
      priority: 'Low',
      description: '',
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
                gridTemplateColumns: { md: 'repeat(3, 1fr)' },
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <RHFTextField
                name={`notes[${noteIndex}].topics[${topicIndex}].topic`}
                label="Topic"
                InputLabelProps={{ shrink: true }}
              />

              <MeetingMinutesDatePicker
                name={`notes[${noteIndex}].topics[${topicIndex}].date`}
                label="Date"
              />

              {/* Dropdown 1 */}

              <FormControl>
                <Controller
                  name={`notes[${noteIndex}].topics[${topicIndex}].assignee`}
                  control={control}
                  render={({ field }) => (
                    <RHFSelect
                      {...field}
                      name={`notes[${noteIndex}].topics[${topicIndex}].assignee`}
                      label="Assignee"
                      control={control}
                      defaultValue="" // Set default value to an empty string or null
                      value={field.value?.name || ''}
                    >
                      {dropdownOptions1.map((option) => (
                        <MenuItem key={option.value} value={option}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
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
