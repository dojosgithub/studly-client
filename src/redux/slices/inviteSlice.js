import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { endpoints } from "src/utils/axios";

const initialState = {
    list: [],
    current: null,
    create: null,
    isLoading: false,
    error: null
}



export const getInviteDetails = createAsyncThunk(
    'invite/details',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(endpoints.invite.details(id));

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while fetching invite details.'
            );
        }
    },
)


export const sendInviteUserCredentials = createAsyncThunk(
    'invite/credentials',
    async (data, { rejectWithValue }) => {
        try {
            const { inviteId, ...rest } = data
            const params = { params: rest }
            const response = await axiosInstance.get(endpoints.invite.create(inviteId), params);

            return response.data.data
        } catch (err) {
            console.error("errSlice", err)
            if (err && err.message) {
                throw Error(
                    err.message
                );
            }
            throw Error(
                'An error occurred while accepting the invite.'
            );
        }
    },
)

// export const getTemplateList = createAsyncThunk(
//     'template/list',
//     async (_, { getState, rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.get(endpoints.template.list);

//             return response.data.data
//         } catch (err) {
//             console.error("errSlice", err)
//             if (err && err.message) {
//                 throw Error(
//                     err.message
//                 );
//             }
//             throw Error(
//                 'An error occurred while fetching template list.'
//             );
//         }
//     },
// )



const invite = createSlice({
    name: 'invite',
    initialState,
    reducers: {

        resetInvite: (state) => {
            // Keep the 'list' from the current state
            const currentList = state.list;

            // Reset the state to initialState
            Object.assign(state, initialState);

            // Restore 'list' to its current value before the reset
            state.list = currentList;
        },
        resetInviteState: () => initialState
    },
    extraReducers: (builder) => {
        // * Invite Details
        builder.addCase(getInviteDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getInviteDetails.fulfilled, (state, action) => {
            state.current = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(getInviteDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });

        // * send Invite User Credentials
        builder.addCase(sendInviteUserCredentials.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(sendInviteUserCredentials.fulfilled, (state, action) => {
            state.create = action.payload;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(sendInviteUserCredentials.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });

    }
})

export const { resetInvite, resetInviteState } = invite.actions
export default invite.reducer