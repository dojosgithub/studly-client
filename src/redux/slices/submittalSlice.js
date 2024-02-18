import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    current: {}
}

const submittals = createSlice({
    name: 'submittals',
    initialState,
    reducers: {
        setSubmittals: (state, action) => {
            state.list = action.payload
        },
        setCurrentSubmittal: (state, action) => {
            state.current = action.payload
        },
    }
})

export const { setSubmittals, setCurrentSubmittal } = submittals.actions
export default submittals.reducer