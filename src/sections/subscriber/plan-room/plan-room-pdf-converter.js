import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';
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
// utils
import { fDate } from 'src/utils/format-time';
// components
import CustomImage from 'src/components/image';
import Iconify from 'src/components/iconify';
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';


function PlanRoomPdfConverter({ files }) {
    const [images, setImages] = useState([]);
    const canvasRef = useRef(null);

    const { setValue } = useFormContext()
    const theme = useTheme();


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
                        Array.from({ length: numPages }, (_, i) =>
                            renderAndExtractPage(arrayBuffer, i + 1)
                        )
                    );

                    return pageImages;
                })
            );

            // Flatten the array of arrays
            const flattenedPageImages = allPageImages.flat();

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

    const extractCorner = async (imageDataUrl) => (
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
        }))

    useEffect(() => {
        handleUpload()
    }, [handleUpload])


    console.log('fiels', files)
    return (
        <>
            {images.map((image, index) => (
                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(3, 1fr)',
                    }}
                    alignItems="center"
                    key={image.fullPage}
                    my={5}
                >

                    <CustomImage
                        alt={`Full page ${index + 1}`}
                        src={image.fullPage}
                    />
                    <Box p={4}>
                        <CustomImage
                            alt={`Corner of page ${index + 1}`}
                            // ratio="1/1"
                            src={image.corner}
                        />
                    </Box>
                    <RHFTextField name={`sheets[${index}].title`} label="Sheet Title" InputLabelProps={{ shrink: true }} />
                    {setValue(`sheets[${index}].url`, image.fullPage)}
                </Box>
            ))}

        </>
    );
}

export default PlanRoomPdfConverter;


PlanRoomPdfConverter.propTypes = {
    files: PropTypes.arrayOf(PropTypes.file),
}