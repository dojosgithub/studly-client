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
import { getSubmittalDetails, submitSubmittalToArchitect } from 'src/redux/slices/submittalSlice';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { getStatusColor } from 'src/utils/constants';
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail/file-thumbnail';
import { MultiFilePreview } from 'src/components/upload';
import { isIncluded } from 'src/utils/functions';

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
    '& .submittalTitle': {
        color: theme.palette.primary,
        flex: 0.25,
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
const SubmittalsDetails = ({ id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { id: parentSubmittalId } = params;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const currentUser = useSelector((state) => state.user?.user);
    const currentSubmittal = useSelector((state) => state.submittal.current);

    const {
        isResponseSubmitted,
        trade,
        submittalId,
        name,
        description,
        type,
        status,
        submittedDate,
        returnDate,
        creator,
        owner,
        attachments,
        ccList,
    } = currentSubmittal;

    useEffect(() => {
        console.log('currentSubmittal', currentSubmittal);
        console.log('OwnerList', currentSubmittal?.owner);
        console.log('currentUser:?._id', currentUser?._id);
        console.log('id', id);
    }, [currentSubmittal, id, currentUser]);

    const handleSubmitToArchitect = async () => {
        console.log('SubmittalId', id);
        setIsSubmitting(true);
        const { error, payload } = await dispatch(submitSubmittalToArchitect(id));
        console.log('e-p', { error, payload });
        setIsSubmitting(false);
        if (!isEmpty(error)) {
            enqueueSnackbar(error.message, { variant: 'error' });
            return;
        }
        enqueueSnackbar('Submittal submitted to architect successfully', { variant: 'success' });
        await dispatch(getSubmittalDetails(id));
    };

    const handleSubmittalResponse = () => {
        console.log('handleSubmittalResponse', handleSubmittalResponse);
        navigate(paths.subscriber.submittals.review(id));
    };
    const handleViewResponse = () => {
        console.log('handleViewResponse');
        navigate(paths.subscriber.submittals.review(id));
    };

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Chip size='large' color='secondary' variant='outlined' sx={{
                    "&.MuiChip-root": {
                        "height": "50px",
                        "fontSize": "1rem",
                        "maxWidth": "max-content",
                        "width": "100%",
                        "paddingInline": ".75rem"
                    }
                }} label={status} />
                {status === 'Draft' &&
                    (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                        <Box width="100%" display="flex" justifyContent="end">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={isSubmitting}
                                onClick={handleSubmitToArchitect}
                            >
                                Submit for Review
                            </LoadingButton>
                        </Box>
                    )}
                {(status === 'Rejected (RJT)' || status === 'Make Corrections and Resubmit (MCNR)') &&
                    (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                        <Box width="100%" display="flex" justifyContent="end">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={isSubmitting}
                                onClick={() => {
                                    console.log("parentSubmittalId", parentSubmittalId)
                                    navigate(paths.subscriber.submittals.revision(parentSubmittalId))
                                }}
                            >
                                Create Revised Submittal
                            </LoadingButton>
                        </Box>
                    )}
            </Box>

            <Stack
                sx={{
                    mt: 3,
                    mb: 5,
                    gap: 2,
                }}
            >
                {/* // ? If General Contractor has submitted Submittal to the (Architect || Engineer || Sub Contractor) */}
                {status === 'Submitted' &&
                    (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                        <Alert severity="success">
                            Submittal is submitted to (architect/engineer/subcontractor). Is pending for review.
                        </Alert>
                    )}

                {/* // ? If (Architect || Engineer || Sub Contractor) has already submitted response for the submittal */}
                {/* (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ARC ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ENG ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.SCO)  */}
                {/* // * status === 'Submitted' */}
                {/* // ? Everyone can view it but only the assigned one can update the response */}
                {status !== 'Draft' &&
                    isResponseSubmitted &&
                    (isIncluded(currentSubmittal?.owner, currentUser?._id)) && (
                        <Alert
                            severity="warning"
                            sx={{
                                gap: '.5rem',
                                alignItems: 'center',
                                '& .MuiAlert-message': { display: 'flex', alignItems: 'center', width: '100%' },
                            }}
                        >
                            (architect/engineer/subcontractor name) already submitted a response to this
                            submittal.
                            <Box display="flex" flex={1} gap={1} mr={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={handleViewResponse}>
                                    View Response
                                </Button>
                                <Button>Dismiss</Button>
                            </Box>
                        </Alert>
                    )}


                {/* (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ARC ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ENG ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.SCO) */}
                {/* // ? If Submittal Response is not submitted by (Architect || Engineer || Sub Contractor) */}
                {!isResponseSubmitted &&
                    status === 'Submitted' &&
                    (isIncluded(currentSubmittal?.owner, currentUser?._id))
                    && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={handleSubmittalResponse}>
                                Add Submittal Response
                            </Button>
                        </Box>
                    )}
                {/* (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ARC ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.ENG ||
                        currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.SCO) */}
                {/* // ? If Submittal Response is submitted by (Architect || Engineer || Sub Contractor) */}
                {isResponseSubmitted &&
                    (isIncluded(currentSubmittal?.owner, currentUser?._id)) && (
                        <Alert severity="success">
                            Your response to the submittal was submitted. Thankyou!
                        </Alert>
                    )}

                <StyledCard>
                    <Typography className="submittalTitle">Trade</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {trade?.name}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Submittal ID</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {submittalId}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Name</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {name}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Description</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {description}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Type</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {type}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Status</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                        {/* <Chip size="medium" variant='soft' label={status} color={getStatusColor(status)} /> */}
                        <Label color={getStatusColor(status)} variant="soft">
                            {status}
                        </Label>
                        {/* // color={
                            //   (status === 'joined' && 'success') ||
                            //   (status === 'invited' && 'info') ||
                            //   (status === 'pending' && 'warning') ||
                            //   (status === 'banned' && 'error') ||
                            //   'default'
                            // } */}
                        {/* {status?.length > 0 && status?.slice(0, 4).map((item) => (
                            <Chip key={item} size="small" variant='outlined' label={item} />
                        ))}
                        {status?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${status.length - 4} +`} />
                        )} */}
                    </Box>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Submitted Date</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {submittedDate && fDateISO(submittedDate)}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Requested Return Date</Typography>
                    <Typography
                        sx={{
                            color: (theme) => (isTomorrow(parseISO(returnDate)) ? 'red' : theme.palette.primary),
                            flex: 0.75,
                            px: 2,
                        }}
                    >
                        {returnDate && fDateISO(returnDate)}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Creator</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {creator?.firstName} {creator?.lastName}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Attachments</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                        {/* {attachments?.length > 0 && attachments?.slice(0, 4).map((item) => (
                            <Avatar src={item?.preview} sx={{ width: 48, height: 48, mr: 2 }} />
                        ))}
                        {attachments?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${attachments.length - 4} +`} />
                        )} */}
                        {/* {attachments?.length > 0 &&
              attachments.map((item) => (
                <FileThumbnail
                //   onDownload
                  tooltip
                  imageView
                  file={item}
                  sx={{ position: 'absolute' }}
                  imgSx={{ position: 'absolute', width: 100 }}
                />
              ))} */}
                        <MultiFilePreview files={attachments} thumbnail onDownload />
                    </Box>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">Assignee / Owner</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary, flex: 0.75, px: 2 }}>
                        {owner?.length > 0 && owner.map((item, index) => (
                            <span key={index}>{item?.firstName} {item?.lastName}{index < owner.length - 1 ? ', ' : ''}</span>
                        ))}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className="submittalTitle">CC List</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.75, px: 2 }}>
                        {ccList?.length > 0 &&
                            ccList
                                ?.slice(0, 4)
                                .map((item) => (
                                    <Chip key={item} size="small" color="secondary" variant="outlined" label={item} />
                                ))}
                        {ccList?.length > 4 && (
                            <Chip
                                size="small"
                                variant="outlined"
                                color="secondary"
                                label={`${ccList.length - 4} +`}
                            />
                        )}
                    </Box>
                </StyledCard>
            </Stack>
        </>
    );
};

export default SubmittalsDetails;

SubmittalsDetails.propTypes = {
    id: PropTypes.string,
};
