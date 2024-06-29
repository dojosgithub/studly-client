import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import React, { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays, isTomorrow, startOfDay } from 'date-fns';

// @mui 
import { IconButton, alpha, Box, Button, Stack, Typography, Card, Divider } from '@mui/material'


// hook-form 
import {
    RHFEditor,
    RHFTextField,
} from 'src/components/hook-form';
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
    position: "absolute",
    top: top ? '-0.5rem' : '-1.25rem',
    right: top ? 0 : '-1.25rem',
    zIndex: 10,
}));


const MeetingMinutesNotes = () => {

    const { control, setValue, getValues, watch, resetField } = useFormContext();
    const { notes } = getValues()
    const { fields: noteFields, append: appendNote, remove: removeNote } = useFieldArray({
        control,
        name: 'notes',
    });
    console.log('notes',notes)

    // note
    const handleAddNote = useCallback(() => {
        appendNote({
            subject: '',
            topics: [{
                topic: '',
                action: '',
                date: new Date(),
                description: '',
                // _id: uuidv4(),
            }],
            // _id: uuidv4(),
        });
    }, [appendNote]);

    const handleRemoveNote = (index) => {
        removeNote(index);
    };


    // ? OLD
    // const handleAdd = useCallback(() => {
    //     append({
    //         subject: '',
    //         topics: [{
    //             topic: '',
    //             action: '',
    //             date: new Date(),
    //             description: '',
    //             _id: uuidv4(),
    //         }],
    //         _id: uuidv4(),
    //     });
    // }, [append]);

    // useEffect(() => {
    //     const handleKeyPress = (event) => {
    //         if (event.key === 'Tab') {
    //             console.log('Tab key pressed');

    //             handleAdd();
    //         }
    //     };

    //     document.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, [handleAdd]);




    // const handleRemove = (index) => {
    //     remove(index);
    // };

    // const handleClearService = useCallback(
    //     (index) => {
    //         resetField(`notes[${index}].subject`);
    //         resetField(`notes[${index}].topic`);
    //         resetField(`notes[${index}].action`);
    //         resetField(`notes[${index}].date`);
    //         resetField(`notes[${index}].description`);
    //     },
    //     [resetField]
    // );





    return (
        // <>
        <Box sx={{ marginBottom: '2rem', position: "relative", }}>
            <Typography sx={{ mt: 2, mb: 4 }} fontSize='1.5rem' fontWeight='bold'>Meeting Notes</Typography>
            <Card variant="outlined" sx={{ padding: '1rem', border: 0, borderRadius: 0, boxShadow: 'none' }}>

                <Stack gap='1.5rem'>
                    {noteFields && noteFields?.map((note, noteIndex) => (
                        <Card variant='outlined' elevation={0} >
                            <StyledIconButton color="inherit" onClick={() => handleRemoveNote(noteIndex)} top>
                                <Iconify icon='ion:close-circle' width='40px' height='40px' />
                            </StyledIconButton>
                            <Box key={note.id} sx={{ position: "relative", }}>

                                <Stack gap={3} mx={2} my={3}>
                                    <RHFTextField name={`notes[${noteIndex}].subject`} label="Subject" InputLabelProps={{ shrink: true }} />
                                    <NestedTopicFieldArray
                                        control={control}
                                        noteIndex={noteIndex}
                                        note={note}
                                    />


                                </Stack>
                            </Box>

                        </Card>
                    ))}

                </Stack>

                <Button
                    component='button'
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    color='secondary'
                    onClick={handleAddNote}
                    sx={{ mt: 3 }}
                >
                    Add Another Subject
                </Button>
            </Card>
        </Box>

        // </>
    )
}

export default MeetingMinutesNotes


const NestedTopicFieldArray = ({ control, noteIndex, note }) => {
    const { fields: topicFields, append: appendTopic, remove: removeTopic } = useFieldArray({
        control,
        name: `notes[${noteIndex}].topics`,
    });
console.log('topicFields',topicFields)
    const handleAddTopic = () => {
        appendTopic({
            topic: '',
            action: '',
            date: new Date(),
            description: '',
            _id: uuidv4(),
        });
    };

    return (
        <>
            {topicFields.map((topic, topicIndex) => (
                <Box key={topic?.id} sx={{ position: 'relative' }}>
                    <StyledIconButton color="inherit" onClick={() => removeTopic(topicIndex)}>
                        <Iconify icon='ion:close-circle' width='40px' height='40px' />
                    </StyledIconButton>
                    <Card variant='outlined' sx={{ px: 2, py: 3, display: 'flex', flexDirection: "column", gap: '1rem' }}>
                        <Box
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <RHFTextField name={`notes[${noteIndex}].topics[${topicIndex}].topic`} label="Topic" InputLabelProps={{ shrink: true }} />
                            <RHFTextField name={`notes[${noteIndex}].topics[${topicIndex}].action`} label="Action" InputLabelProps={{ shrink: true }} />
                            <MeetingMinutesDatePicker name={`notes[${noteIndex}].topics[${topicIndex}].date`} label='Date' />
                            {/* <Controller
                                                name={`notes[${index}].date`}
                                                control={control}
                                                defaultValue={new Date()}
                                                render={({ field, fieldState: { error } }) => {
                                                    const selectedDate = field.value || null;
                                                    const isDateNextDay = selectedDate && isTomorrow(selectedDate);
                                                    const dateStyle = isDateNextDay
                                                        ? {
                                                            '.MuiInputBase-root.MuiOutlinedInput-root': {
                                                                color: 'red',
                                                                borderColor: 'red',
                                                                border: '1px solid',
                                                            },
                                                        }
                                                        : {};
                                                    console.log(isDateNextDay);
                                                    return (
                                                        <DatePicker
                                                            label="Date"
                                                            views={['day']}
                                                            value={selectedDate}
                                                            minDate={startOfDay(addDays(new Date(), 1))}
                                                            onChange={(date) => field.onChange(date)}
                                                            format="MM/dd/yyyy" // Specify the desired date format
                                                            error={!!error}
                                                            helperText={error && error?.message}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    error: !!error,
                                                                    helperText: error?.message,
                                                                },
                                                            }}
                                                        // sx={dateStyle} // Apply conditional style based on the date comparison
                                                        />
                                                    );
                                                }}
                                            /> */}

                        </Box>
                        {/* <RHFTextField name={`notes[${noteIndex}].topics[${topicIndex}].description`} label="Description" InputLabelProps={{ shrink: true }} /> */}

                        <RHFEditor simple name={`notes[${noteIndex}].topics[${topicIndex}].description`} id={`description-${topic.id}`} label="Description" InputLabelProps={{ shrink: true }} />
                    </Card>
                </Box>
            ))}
            <Button
                component='button'
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color='secondary'
                onClick={handleAddTopic}
                sx={{ maxWidth: "fit-content" }}
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