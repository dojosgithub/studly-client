import { Box, Container, Divider, MenuItem, Stack, Typography, Select, Card } from '@mui/material'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { PROJECT_SUBCONTRACTORS } from 'src/_mock'
import { setProjectTrades } from 'src/redux/slices/projectSlice'

const ProjectSubcontractor = () => {
    // const [subcontractors, setSubcontractors] = useState(PROJECT_SUBCONTRACTORS || [])
    const { getValues, setValue } = useFormContext();
    // const { trades } = getValues()
    const subcontractors = useSelector(state => state.project.subcontractors.list)
    const trades = useSelector(state => state.project.create.trades)
    const initialOptions = trades.reduce((acc, { tradeId, }) => {
        acc[tradeId] = { tradeId, subcontractorId: "" };
        return acc;
    }, {});

    const [options, setOptions] = useState(initialOptions)
    const [assignedSubcontractors, setAssignedSubcontractors] = useState([])
    const dispatch = useDispatch()
    // console.log('options', options);
    // console.log('subcontractors', subcontractors);
    // console.log('trades', trades);
    // console.log('assignedSubcontractors', assignedSubcontractors);



    const handleSelect = (tradeId, subcontractorId) => {
        const data = { tradeId, subcontractorId }
        console.log('handleSelect', data);

        const modifiedTrades = trades.map(trade => {
            if (trade.tradeId === tradeId) {
                return { ...trade, subcontractorId };
            }
            return trade;
        });

        console.log('modifiedTrades', modifiedTrades)
        setValue('trades', modifiedTrades)
        dispatch(setProjectTrades(modifiedTrades))

        // setOptions((prevOptions) => (
        //     {
        //         ...prevOptions,
        //         [tradeId]: {
        //             ...data
        //         }
        //     }
        // ))

        // set options both unique 
        // setOptions(prevOptions => {
        //     const tradeIds = Object.keys(prevOptions);

        //     if (tradeIds.length === 0) {
        //         // If options object is empty, add a new entry with provided tradeId and subcontractorId
        //         return { [tradeId]: { tradeId, subcontractorId } };
        //     }

        //     const tradeIndex = tradeIds.findIndex(id => prevOptions[id].subcontractorId === subcontractorId);

        //     if (tradeIndex === -1) {
        //         // If trade does not exist with provided subcontractorId, add a new entry with provided tradeId and subcontractorId
        //         return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
        //     }

        //     if (tradeIds[tradeIndex] === tradeId) {
        //         // If trade exists and tradeId matches, update its subcontractorId
        //         return { ...prevOptions, [tradeId]: { ...prevOptions[tradeId], subcontractorId } };
        //     }

        //     return prevOptions;
        // });

        // ? set options

        setOptions(prevOptions => {
            const tradeIds = Object.keys(prevOptions);

            // Check if the options object is empty or if the tradeId is not present in prevOptions
            if (tradeIds.length === 0 || !prevOptions[tradeId]) {
                // If options object is empty or tradeId is not present, add a new entry with provided tradeId and subcontractorId
                return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
            }

            // Check if there's already an option with the same tradeId
            const existingTradeIndex = tradeIds.findIndex(id => prevOptions[id].tradeId === tradeId);

            if (existingTradeIndex !== -1) {
                // If an option with the same tradeId exists, update its subcontractorId
                const updatedOptions = { ...prevOptions };
                updatedOptions[tradeId].subcontractorId = subcontractorId;
                return updatedOptions;
            }

            // If no option with the same tradeId exists, add a new option with provided tradeId and subcontractorId
            return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
        });





        // ? set assigned subcontractors
        setAssignedSubcontractors(prevTrades => {
            // Check if the trades array is empty
            if (prevTrades.length === 0) {
                // If it's empty, add a new trade with provided tradeId and subcontractorId
                return [{ tradeId, subcontractorId }];
            }

            // Check if there's already a trade with the same tradeId
            const existingTradeIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId);

            if (existingTradeIndex !== -1) {
                // If a trade with the same tradeId exists, update its subcontractorId
                const updatedTrades = [...prevTrades];
                updatedTrades[existingTradeIndex].subcontractorId = subcontractorId;
                return updatedTrades;
            }

            // If trade does not exist with the same tradeId, add a new trade
            return [...prevTrades, { tradeId, subcontractorId }];
        });


        //  multiple
        // setAssignedSubcontractors(prevTrades => {
        //     // Check if the trades array is empty
        //     if (prevTrades.length === 0) {
        //         // If it's empty, add a new trade with provided tradeId and subcontractorId
        //         return [{ tradeId, subcontractorId }];
        //     }

        //     // Check if there's already a trade with the same tradeId and subcontractorId
        //     const existingTradeIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId && trade.subcontractorId === subcontractorId);

        //     // Check if there's already a trade with the same tradeId but a different subcontractorId
        //     const tradeWithSameTradeIdIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId && trade.subcontractorId !== subcontractorId);
        //     // if not then update

        //     // Check if there's already a trade with the same subcontractorId but a different tradeId
        //     const tradeWithSameSubcontractorIdIndex = prevTrades.findIndex(trade => trade.tradeId !== tradeId && trade.subcontractorId === subcontractorId);

        //     if (existingTradeIndex !== -1) {
        //         // If a trade with the same tradeId and subcontractorId exists, update its subcontractorId
        //         const updatedTrades = [...prevTrades];
        //         updatedTrades[existingTradeIndex].subcontractorId = subcontractorId;
        //         return updatedTrades;
        //     }

        //     if (tradeWithSameTradeIdIndex !== -1 || tradeWithSameSubcontractorIdIndex !== -1) {
        //         // If there's already a trade with the same tradeId or the same subcontractorId assigned to a different tradeId, do not add a new trade
        //         return prevTrades;
        //     }

        //     // If trade does not exist with the same tradeId and subcontractorId, add a new trade
        //     return [...prevTrades, { tradeId, subcontractorId }];
        // });

        // one tradeId == one subcontractorId

        // setAssignedSubcontractors(prevTrades => {

        //     console.log("prevTrades",prevTrades)
        //     // Check if the trades array is empty
        //     if (prevTrades.length === 0) {
        //         // If it's empty, add a new trade with provided tradeId and subcontractorId
        //         return [{ tradeId, subcontractorId }];
        //     }

        //     // Check if there's already a trade with the same tradeId and subcontractorId
        //     const existingTradeIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId && trade.subcontractorId === subcontractorId);

        //     // Check if there's already a trade with the same tradeId but a different subcontractorId
        //     const tradeWithSameTradeIdIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId && trade.subcontractorId !== subcontractorId);
        //     console.log("tradeWithSameTradeIdIndex",tradeWithSameTradeIdIndex)
        //     // if not then update

        //     // Check if there's already a trade with the same subcontractorId but a different tradeId
        //     const tradeWithSameSubcontractorIdIndex = prevTrades.findIndex(trade => trade.tradeId !== tradeId && trade.subcontractorId === subcontractorId);

        //     if (existingTradeIndex !== -1) {
        //         // If a trade with the same tradeId and subcontractorId exists, update its subcontractorId
        //         const updatedTrades = [...prevTrades];
        //         updatedTrades[existingTradeIndex].subcontractorId = subcontractorId;
        //         return updatedTrades;
        //     }


        //     if (tradeWithSameTradeIdIndex !== -1 || tradeWithSameSubcontractorIdIndex !== -1) {
        //         // If there's already a trade with the same tradeId or the same subcontractorId assigned to a different tradeId, do not add a new trade
        //         return prevTrades;
        //     }

        //     // If trade does not exist with the same tradeId and subcontractorId, add a new trade
        //     return [...prevTrades, { tradeId, subcontractorId }];
        // });
    }


    return (
        <>
            <Typography sx={{ my: 2, }} fontSize='1.5rem' fontWeight='bold'>Assign Subcontractor</Typography>
            <Divider sx={{ mb: 5 }} />
            <Container>
                <Stack rowGap={5} alignItems='center'>
                    <Box sx={{ maxWidth: '500px', width: '100%', pb: '1rem', borderBottom: (theme) => `2px solid ${theme.palette.secondary.main}`, display: 'flex', alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: (theme) => theme.palette.secondary.main }}>Trade </Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: (theme) => theme.palette.secondary.main }}>Subcontractor</Typography>

                    </Box>
                    {
                        trades.map(({ tradeId, name }) => (
                            <Card sx={{ maxWidth: '500px', width: '100%', p: '1rem', display: 'flex', alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                                <Typography>{name}</Typography>
                                <Box width='100%' maxWidth="200px">
                                    <Select onChange={(e) => handleSelect(tradeId, e.target.value)} name={tradeId} value={options[tradeId].subcontractorId} label="" placeholder="Choose Subcontractor" sx={{
                                        width: '100%',
                                        // "&.MuiInputBase-root ": {
                                        //     borderBottomRightRadius: 0,
                                        //     borderBottomLeftRadius: 0,
                                        // },
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
                            </Card>
                        )
                        )
                    }
                </Stack>


            </Container>
        </>
    )
}

export default ProjectSubcontractor