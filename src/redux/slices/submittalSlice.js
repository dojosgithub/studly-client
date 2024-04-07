import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import axiosInstance, { endpoints } from "src/utils/axios";


// * Submittal
export const createNewSubmittal = createAsyncThunk(
    'submittal/create',
    async (submittalData, { getState, rejectWithValue }) => {
        try {
            // const projectId = getState().project.current._id
            // console.log("projectId", projectId)
            // { ...submittalData, projectId }
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

export const editSubmittal = createAsyncThunk(
    'submittal/edit',
    async (submittalData, { getState, rejectWithValue }) => {
        try {

            const { id, formData } = submittalData;
            console.log("submittalId", id)
            console.log("formData", formData)

            const response = await axiosInstance.put(endpoints.submittal.edit(id), formData);

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
export const getSubmittalDetails = createAsyncThunk(
    'submittal/details',
    async (id, { getState, rejectWithValue }) => {
        try {

            console.log("submittalId", id)

            const response = await axiosInstance.get(endpoints.submittal.details(id));

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching submittal details.'
            );
        }
    },
)


export const getSubmittalList = createAsyncThunk(
    'submittal/list',
    async (listOptions, { getState, rejectWithValue }) => {
        try {
            const projectId = getState().project?.current?.id
            console.log("projectId", projectId)

            const { status, ...data } = listOptions
            console.log('status', status)
            console.log('data', data)
            // const projectId = getState().projectId.id
            const response = await axiosInstance.post(endpoints.submittal.list(projectId), { status }, {
                params: data
            });

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

export const submitSubmittalToArchitect = createAsyncThunk(
    'submittal/submitToArchitect',
    async (id, { getState, rejectWithValue }) => {
        try {

            console.log("submittalId", id)

            const response = await axiosInstance.post(endpoints.submittal.submit(id));

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching submittal details.'
            );
        }
    },
)
export const respondToSubmittalRequest = createAsyncThunk(
    'submittal/respondToSubmittalRequest',
    async (submittalData, { getState, rejectWithValue }) => {
        try {
            const { id, formData } = submittalData;
            console.log("formData", formData)
            console.log("submittalId", id)

            const response = await axiosInstance.post(endpoints.submittal.review(id),formData);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching submittal details.'
            );
        }
    },
)

const initialState = {
    list: [],
    create: {},
    current: {},
    isLoading: false,
    error: null
}

const submittal = createSlice({
    name: 'submittal',
    initialState,
    reducers: {
        setSubmittalList: (state, action) => {
            state.list = action.payload
        },
        setCurrentSubmittal: (state, action) => {
            state.current = action.payload
        },
        setCurrentSubmittalResponse: (state, action) => {
            state.current.response = action.payload
        },
        setCreateSubmittal: (state, action) => {
            state.create = action.payload
        },
    },
    extraReducers: (builder) => {
        // * Create New Submittal
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
        // * Edit Submittal
        builder.addCase(editSubmittal.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(editSubmittal.fulfilled, (state, action) => {
            state.create = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(editSubmittal.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
        // * Get Submittal List
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
        // Get Submittal Details
        builder.addCase(getSubmittalDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getSubmittalDetails.fulfilled, (state, action) => {
            state.current = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(getSubmittalDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
        builder.addCase(respondToSubmittalRequest.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(respondToSubmittalRequest.fulfilled, (state, action) => {
            state.current = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(respondToSubmittalRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
    }
})

export const { setSubmittal, setCurrentSubmittal,setCurrentSubmittalResponse, setCreateSubmittal } = submittal.actions
export default submittal.reducer