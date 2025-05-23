import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { dropdownOptions2 } from 'src/_mock';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Meeting Minutes

export const createMeetingMinutes = createAsyncThunk(
  'meetingMinutes/create',
  async (meetingMinutesData, { getState, rejectWithValue }) => {
    if (isEmpty(meetingMinutesData)) {
      return rejectWithValue('Meeting minutes data cannot be empty.');
    }

    const projectId = getState().project?.current?._id;

    meetingMinutesData.projectId = projectId;
    try {
      const response = await axiosInstance.post(
        endpoints.meetingMinutes.create,
        meetingMinutesData
      );

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

export const updateMeetingMinutes = createAsyncThunk(
  'meetingMinutes/update',
  async ({ data, id }, { getState, rejectWithValue }) => {
    if (isEmpty(data)) {
      return rejectWithValue('Meeting minutes data cannot be empty.');
    }

    const projectId = getState().project?.current?._id;

    data.projectId = projectId;
    try {
      const response = await axiosInstance.put(endpoints.meetingMinutes.update(id), data);

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
  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const { status, ...data } = listOptions;
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

export const deleteMeetingMinutes = createAsyncThunk(
  'meetingMinutesSheet/delete',
  async ({ projectId, meetingMinutesId, sheetId }) => {
    try {
      const response = await axiosInstance.delete(
        endpoints.meetingMinutes.delete(projectId, meetingMinutesId, sheetId)
      );

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

export const getMeetingMinutesDetails = createAsyncThunk('meetingMinutes/details', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.meetingMinutes.details(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching submittal details.');
  }
});

export const createFollowup = createAsyncThunk('meetingMinutes/followup', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.meetingMinutes.followup(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const sendToAttendees = createAsyncThunk('meetingMinutes/send', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.meetingMinutes.sendToAttendees(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const changeToMinutes = createAsyncThunk('meetingMinutes/changetominutes', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.meetingMinutes.toMinutes(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const deleteMeeting = createAsyncThunk('meetingMinutes/delete', async (id) => {
  try {
    const response = await axiosInstance.delete(endpoints.meetingMinutes.delete(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const getMeetingMinutesPDF = createAsyncThunk('meetingMinutes/pdf', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.meetingMinutes.pdf(id), {
      responseType: 'blob',
    });

    const buffer = response.data;

    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting_log';
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);

    return response.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching submittal list.');
  }
});

export const getSubmittalAndRfiList = createAsyncThunk(
  'meetingMinutes/submittalAndRfiList',
  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const { status, ...data } = listOptions;
      const response = await axiosInstance.post(
        endpoints.meetingMinutes.submittalAndRfiList(projectId),
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

const inviteAttendeeInitialState = {
  name: '',
  company: '',
  email: '',
  attended: false,
};
const topicInitialState = {
  topic: '',
  date: null,
  description: '',
  assignee: null,
  status: 'Open',
  priority: 'Low',
  referedTo : ''
};
const noteInitialState = {
  subject: '',
  topics: [{ ...topicInitialState }],
};
const permitInitialState = {
  status: '',
  date: null,
  permitNumber: '',
};
const planTrackingInitialState = {
  planTracking: '',
  stampDate: null,
  dateRecieved: null,
};
const meetingMinutesInitialState = {
  description: {
    meetingNumber: '',
    name: '',
    title: '',
    site: '',
    date: null,
    time: '',
    timezone: dropdownOptions2[0],
    minutesBy: '',
    conferenceCallId: '',
    conferenceCallLink: '',
  },
  inviteAttendee: [{ ...inviteAttendeeInitialState }],
  notes: [{ ...noteInitialState }],
  permit: [{ ...permitInitialState }],
  plan: [{ ...planTrackingInitialState }],
  projectId: '', // Assuming you want a unique ID
  company: '', // Assuming you want a unique ID
};

const initialState = {
  notes: '',
  list: [],
  referedTo: {},
  create: { ...meetingMinutesInitialState },
  current: {},
  isLoading: false,
  error: null,
};

const meetingMinutes = createSlice({
  name: 'meetingMinutes',
  initialState,
  reducers: {
    setCreateMeetingMinutes: (state, action) => {
      state.create = action.payload;
    },
    setMeetingMinutesDescription: (state, action) => {
      state.create.description = action.payload;
    },
    setMeetingMinutesInviteAttendee: (state, action) => {
      state.create.inviteAttendee = action.payload;
    },
    setMeetingMinutesNotes: (state, action) => {
      state.create.notes = action.payload;
    },
    setMeetingMinutesPermit: (state, action) => {
      state.create.permit = action.payload;
    },
    setMeetingMinutesPlanTracking: (state, action) => {
      state.create.plan = action.payload;
    },

    resetMeetingMinutesCreateState: () => meetingMinutesInitialState,
    resetMeetingMinutesState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New Meeting Minutes
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

    // * Get Meeting Minutes List
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

    // * Get Submittal And Rfi List
    builder.addCase(getSubmittalAndRfiList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getSubmittalAndRfiList.fulfilled, (state, action) => {
      state.referedTo = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getSubmittalAndRfiList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Delete Meeting Minutes
    builder.addCase(deleteMeetingMinutes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteMeetingMinutes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteMeetingMinutes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get Meeting Minutes Details
    builder.addCase(getMeetingMinutesDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getMeetingMinutesDetails.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getMeetingMinutesDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const {
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
