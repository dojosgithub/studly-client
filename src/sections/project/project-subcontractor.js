import React, { useEffect, useMemo, useState } from 'react'
import { Box, Container, Divider, MenuItem, Stack, Typography, Select, Card } from '@mui/material'
import { isEmpty } from 'lodash'
import { useFormContext } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { PROJECT_SUBCONTRACTORS } from 'src/_mock'
import CustomAutoComplete from 'src/components/custom-automcomplete'
import { setMembers, setProjectTrades } from 'src/redux/slices/projectSlice'
import Iconify from 'src/components/iconify'
import ProjectInviteSubcontractorDialog from './project-invite-subcontractor-dialog'

const ProjectSubcontractor = () => {
    // const [subcontractors, setSubcontractors] = useState(PROJECT_SUBCONTRACTORS || [])
    const { getValues, setValue } = useFormContext();
    // const { trades } = getValues()
    const [open, setOpen] = useState(false)
    // GET Subcontractor list in Company
    const subcontractorsList = useSelector(state => state.project?.subcontractors?.list?.company)
    const subcontractorsInvitedList = useSelector(state => state.project?.subcontractors?.invited)
    const subcontractors = useMemo(() => [...subcontractorsList, ...subcontractorsInvitedList], [subcontractorsList, subcontractorsInvitedList]);
    const trades = useSelector(state => state.project.create.trades)
    const initialOptions = trades.reduce((acc, { tradeId, }) => {
        acc[tradeId] = { tradeId, subcontractorId: "", email: "" };
        return acc;
    }, {});

    const [options, setOptions] = useState(initialOptions)
    const [assignedSubcontractors, setAssignedSubcontractors] = useState([])
    const dispatch = useDispatch()


    useEffect(() => {
        console.log('subcontractor', subcontractors);
        console.log('options', options);

    }, [subcontractors, options, trades])

    const handleSelect = (tradeId, email) => {
        // console.log('subcontractorId', subcontractorId)
        if (email === "create") {
            setOpen(true)
            return
        }
        console.log('email', email)
        // const { email } = subcontractorObj
        // const hasEmailAndId = 'email' in subcontractorObj && 'id' in subcontractorObj;

        // TODO ADD EXISTING SUBCONTRACTOR


        // const data = { email }
        // if there is an id of subcontractor
        // if (hasEmailAndId) {
        //     data.subcontractorId = subcontractorObj.id
        // }
        console.log('handleSelect', email);

        const modifiedTrades = trades.map(trade => {
            if (trade.tradeId === tradeId) {
                // return { ...trade, subcontractorId };
                return { ...trade, email };
            }
            return trade;
        });
        console.log('modifiedTrades', modifiedTrades)
        setValue('trades', modifiedTrades)
        dispatch(setProjectTrades(modifiedTrades))
        // const filteredSubcontractor = subcontractors.filter(sub =>sub.email===email);
        // console.log('filteredSubcontractor', filteredSubcontractor)
        // dispatch(setMembers(filteredSubcontractor[0]))

        // // setOptions((prevOptions) => (
        // //     {
        // //         ...prevOptions,
        // //         [tradeId]: {
        // //             ...data
        // //         }
        // //     }
        // // ))

        // // set options both unique 
        // // setOptions(prevOptions => {
        // //     const tradeIds = Object.keys(prevOptions);

        // //     if (tradeIds.length === 0) {
        // //         // // If options object is empty, add a new entry with provided tradeId and subcontractorId
        // //         return { [tradeId]: { tradeId, subcontractorId } };
        // //     }

        // //     const tradeIndex = tradeIds.findIndex(id => prevOptions[id].subcontractorId === subcontractorId);

        // //     if (tradeIndex === -1) {
        // //         // // If trade does not exist with provided subcontractorId, add a new entry with provided tradeId and subcontractorId
        // //         return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
        // //     }

        // //     if (tradeIds[tradeIndex] === tradeId) {
        // //         // // If trade exists and tradeId matches, update its subcontractorId
        // //         return { ...prevOptions, [tradeId]: { ...prevOptions[tradeId], subcontractorId } };
        // //     }

        // //     return prevOptions;
        // // });

        // ? set options

        setOptions(prevOptions => {
            const tradeIds = Object.keys(prevOptions);

            // Check if the options object is empty or if the tradeId is not present in prevOptions
            if (tradeIds.length === 0 || !prevOptions[tradeId]) {
                // If options object is empty or tradeId is not present, add a new entry with provided tradeId and subcontractorId
                // return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
                return { ...prevOptions, [tradeId]: { tradeId, email } };
            }

            // Check if there's already an option with the same tradeId
            const existingTradeIndex = tradeIds.findIndex(id => prevOptions[id].tradeId === tradeId);

            if (existingTradeIndex !== -1) {
                // If an option with the same tradeId exists, update its subcontractorId
                const updatedOptions = { ...prevOptions };
                // updatedOptions[tradeId].subcontractorId = subcontractorId;
                updatedOptions[tradeId].email = email;
                return updatedOptions;
            }

            // If no option with the same tradeId exists, add a new option with provided tradeId and subcontractorId
            // return { ...prevOptions, [tradeId]: { tradeId, subcontractorId } };
            return { ...prevOptions, [tradeId]: { tradeId, email } };
        });





        // ? set assigned subcontractors
        setAssignedSubcontractors(prevTrades => {
            // Check if the trades array is empty
            if (prevTrades.length === 0) {
                // If it's empty, add a new trade with provided tradeId and subcontractorId
                // return [{ tradeId, subcontractorId }];
                return [{ tradeId, email }];
            }

            // Check if there's already a trade with the same tradeId
            const existingTradeIndex = prevTrades.findIndex(trade => trade.tradeId === tradeId);

            if (existingTradeIndex !== -1) {
                // If a trade with the same tradeId exists, update its subcontractorId
                const updatedTrades = [...prevTrades];
                // updatedTrades[existingTradeIndex].subcontractorId = subcontractorId;
                updatedTrades[existingTradeIndex].email = email;
                return updatedTrades;
            }

            // If trade does not exist with the same tradeId, add a new trade
            // return [...prevTrades, { tradeId, subcontractorId }];
            return [...prevTrades, { tradeId, email }];
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

    const handleAddNew = () => {
        setOpen(true)
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
                        trades?.map(({ tradeId, name }) => (
                            <Card sx={{ maxWidth: '500px', width: '100%', p: '1rem', display: 'flex', alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                                <Typography>{name}</Typography>
                                <Box width='100%' maxWidth="200px">
                                    <Select onChange={(e) => handleSelect(tradeId, e.target.value)} name={tradeId} value={options[tradeId].email} label="" placeholder="Choose Subcontractor" sx={{
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
                                        {subcontractors?.length > 0 && subcontractors?.map((sub) => (
                                            <MenuItem key={sub.email} value={sub.email} sx={{ height: 50, px: 3, borderRadius: 0 }}>
                                                {/* {sub.name.toUpperCase()} */}
                                                {sub.firstName.toUpperCase()}
                                                {sub.lastName.toUpperCase()}
                                            </MenuItem>
                                        ))}
                                        {/* {(subcontractors?.length === 0) && (
                                            //  onClick={handleAddNew}
                                            <MenuItem sx={{ height: 50, px: 3, borderRadius: 0 }} value="" onClick={() => setOpen(true)}>
                                                Add New Subcontractor
                                            </MenuItem>
                                        )} */}
                                        <Divider sx={{  background: 'grey' }} />
                                        <MenuItem sx={{ height: 50, px: 3, borderRadius: 0 }} value="create" onClick={() => setOpen(true)}>
                                            <Iconify
                                                icon='material-symbols:add-circle-outline'
                                                width={20}
                                                sx={{ mr: 1 }}
                                            /> Invite subcontractor
                                        </MenuItem>
                                    </Select>
                                </Box>
                            </Card>
                        )
                        )
                    }
                </Stack>


                {(open) && (
                    <ProjectInviteSubcontractorDialog
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                )}
            </Container>
        </>
    )
}

export default ProjectSubcontractor