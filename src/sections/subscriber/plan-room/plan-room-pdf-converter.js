import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { capitalCase } from 'change-case';
import { useDispatch, useSelector } from 'react-redux';

import 'pdfjs-dist/build/pdf.worker.entry';
// @mui
import Box from '@mui/material/Box';
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
// components
import CustomImage from 'src/components/image';
import { RHFTextField } from 'src/components/hook-form';
import {
  getExtractedSheetsText,
  getPlanRoomPDFSThumbnails,
  newSheets,
} from 'src/redux/slices/planRoomSlice';
import { useBoolean } from 'src/hooks/use-boolean';

function PlanRoomPdfConverter({ files, isDisabled }) {
  const sheetsData = useSelector((state) => state?.planRoom?.sheets);
  const sheetsLoaded = useSelector((state) => state?.planRoom?.sheetsLoaded);
  const [sheets, setSheets] = useState(sheetsData); // Local state for sheets
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();
  const { setValue, control, getValues } = useFormContext();
  const sheetsForm = getValues('sheets');

  const isLoadingRef = useRef(null);
  const isLoadingAutofill = useBoolean(false);

  // Synchronize local sheets state with sheetsData from Redux
  useEffect(() => {
    setSheets(sheetsData);
    setValue('sheets', sheetsData);
    console.log('sheetsData', sheetsData);
    console.log('sheetsForm', sheetsForm);
    // eslint-disable-next-line
  }, [sheetsData]);

  const filter = createFilterOptions();
  const planRoomCategories = useSelector((state) => state.project.current.planRoomCategories);

  const handleUpload = useCallback(async () => {
    isDisabled.onTrue();
    const formData = new FormData();
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (file instanceof File) {
        formData.append('files', file);
      }
    }
    const data = await dispatch(getPlanRoomPDFSThumbnails({ data: formData }));
    if (data.payload) {
      const sheetData = data.payload.sheets.map((src) => ({
        src,
        sheetTitle: '',
        sheetNumber: '',
        category: [],
        isLoading: false,
      }));
      console.log('sheetDataUp', sheetData);
      setValue('attachments', data.payload.files);
      setImages(data.payload.thumbails);
      setSheets(sheetData);
      dispatch(newSheets(sheetData));
    }

    isLoadingRef.current = false;
    isDisabled.onFalse();
  }, [dispatch, files, setValue, isDisabled]);

  useEffect(() => {
    isLoadingRef.current = true;
    if (isLoadingRef.current) {
      handleUpload();
    }
    // eslint-disable-next-line
  }, []);

  const handleAutofill = async () => {
    isDisabled.onTrue();
    isLoadingAutofill.onTrue();
    const updatedSheets = sheetsData.map((sheet) => ({
      ...sheet,
      isLoading: true, // Update isLoading to true
    }));
    console.log('updatedSheets', updatedSheets);
    dispatch(newSheets(updatedSheets));
    setValue('sheets', updatedSheets);
    const { payload } = await dispatch(getExtractedSheetsText({ imageUrls: images }));

    if (payload) {
      const data = await payload;
      // const sheetData = [...payload].map(({ id, ...rest }) => ({
      //   ...rest,
      //   src: '',
      //   category: [],
      // }));
      console.log('sheetData', data);
      setValue('sheets', data);
    }
    isDisabled.onFalse();
    isLoadingAutofill.onFalse();
  };

  if (!sheets || sheets.length === 0 || isLoadingRef.current) {
    return (
      <Box sx={{ display: 'grid', placeContent: 'center', width: '100%', height: '100%' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (
    <>
      <Box sx={{ display: 'grid', placeContent: 'end', width: '100%', height: '100%', my: 2 }}>
        <Button variant="contained" onClick={handleAutofill} disabled={isLoadingAutofill.value}>
          Extract Title / Number
        </Button>
      </Box>
      {isLoadingAutofill.value && (
        <Alert variant="outlined" severity="success" icon={false}>
          Processing... ({sheetsLoaded} / {sheets?.length})
        </Alert>
      )}
      {sheets.map((data, index) => (
        <Card
          key={index}
          sx={{
            display: { xs: 'flex', md: 'grid' },
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: '.7fr 1.5fr .7fr' },
            my: 5,
            p: { xs: '3rem 2rem', md: '0 1rem' },
          }}
        >
          <Typography>{data.src?.name}</Typography>

          <Box p={4} display="flex" minWidth="max-content" gap={2}>
            <CustomImage
              sx={{ width: 120, '& img': { objectFit: 'contain !important' } }}
              alt={`Corner of page ${index + 1}`}
              src={data.src?.thumbnail}
            />
            <CustomImage
              sx={{ width: 200 }}
              alt={`Corner of page ${index + 1}`}
              src={data.src?.croppedThumbnail}
            />
          </Box>
          {data.isLoading && (
            <Box sx={{ display: 'grid', placeContent: 'center', width: '100%', height: '100%' }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          {!data.isLoading && (
            <Box width={1}>
              <RHFTextField
                name={`sheets[${index}].sheetTitle`}
                label="Title"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <RHFTextField
                name={`sheets[${index}].sheetNumber`}
                label="Number"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <Controller
                name={`sheets[${index}].category`}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    fullWidth
                    multiple
                    freeSolo
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    onChange={(event, newValue) => {
                      if (typeof newValue[newValue.length - 1] === 'string') {
                        const newValueObj = {
                          id: nanoid(),
                          name: capitalCase(newValue[newValue.length - 1]),
                        };
                        newValue[newValue.length - 1] = newValueObj;
                        field.onChange(newValue);
                      } else {
                        field.onChange(newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                      );
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          name: inputValue,
                          id: nanoid(),
                          inputValue: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    options={planRoomCategories}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.name;
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, i) => (
                        <Chip
                          {...getTagProps({ i })}
                          key={option._id}
                          size="small"
                          label={option.name}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField label="Tags" {...params} />}
                  />
                )}
              />
            </Box>
          )}
          {setValue(`sheets[${index}].src`, data.src)}
        </Card>
      ))}
    </>
  );
}

export default PlanRoomPdfConverter;

PlanRoomPdfConverter.propTypes = {
  files: PropTypes.arrayOf(PropTypes.file),
  isDisabled: PropTypes.object,
};
