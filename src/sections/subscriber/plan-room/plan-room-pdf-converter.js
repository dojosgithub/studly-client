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
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
  createFilterOptions,
} from '@mui/material';
// components
import CustomImage from 'src/components/image';
import { RHFTextField } from 'src/components/hook-form';
import { getPlanRoomPDFSThumbnails } from 'src/redux/slices/planRoomSlice';

function PlanRoomPdfConverter({ files }) {
  const [images, setImages] = useState([]);
  const [sheets, setSheets] = useState([]);

  const isLoadingRef = useRef(null);
  const dispatch = useDispatch();

  const { setValue, control } = useFormContext();

  const filter = createFilterOptions();
  const planRoomCategories = useSelector((state) => state.project.current.planRoomCategories);

  const handleUpload = useCallback(async () => {
    const formData = new FormData();
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (file instanceof File) {
        formData.append('files', file);
      }
    }
    const data = await dispatch(getPlanRoomPDFSThumbnails({ data: formData }));
    if (data.payload) {
      setImages(data.payload.thumbails);
      setValue('attachments', data.payload.files);
      setSheets(data.payload.sheets);
    }

    isLoadingRef.current = false;
  }, [dispatch, files, setValue]);

  useEffect(() => {
    isLoadingRef.current = true;
    handleUpload();
  }, [handleUpload]);

  if (sheets?.length <= 0 || images?.length <= 0 || isLoadingRef?.current) {
    return (
      <Box sx={{ display: 'grid', placeContent: 'center', width: '100%', height: '100%' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (
    <>
      {images.map((image, index) => (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          alignItems="center"
          key={index}
          my={5}
        >
          <Box p={4}>
            <CustomImage sx={{ width: 300 }} alt={`Corner of page ${index + 1}`} src={image} />
          </Box>
          <span>
            <RHFTextField
              name={`sheets[${index}].title`}
              label="Sheet Title"
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
          </span>
          {setValue(`sheets[${index}].src`, sheets[index])}
        </Box>
      ))}
    </>
  );
}

export default PlanRoomPdfConverter;

PlanRoomPdfConverter.propTypes = {
  files: PropTypes.arrayOf(PropTypes.file),
};
