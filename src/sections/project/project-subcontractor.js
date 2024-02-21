import { Box, Container, Divider, MenuItem, Stack, Typography, Select } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PROJECT_SUBCONTRACTORS } from 'src/_mock'

const ProjectSubcontractor = () => {
    // const [subcontractors, setSubcontractors] = useState(PROJECT_SUBCONTRACTORS || [])
    const subcontractors = useSelector(state => state.project.subcontractors.list)
    const trades = useSelector(state => state.project.create.trades)
    const initialOptions = trades.reduce((acc, { tradeId, }) => {
        acc[tradeId] = { tradeId, subcontractorId: "" };
        return acc;
    }, {});

    const [options, setOptions] = useState(initialOptions)
    const [assignedSubcontractors, setAssignedSubcontractors] = useState([])
    const dispatch = useDispatch()
    console.log('options', options);
    console.log('subcontractors', subcontractors);
    console.log('trades', trades);
    console.log('assignedSubcontractors', assignedSubcontractors);
    const handleSelect = (tradeId, subcontractorId) => {
        const data = { tradeId, subcontractorId }
        console.log('handleSelect', data);
        setOptions((prevOptions) => (
            {
                ...prevOptions,
                [tradeId]: {
                    ...data
                }
            }
        ))
        setAssignedSubcontractors(prevTrades => {
            if (prevTrades.length === 0) {
                // If trades array is empty, add a new trade with provided tradeId and subcontractorId
                return [{ tradeId, subcontractorId }];
            }
            const tradeIndex = prevTrades.findIndex(trade => trade.subcontractorId === subcontractorId);
            if (tradeIndex === -1) {
                // If trade doesnot exists and tradeId doesnot matches add new trade
                return [...prevTrades, { tradeId, subcontractorId }];
            }
            if (tradeIndex !== -1 && tradeId === prevTrades[tradeIndex].tradeId) {
                // If trade exists and tradeId matches, update its subcontractorId
                const updatedTrades = [...prevTrades];
                updatedTrades[tradeIndex] = { ...updatedTrades[tradeIndex], subcontractorId };
                return updatedTrades;
            }
            return prevTrades;
        });

        // mult
    }


    return (
        <>
            <Typography sx={{ my: 2, }} fontSize='1.5rem' fontWeight='bold'>Assign Subcontractor</Typography>
            <Divider sx={{ mb: 2 }} />
            <Container>
                <Stack>
                    {
                        trades.map(({ tradeId, name }) => (
                            <Box sx={{ display: 'flex', alignItems: "center", gap: 4, justifyContent: "space-between" }}>
                                {/* name={`${tradeId}`} value={options[tradeId].subcontractorId} */}
                                <Typography>{name}</Typography>
                                <Select onChange={(e) => handleSelect(tradeId, e.target.value)} name={tradeId} value={options[tradeId].subcontractorId} label="Choose Subcontractor" placeholder="Choose Subcontractor" sx={{
                                    width: '100%',
                                    "& .MuiSelect-select": {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }
                                }}>
                                    {subcontractors.map((sub) => (
                                        <MenuItem key={sub._id} value={sub._id} sx={{ height: 50, px: 3, borderRadius: 0 }}>
                                            {sub.name.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        )
                        )
                    }

                </Stack>

            </Container>
        </>
    )
}

export default ProjectSubcontractor