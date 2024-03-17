import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { endpoints } from "src/utils/axios";

const initialState = {
    list: [], // PROJECT_TEMPLATES
    create: { name: '', trades: [] },
    current: null,
    selectedTemplate: '',
    isNewTemplate: false,
    isDefaultTemplate: false,
    isTemplateNameAdded: false,
    isLoading: false,
    error: null
}



export const createNewTemplate = createAsyncThunk(
    'template/create',
    async (templateData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(endpoints.template.create, templateData);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while creating the template.'
            );
        }
    },
)

export const getTemplateList = createAsyncThunk(
    'template/list',
    async (_, { getState, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(endpoints.template.list);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching template list.'
            );
        }
    },
)



const template = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setTemplates: (state, action) => {
            state.list = action.payload
        },
        setCreateTemplate: (state, action) => {
            state.create = action.payload
        },
        setCurrentTemplate: (state, action) => {
            state.current = action.payload
        },
        setSelectedTemplate: (state, action) => {
            state.selectedTemplate = action.payload
        },
        setIsNewTemplate: (state, action) => {
            state.isNewTemplate = action.payload
        },
        setIsTemplateNameAdded: (state, action) => {
            state.isTemplateNameAdded = action.payload
        },
        setIsDefaultTemplate: (state, action) => {
            state.isDefaultTemplate = action.payload
        },
        resetTemplate: (state) => {
            // Keep the 'list' from the current state
            const currentList = state.list;

            // Reset the state to initialState
            Object.assign(state, initialState);

            // Restore 'list' to its current value before the reset
            state.list = currentList;
        }
    },
    extraReducers: (builder) => {
        // * Create New Project
        builder.addCase(createNewTemplate.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNewTemplate.fulfilled, (state, action) => {
            // const index = state.list?.findIndex(item => item?._id === action?.payload?._id);

            // if (index !== -1) {
            //   // If a project with the same _id exists, replace it
            //   state.list[index] = action.payload;
            // } else {
            //   // Otherwise, add the new project to the list
            //   state.list = [...state.list, action.payload];
            // }
            state.current = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(createNewTemplate.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
        builder.addCase(getTemplateList.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getTemplateList.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(getTemplateList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
    }
})

export const { setTemplates, setCreateTemplate, setCurrentTemplate, setSelectedTemplate, setIsNewTemplate, setIsTemplateNameAdded, setIsDefaultTemplate, resetTemplate } = template.actions
export default template.reducer