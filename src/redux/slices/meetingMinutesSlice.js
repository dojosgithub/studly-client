import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Meeting Minutes
export const createMeetingMinutes = createAsyncThunk(
  'meetingMinutes/create',
  async (meetingMinutesData, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.meetingMinutes.create, meetingMinutesData);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the plan.');
    }
  }
);
export const getMeetingMinutesList = createAsyncThunk(
  'meetingMinutes/list',
  async (listOptions, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?.id;
      console.log('projectId', projectId);

      const { status, ...data } = listOptions;
      console.log('status', status);
      console.log('data', data);
      // const projectId = getState().projectId.id
      const response = await axiosInstance.post(
        endpoints.meetingMinutes.list(projectId),
        { status },
        {
          params: data,
        }
      );

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching rfi list.');
    }
  }
);
export const MeetingMinutes = createAsyncThunk(
  'meetingMinutesSheet/delete',
  async ({ projectId, meetingMinutesId, sheetId }, { getState, rejectWithValue }) => {
    try {
      console.log('ids', { projectId, meetingMinutesId, sheetId });
      const response = await axiosInstance.delete(endpoints.meetingMinutes.delete(projectId, meetingMinutesId, sheetId));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while deleting planroom sheet.');
    }
  }
);

// export const submitPlanRoomToArchitect = createAsyncThunk(
//   'rfi/submitToArchitect',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       console.log('rfiId', id);

//       const response = await axiosInstance.post(endpoints.rfi.submit(id));

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while submitting rfi for review.');
//     }
//   }
// );

// export const editPlanRoom = createAsyncThunk(
//   'rfi/edit',
//   async (rfiData, { getState, rejectWithValue }) => {
//     try {
//       const { id, formData } = rfiData;
//       console.log('rfiId', id);
//       console.log('formData', formData);

//       const response = await axiosInstance.put(endpoints.rfi.edit(id), formData);

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while updating the rfi.');
//     }
//   }
// );


// export const deletePlanRoom = createAsyncThunk(
//   'rfi/delete',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       console.log('rfiId', id);
//       const response = await axiosInstance.delete(endpoints.rfi.delete(id));

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while creating the rfi.');
//     }
//   }
// );
// export const getPlanRoomDetails = createAsyncThunk(
//   'submittal/details',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       console.log('submittalId', id);

//       const response = await axiosInstance.get(endpoints.rfi.details(id));

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while fetching submittal details.');
//     }
//   }
// );

// export const submitPlanRoomResponse = createAsyncThunk(
//   'rfi/response',
//   async (rfiData, { getState, rejectWithValue }) => {
//     try {
//       const { id, formData } = rfiData;
//       console.log('rfiId', id);
//       console.log('formData', formData);

//       const response = await axiosInstance.put(endpoints.rfi.response(id), formData);

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while submitting RFI response.');
//     }
//   }
// );


// export const getRFILogPDF = createAsyncThunk(
//   'rfi/pdf',
//   async (exptype, { getState, rejectWithValue }) => {
//     try {
//       const projectId = getState().project?.current?.id;
//       console.log('projectId', projectId);

//       const response = await axiosInstance.get(endpoints.rfi.pdf(projectId, exptype), {
//         responseType: 'blob',
//       });

//       const buffer = response.data;
//       console.log('buffer', response.data);

//       const blob = new Blob([buffer], { type: exptype === 'pdf' ? 'application/pdf' : 'text/csv' });
//       console.log('blob', blob);
//       const url = URL.createObjectURL(blob);

//       // Create a temporary link and trigger a download
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'rfi_logs';
//       a.click();

//       // Cleanup
//       URL.revokeObjectURL(url);

//       return response.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while fetching submittal list.');
//     }
//   }
// );

const inviteAttendeeInitialState={
  name: '',
  company: '',
  email: '',
  attended: false,
  // _id: uuidv4(),
}
const topicInitialState={
  topic: '',
  action: '',
  date: null,
  description: '',
  // _id: uuidv4(),
}
const noteInitialState={
  subject: '',
  topics: [{...topicInitialState}],
  // _id: uuidv4(),
}
const permitInitialState={
  status: '',
  date: null,
  permitNumber: '',
  // _id: uuidv4(),
}
const planTrackingInitialState={
  planTracking: '',
  stampDate: null,
  dateRecieved: null,
  // _id: uuidv4(),
}
const meetingMinutesInitialState = {
  description: {
    meetingNumber: '',
    name: '',
    title: '',
    site: '',
    date: null,
    time: '',
    minutesBy: '',
    conferenceCall: '',
    meetingID: '',
    url: '',
  },
  inviteAttendee: [{...inviteAttendeeInitialState}],
  notes: [{...noteInitialState}],
  permit: [{...permitInitialState}],
  plan: [{...planTrackingInitialState}],
  projectId: '', // Assuming you want a unique ID
  company: '', // Assuming you want a unique ID
}

const initialState = {
  list: [],
  create: {...meetingMinutesInitialState},
  current: {},
  isLoading: false,
  error: null,
};

const meetingMinutes = createSlice({
  name: 'meetingMinutes',
  initialState,
  reducers: {
    setMeetingMinutesList: (state, action) => {
      // state.list = action.payload;
      state.list = [...state.list, action.payload];
    },
    setCurrentMeetingMinutes: (state, action) => {
      state.current = action.payload;
    },
    setCreateMeetingMinutes: (state, action) => {
      state.create = action.payload;
    },
    setMeetingMinutesDescription: (state, action) => {
      state.create.description = action.payload
    },
    setMeetingMinutesInviteAttendee: (state, action) => {
      state.create.inviteAttendee = action.payload
    },
    setMeetingMinutesNotes: (state, action) => {
      state.create.notes = action.payload
    },
    setMeetingMinutesPermit: (state, action) => {
      state.create.permit = action.payload
    },
    setMeetingMinutesPlanTracking: (state, action) => {
      state.create.plan = action.payload
    },
    
    resetMeetingMinutesCreateState: () => meetingMinutesInitialState,
    resetMeetingMinutesState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New MeetingMinutes
    builder.addCase(createMeetingMinutes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMeetingMinutes.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createMeetingMinutes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get PlanRoom List
    builder.addCase(getMeetingMinutesList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getMeetingMinutesList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getMeetingMinutesList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Delete PlanRoom
    builder.addCase(MeetingMinutes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(MeetingMinutes.fulfilled, (state, action) => {
      // state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(MeetingMinutes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // // * Edit PlanRoom
    // builder.addCase(editPlanRoom.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(editPlanRoom.fulfilled, (state, action) => {
    //   state.create = action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(editPlanRoom.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Get PlanRoom Details
    // builder.addCase(getPlanRoomDetails.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(getPlanRoomDetails.fulfilled, (state, action) => {
    //   state.current = action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(getPlanRoomDetails.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
    // builder.addCase(submitPlanRoomResponse.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(submitPlanRoomResponse.fulfilled, (state, action) => {
    //   state.current = action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(submitPlanRoomResponse.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

export const {
  setMeetingMinutesList,
  setCurrentMeetingMinutes,
  setCreateMeetingMinutes,
  setMeetingMinutesDescription,
  setMeetingMinutesInviteAttendee,
  setMeetingMinutesNotes,
  setMeetingMinutesPermit,
  setMeetingMinutesPlanTracking,
  resetMeetingMinutesState,
  resetMeetingMinutesCreateState,
} = meetingMinutes.actions;
export default meetingMinutes.reducer;
