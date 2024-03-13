import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { endpoints } from "src/utils/axios";


// * Submittal
export const createNewSubmittal = createAsyncThunk(
    'submittal/create',
    async (submittalData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(endpoints.submittal.create, submittalData);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while creating the submittal.'
            );
        }
    },
)

export const getSubmittalList = createAsyncThunk(
    'submittal/list',
    async (_, { getState, rejectWithValue }) => {
        try {
            const projectId = getState().project.current._id
            console.log("projectId", projectId)
            const fullURL=`${endpoints.submittal.list}/${projectId}`
            const response = await axiosInstance.get(fullURL);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching submittal list.'
            );
        }
    },
)

const initialState = {
    list: [],
    create: {},
    isLoading: false,
    error: null
}

const submittal = createSlice({
    name: 'submittal',
    initialState,
    reducers: {
        setSubmittal: (state, action) => {
            state.list = action.payload
        },
        setCurrentSubmittal: (state, action) => {
            state.current = action.payload
        },
        setCreateSubmittal: (state, action) => {
            state.current = action.payload
        },
    },
    extraReducers: (builder) => {
        // * Create New Project
        builder.addCase(createNewSubmittal.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNewSubmittal.fulfilled, (state, action) => {
            state.create = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(createNewSubmittal.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
        builder.addCase(getSubmittalList.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getSubmittalList.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(getSubmittalList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
    }
})

export const { setSubmittal, setCurrentSubmittal, setCreateSubmittal } = submittal.actions
export default submittal.reducer