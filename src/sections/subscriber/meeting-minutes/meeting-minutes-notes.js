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
  Autocomplete,
  TextField,
  lighten,
  darken,
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

const MeetingMinutesNotes = (listData, inviteAttendee) => {
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
      topics: [
        {
          topic: '',
          date: new Date(),
          description: '',
          status: 'Open',
          priority: 'Low',
          referedTo: [],
          // dueDate: null,
        },
      ],
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
                    <NestedTopicFieldArray
                      control={control}
                      noteIndex={noteIndex}
                      note={note}
                      submittalAndRfiList={listData}
                      inviteAttendee={inviteAttendee}
                    />
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

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles('dark', {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const NestedTopicFieldArray = ({ control, noteIndex, note, submittalAndRfiList }) => {
  const inviteAttendee = useSelector((state) => state.meetingMinutes.create.inviteAttendee);

  const dropdownOptions1 = (inviteAttendee ?? [])?.map((attendee) => ({
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

  const options = Object.entries(submittalAndRfiList?.listData).flatMap(([group, items]) =>
    Array.isArray(items) ? items.map((item) => ({ ...item, group })) : []
  );

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
      date: new Date(),
      // dueDate: null,
      assignee: null,
      status: 'Open',
      priority: 'Low',
      description: '',
      referedTo: [],
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
                label="Due Date"
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

              {/* <MeetingMinutesDatePicker
                name={`notes[${noteIndex}].topics[${topicIndex}].dueDate`}
                label="Due Date"
              /> */}
              {/* <FormControl>
                
                <Controller
                  name={`notes[${noteIndex}].topics[${topicIndex}].referedTo`}
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Autocomplete
                      options={options || ''}
                      groupBy={(option) => option?.group}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        const id = option.submittalId || option.rfiId || 'No ID';
                        return `[${id}] - ${option.name}`;
                      }}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      onChange={(_, value) => field.onChange(value?._id || null)}
                      value={options.find((opt) => opt?._id === field?.value) || null}
                      renderInput={(params) => <TextField {...params} label="Related Submittals/RFIs" />}
                      renderGroup={(params) => (
                        <li key={params?.key}>
                          <GroupHeader sx={{color:"black"}}>{params?.group}</GroupHeader>
                          <GroupItems>{params?.children}</GroupItems>
                        </li>
                      )}
                    />
                  )}
                />
              </FormControl> */}

              <FormControl>
                <Controller
                  name={`notes[${noteIndex}].topics[${topicIndex}].referedTo`}
                  control={control}
                  defaultValue={[]} // For multiple selection
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={options || []}
                      groupBy={(option) => option?.group}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        const id = option.submittalId || option.rfiId || 'No ID';
                        return `[${id}] - ${option.name}`;
                      }}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      onChange={(_, selectedOptions) =>
                        field.onChange(selectedOptions.map((opt) => opt._id))
                      }
                      value={options.filter((opt) => field?.value?.includes(opt._id)) || []}
                      renderInput={(params) => (
                        <TextField {...params} label="Related Submittals/RFIs" />
                      )}
                      renderGroup={(params) => (
                        <li key={params?.key}>
                          <GroupHeader sx={{ color: 'black' }}>{params?.group}</GroupHeader>
                          <GroupItems>{params?.children}</GroupItems>
                        </li>
                      )}
                    />
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
  submittalAndRfiList: PropTypes.object,
  inviteAttendee: PropTypes.array,
};
