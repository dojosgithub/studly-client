import * as Yup from 'yup';

// const descriptionSchema = Yup.object().shape({
//   meetingNumber: Yup.string().required('Meeting Number is required'),
//   name: Yup.string().required('Name is required'),
//   title: Yup.string().required('Title is required'),
//   site: Yup.string().required('Site is required'),
//   date: Yup.date().required('Date is required'),
//   time: Yup.string().required('Time is required'),
//   minutesBy: Yup.string().required('Minutes By is required'),
//   conferenceCallId: Yup.string().required('Meeting ID is required'),
//   conferenceCallLink: Yup.string().required('URL is required'),
// });
// const inviteAttendeeSchema = Yup.object().shape({
//   attendees: Yup.array().of(
//     Yup.object().shape({
//       name: Yup.string().required('Name is required'),
//       company: Yup.string().required('Company is required'),
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       _id: Yup.string(),
//     })
//   ),
// });

const inviteAttendeeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  _id: Yup.string(),
});

const topicSchema = Yup.object().shape({
  topic: Yup.string().required('Topic is required'),
  date: Yup.date().required('Date is required'),
  assignee: Yup.object(),
  // dropdown1: Yup.string().required('Assignee is required'), // Add validation for dropdown1
  // dropdown2: Yup.string().required('Status is required'), // Add validation for dropdown2
  // dropdown3: Yup.string().required('Priority is required'), // Add validation for dropdown3
  description: Yup.string().required('Description is required'),
  _id: Yup.string(),
});


const permitSchema = Yup.object().shape({
  status: Yup.string().required('status is required'),
  date: Yup.date().required('date is requiered'),
  permitNumber: Yup.string().required('permit number is required'),
  _id: Yup.string(),
});

const planSchema = Yup.object().shape({
  planTracking: Yup.string().required('plan tracking is required'),
  stampDate: Yup.date().required('stamp date is required'),
  dateRecieved: Yup.date().required('data recieved is required'),
  _id: Yup.string(),
});

const meetingMinutesSchema = Yup.object().shape({
  // description: descriptionSchema,
  inviteAttendee: Yup.array().of(inviteAttendeeSchema),
  notes: Yup.array().of(
    Yup.object().shape({
      subject: Yup.string().required('Subject is required'),
      topics: Yup.array().of(topicSchema),
    })
  ),
  permit: Yup.array().of(permitSchema),
  plan: Yup.array().of(planSchema).required('Plan is required'),
  // projectId: Yup.string().required('Project ID is required'),
  // company: Yup.string().required('Company is required'),
});

export default meetingMinutesSchema;
