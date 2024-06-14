import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    ListItemText,
    Paper,
    Stack,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { addDays, isAfter, isTomorrow, parseISO } from 'date-fns';

//
import Scrollbar from 'src/components/scrollbar';
import { paths } from 'src/routes/paths';
import { fDateISO } from 'src/utils/format-time';
import { changeSubmittalStatus, getSubmittalDetails, resendToSubcontractor, submitSubmittalToArchitect } from 'src/redux/slices/submittalSlice';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { getStatusColor } from 'src/utils/constants';
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import { MultiFilePreview } from 'src/components/upload';
import { isIncluded } from 'src/utils/functions';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import SubmittalSendAllDialog from './rfi-response-dialog';

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
    '& .rfiTitle': {
        color: theme.palette.primary,
        flex: 0.15,
        flexBasis: '40px',
        borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        fontWeight: 'bold',
    },
    display: 'flex',
    borderRadius: '10px',
    padding: '1rem',
    gap: '1rem',
    ...(isSubcontractor && {
        maxHeight: 300,
    }),
}));
const RfiResponseDetails = ({ id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { id: parentSubmittalId } = params;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const currentUser = useSelector((state) => state.user?.user);
    const currentRfi = useSelector((state) => state.rfi.current);
    const sentToAllModal = useBoolean();
    const {
        isResponseSubmitted,
        response,
    } = currentRfi;


    useEffect(() => {
        console.log('currentRfi', currentRfi);
        console.log('OwnerList', currentRfi?.owner);
        console.log('currentUser:?._id', currentUser?._id);
        console.log('id', id);
    }, [currentRfi, id, currentUser]);


    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                {isResponseSubmitted && <Chip size='large' color='secondary' variant='outlined' sx={{
                    "&.MuiChip-root": {
                        "height": "50px",
                        "fontSize": "1rem",
                        "maxWidth": "max-content",
                        "width": "100%",
                        "paddingInline": ".75rem"
                    }
                }} label={response?.status} />}

            </Box>

            <Stack
                sx={{
                    mt: 3,
                    mb: 5,
                    gap: 2,
                }}
            >

                <StyledCard>
                    <Typography className="rfiTitle" sx={{ flex: ".2 !important", }}>Status</Typography>
                    <Chip size="medium" variant='outlined' label={response?.status} />
                </StyledCard>

                <StyledCard>
                    <Typography className="rfiTitle">Comment</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {response?.comment}
                    </Typography>
                </StyledCard>



                <StyledCard>
                    <Typography className="rfiTitle">Attachments</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>

                        {isResponseSubmitted && response?.attachments.length > 0 && <MultiFilePreview files={response?.attachments} thumbnail onDownload />}
                    </Box>
                </StyledCard>

            </Stack>

        </>
    );
};

export default RfiResponseDetails;

RfiResponseDetails.propTypes = {
    id: PropTypes.string,
};
