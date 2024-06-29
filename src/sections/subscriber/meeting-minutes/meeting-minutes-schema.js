import * as Yup from 'yup';

const descriptionSchema = Yup.object().shape({
  meetingNumber: Yup.string().required('Meeting Number is required'),
  name: Yup.string().required('Name is required'),
  title: Yup.string().required('Title is required'),
  site: Yup.string().required('Site is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  minutesBy: Yup.string().required('Minutes By is required'),
  conferenceCall: Yup.string().required('Conference Call is required'),
  meetingID: Yup.string().required('Meeting ID is required'),
  url: Yup.string().required('URL is required'),
});

const inviteAttendeeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company is required'),
  email: Yup.string().required('Email is required'),
  attended: Yup.boolean().required('Attended is required'),
  _id: Yup.string(),
});

const topicSchema = Yup.object().shape({
  topic: Yup.string().required('Topic is required'),
  action: Yup.string().required('Action is required'),
  date: Yup.date().required('Date is required'),
  description: Yup.string().required('Description is required'),
  _id: Yup.string(),
});

const permitSchema = Yup.object().shape({
  status: Yup.string(),
  date: Yup.date(),
  permitNumber: Yup.string(),
  _id: Yup.string(),
});

const planSchema = Yup.object().shape({
  planTracking: Yup.string(),
  stampDate: Yup.date(),
  dateRecieved: Yup.date(),
  _id: Yup.string(),
});

const meetingMinutesSchema = Yup.object().shape({
  description: descriptionSchema,
  inviteAttendee: Yup.array().of(inviteAttendeeSchema),
  notes: Yup.array().of(
    Yup.object().shape({
      subject: Yup.string().required('Subject is required'),
      topics: Yup.array().of(topicSchema),
    })
  ),
  permit: Yup.array().of(permitSchema),
  plan: Yup.array().of(planSchema),
  projectId: Yup.string().required('Project ID is required'),
  company: Yup.string().required('Company is required'),
});

export default meetingMinutesSchema;
