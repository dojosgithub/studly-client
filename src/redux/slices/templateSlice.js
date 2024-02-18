import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    current: {}
}

const template = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setTemplates: (state, action) => {
            state.list = action.payload
        },
        setCurrentTemplate: (state, action) => {
            state.current = action.payload
        },
    }
})

export const { setTemplates, setCurrentTemplate } = template.actions
export default template.reducer