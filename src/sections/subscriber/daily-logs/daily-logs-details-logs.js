// import PropTypes from 'prop-types';
// import { useRef } from 'react';
// // @mui
// import { alpha } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import Grid from '@mui/material/Unstable_Grid2';
// import { styled, Typography } from '@mui/material';

// // ----------------------------------------------------------------------

// const StyledCard = styled(Card, {
//   shouldForwardProp: (prop) => prop !== 'isSubcontractor',
// })(({ isSubcontractor, theme }) => ({
//   '& .submittalTitle': {
//     color: theme.palette.primary.main,
//     flex: 0.25,
//     borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
//     fontWeight: 'bold',
//   },
//   display: 'flex',
//   borderRadius: '10px',
//   padding: '1rem',
//   gap: '1rem',
//   ...(isSubcontractor && {
//     maxHeight: 300,
//   }),
// }));

// export default function Logs({ data }) {
//   return (
//     <Grid container spacing={3}>
//       <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '30px' }}>
//         <Typography className="submittalTitle">Date</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {new Date(data?.date).toLocaleDateString()}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
//         <Typography className="submittalTitle">Project Name</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.projectId}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
//         <Typography className="submittalTitle">Visitors</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.visitors?.join(', ') || 'N/A'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
//         <Typography className="submittalTitle">Inspection</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.inspection?.map((item) => item.value).join(', ') || 'N/A'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
//         <Typography className="submittalTitle">Weather</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.weather?.join(', ') || 'N/A'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px' }}>
//         <Typography className="submittalTitle">Subcontractor Attendance</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.subcontractorAttendance?.map((attendance) => attendance.name).join(', ') || 'N/A'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%' }}>
//         <Typography className="submittalTitle">Distribution List</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.distributionList?.map((item) => item.name).join(', ') || 'N/A'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '30px' }}>
//         <Typography className="submittalTitle">Attachments</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.attachments?.length ? 'Attachments present' : 'No attachments'}
//         </Typography>
//       </StyledCard>

//       <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '30px' }}>
//         <Typography className="submittalTitle">Summary</Typography>
//         <Typography sx={{ color: (theme) => theme.palette.text.primary, flex: 0.75, px: 2 }}>
//           {data?.summary}
//         </Typography>
//       </StyledCard>
//     </Grid>
//   );
// }

// Logs.propTypes = {
//   data: PropTypes.shape({
//     accidentSafetyIssues: PropTypes.string,
//     attachments: PropTypes.arrayOf(PropTypes.object),
//     createdAt: PropTypes.string,
//     date: PropTypes.string.isRequired,
//     distributionList: PropTypes.arrayOf(
//       PropTypes.shape({
//         name: PropTypes.string,
//       })
//     ),
//     docStatus: PropTypes.number,
//     id: PropTypes.string,
//     inspection: PropTypes.arrayOf(
//       PropTypes.shape({
//         value: PropTypes.string,
//       })
//     ),
//     projectId: PropTypes.string.isRequired,
//     status: PropTypes.number,
//     subcontractorAttendance: PropTypes.arrayOf(
//       PropTypes.shape({
//         name: PropTypes.string,
//       })
//     ),
//     summary: PropTypes.string,
//     updatedAt: PropTypes.string,
//     visitors: PropTypes.arrayOf(PropTypes.string),
//     weather: PropTypes.arrayOf(PropTypes.string),
//   }),
// };
