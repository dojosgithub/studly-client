import React, { useState } from 'react'

import { Avatar, Box, Card, Chip, Divider, ListItemText, Paper, Stack, Typography, alpha, styled } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import Scrollbar from 'src/components/scrollbar'
import { paths } from 'src/routes/paths'
import { fDateISO } from 'src/utils/format-time'


const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSubcontractor',
})(({ isSubcontractor, theme }) => ({
    "& .submittalTitle": {
        color: theme.palette.secondary.main, flex: .25,
        borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`
    },
    display: 'flex', borderRadius: "10px", padding: "1rem",
    gap: '1rem',
    ...(isSubcontractor && {
        maxHeight: 300
    }),

}));
const SubmittalsDetails = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { trade, submittalId, name, description, type, status, submittedDate, returnDate, creator, owner, attachments, ccList } = useSelector(state => state.submittal.current)
    const handleClick = () => {
        setIsSubmitting(!isSubmitting);
        setTimeout(() => (setIsSubmitting(false)), 3000);
    }

    return (
        <>
            <Stack
                sx={{
                    mt: 3,
                    mb: 5,
                    gap: 2
                }}
            >
                <StyledCard>
                    <Typography className='submittalTitle' >Trade</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{trade?.name}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Submittal ID</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{submittalId}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Name</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{name}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Description</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{description}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Type</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{type}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Status</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: .75, px: 2 }}>
                        <Chip size="medium" variant='contained' label={status} />
                        {/* {status?.length > 0 && status?.slice(0, 4).map((item) => (
                            <Chip key={item} size="small" variant='outlined' label={item} />
                        ))}
                        {status?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${status.length - 4} +`} />
                        )} */}
                    </Box>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Submitted Date</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{submittedDate && fDateISO(submittedDate)}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Requested Return Date</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{returnDate && fDateISO(returnDate)}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Creator</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{creator?.firstName}{" "}{creator?.lastName}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Attachments</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: .75, px: 2 }}>
                        {attachments?.length > 0 && attachments?.slice(0, 4).map((item) => (
                            <Avatar src={item?.preview} sx={{ width: 48, height: 48, mr: 2 }} />
                        ))}
                        {attachments?.length > 4 && (
                            <Chip size="small" variant='outlined' label={`${attachments.length - 4} +`} />
                        )}
                    </Box>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >Assignee / Owner</Typography>
                    <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: .75, px: 2 }}>{owner}</Typography>
                </StyledCard>
                <StyledCard>
                    <Typography className='submittalTitle' >CC List</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: .75, px: 2 }}>
                        {ccList?.length > 0 && ccList?.slice(0, 4).map((item) => (
                            <Chip key={item} size="small" color='primary' variant='outlined' label={item} />
                        ))}
                        {ccList?.length > 4 && (
                            <Chip size="small" variant='outlined' color='primary' label={`${ccList.length - 4} +`} />
                        )}
                    </Box>
                </StyledCard>

            </Stack>
            {status === "Draft" && <Box width="100%" display='flex' justifyContent='end'>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} onClick={handleClick}>
                    Submit to Architect
                </LoadingButton >
            </Box>}
        </>
    )
}

export default SubmittalsDetails