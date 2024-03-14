import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
//
import { useFormContext } from 'react-hook-form';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function SubmittalAttachments({
    //
    onCreate,
    onUpdate,
    //
    files,
    setFiles,
    //
    ...other
}) {
    
    // useEffect(() => {
    //     setFiles([]);
    // }, [setFiles]);

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            setFiles([...files, ...newFiles]);
        },
        [files, setFiles]
    );

  

    const handleRemoveFile = (inputFile) => {
        const filtered = files.filter((file) => file !== inputFile);
        setFiles(filtered);

    };

    const handleRemoveAllFiles = () => {
        setFiles([]);

    };

    return (
        <Box>


            <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />

           
            {!!files.length && (
                <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
                    Remove all
                </Button>
            )}

           
        </Box>
    );
}

SubmittalAttachments.propTypes = {
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    files: PropTypes.array,
    setFiles: PropTypes.func
};
