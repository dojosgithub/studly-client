import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { endpoints } from "src/utils/axios";

const initialState = {
    list: [], // PROJECT_WORKFLOWS
    create: {
        name: '',
        statuses: [],
        returnDate: ""
    },
    current: null,
    selectedWorkflow: '',
    isNewWorkflow: false,
    // isDefaultWorkflow: false,
    // isWorkflowNameAdded: false,
    isLoading: false,
    error: null
}



export const createNewWorkflow = createAsyncThunk(
    'workflow/create',
    async (workflowData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(endpoints.workflow.create, workflowData);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while creating the workflow.'
            );
        }
    },
)

export const getWorkflowList = createAsyncThunk(
    'workflow/list',
    async (_, { getState, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(endpoints.workflow.list);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching workflow list.'
            );
        }
    },
)



const workflow = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        setWorkflowList: (state, action) => {
            state.list = action.payload
        },
        setCreateWorkflow: (state, action) => {
            state.create = action.payload
        },
        setCurrentWorkflow: (state, action) => {
            state.current = action.payload
        },
        setSelectedWorkflow: (state, action) => {
            state.selectedWorkflow = action.payload
        },
        setIsNewWorkflow: (state, action) => {
            state.isNewWorkflow = action.payload
        },
        resetWorkflow: (state) => {
            // Keep the 'list' from the current state
            const currentList = state.list;

            // Reset the state to initialState
            Object.assign(state, initialState);

            // Restore 'list' to its current value before the reset
            state.list = currentList;
        },
        resetWorkflowState: () => initialState,

    },
    extraReducers: (builder) => {
        // * Create New Project
        builder.addCase(createNewWorkflow.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNewWorkflow.fulfilled, (state, action) => {
            state.current = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(createNewWorkflow.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
        builder.addCase(getWorkflowList.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getWorkflowList.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(getWorkflowList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
    }
})

export const { setWorkflowList, setCreateWorkflow, setCurrentWorkflow, resetWorkflow, setSelectedWorkflow, setIsNewWorkflow, resetWorkflowState } = workflow.actions
export default workflow.reducer