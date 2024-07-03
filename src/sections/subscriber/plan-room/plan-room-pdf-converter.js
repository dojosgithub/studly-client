import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { capitalCase } from 'change-case';

import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, concat } from 'lodash';
import { alpha, useTheme } from '@mui/material/styles';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { fabric } from 'fabric';
import 'pdfjs-dist/build/pdf.worker.entry';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import {
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
  createFilterOptions,
} from '@mui/material';
// utils
import { fDate } from 'src/utils/format-time';
// components
import CustomImage from 'src/components/image';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

const categoryOptions = [
  { id: 1, name: 'Loading' },
  { id: 2, name: 'Unloading' },
  { id: 3, name: 'Drive' },
  { id: 4, name: 'Full Service (Standard)' },
  { id: 5, name: 'Piano' },
  { id: 6, name: 'Hot Tub' },
  { id: 7, name: 'Long Distance' },
];
function PlanRoomPdfConverter({ files }) {
  const [images, setImages] = useState([]);
  const canvasRef = useRef(null);
  const isLoadingRef = useRef(null);

  const { setValue, control } = useFormContext();
  const theme = useTheme();
  const filter = createFilterOptions();

  const renderAndExtractPage = useCallback(async (arrayBuffer, pageNumber) => {
    const pageImage = await renderPage(arrayBuffer, pageNumber);
    const { fullPage, corner } = await extractCorner(pageImage);
    return { fullPage, corner };
  }, []);
  const handleUpload = useCallback(
    async (event) => {
      // const files = Array.from(event.target.files);

      if (files.length === 0) {
        return; // Exit early if there are no files
      }

      const allPageImages = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const numPages = pdfDoc.getPageCount();

          const pageImages = await Promise.all(
            Array.from({ length: numPages }, (_, i) => renderAndExtractPage(arrayBuffer, i + 1))
          );

          return pageImages;
        })
      );

      // Flatten the array of arrays
      const flattenedPageImages = allPageImages.flat();
      isLoadingRef.current = false;
      setImages(flattenedPageImages);
    },
    [files, renderAndExtractPage]
  );

  // const handleUpload = useCallback(
  //     async (event) => {
  //         // const file = event.target.files[0];
  //         if (files.length <= 0) {
  //             return;
  //         }
  //         const file = files[0];
  //         if (file) {
  //             const arrayBuffer = await file.arrayBuffer();
  //             const pdfDoc = await PDFDocument.load(arrayBuffer);

  //             const numPages = pdfDoc.getPageCount();
  //             const pageImages = await Promise.all(
  //                 Array.from({ length: numPages }, (_, i) => i + 1).map(async (pageNumber) => {
  //                     const page = await renderPage(arrayBuffer, pageNumber);
  //                     const { fullPage, corner } = await extractCorner(page);
  //                     return { fullPage, corner };
  //                 })
  //             );

  //             setImages(pageImages);
  //         }
  //     },
  //     [files]
  // );

  const renderPage = async (pdfData, pageNumber) => {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');

    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL('image/png');
  };

  const extractCorner = async (imageDataUrl) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = imageDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const fullPage = canvas.toDataURL('image/png');

        const cornerCanvas = document.createElement('canvas');
        const width = img.width / 4;
        const height = img.height / 4;
        cornerCanvas.width = width;
        cornerCanvas.height = height;
        const cornerContext = cornerCanvas.getContext('2d');
        cornerContext.drawImage(img, -img.width * 0.75, -img.height * 0.75);

        const corner = cornerCanvas.toDataURL('image/png');
        resolve({ fullPage, corner });
      };
    });

  useEffect(() => {
    isLoadingRef.current = true;
    handleUpload();
  }, [handleUpload]);

  console.log('fiels', files);
  if (images?.length <= 0 || isLoadingRef?.current) {
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
          key={image.fullPage}
          my={5}
        >
          {/* <CustomImage
                        alt={`Full page ${index + 1}`}
                        src={image.fullPage}
                    /> */}
          <Box p={4}>
            <CustomImage
              alt={`Corner of page ${index + 1}`}
              // ratio="1/1"
              src={image.corner}
            />
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
                  options={categoryOptions}
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
                        key={option.id}
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
          {setValue(`sheets[${index}].src`, image.fullPage)}
        </Box>
      ))}
    </>
  );
}

export default PlanRoomPdfConverter;

PlanRoomPdfConverter.propTypes = {
  files: PropTypes.arrayOf(PropTypes.file),
};
