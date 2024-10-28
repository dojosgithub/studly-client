import React from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  ListItemText,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { _mock } from 'src/_mock';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { paths } from 'src/routes/paths';

const ProjectFinal = () => {
  const { name, trades, workflow } = useSelector((state) => state.project.create);
  const members = useSelector((state) => state.project.members);
  const filteredTrades = trades.filter((item) => 'email' in item);

  const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSubcontractor',
  })(({ isSubcontractor, theme }) => ({
    '& .projectTitle': {
      color: theme.palette.secondary.main,
      flex: 0.25,
      minWidth: '25%',
    },
    '& .projectDescription': {
      borderLeft: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`,
      paddingLeft: '1rem',
    },
    display: 'flex',
    borderRadius: '10px',
    padding: '1rem',
    gap: '1rem',
    maxHeight: 300,
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      maxHeight: '100%',
      flexDirection: 'column',
    },
  }));
  return (
    <>
      <CustomBreadcrumbs
        heading="Project Details"
        links={[
          {
            name: 'Dashboard',
          },
          { name: 'Projects', href: paths.subscriber.submittals.list },
          { name: 'Project' },
        ]}
        sx={{
          mt: { xs: 3, md: 5 },
          mb: { xs: 3 },
        }}
      />
      <Divider
        sx={{
          minHeight: '1px',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          mb: 4,
        }}
      />
      <Stack
        sx={{
          my: 3,
          gap: 2,
        }}
      >
        <StyledCard>
          <Typography className="projectTitle">Project Name</Typography>
          <Typography
            className="projectDescription"
            sx={{ color: (theme) => theme.palette.primary.main, flex: 0.75, px: 2 }}
          >
            {name}
          </Typography>
        </StyledCard>
        <StyledCard>
          <Typography className="projectTitle">Project Trades</Typography>
          <Typography
            className="projectDescription"
            sx={{ color: (theme) => theme.palette.primary.main, flex: 0.15, px: 2 }}
          >
            Trades
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 0.6 }}>
            {trades?.length > 0 &&
              trades
                ?.slice(0, 4)
                .map((item) => (
                  <Chip key={item._id} size="small" variant="outlined" label={item.name} />
                ))}
            {trades?.length > 4 && (
              <Chip size="small" variant="outlined" label={`${trades.length - 4} +`} />
            )}
          </Box>
        </StyledCard>
        <StyledCard>
          <Typography className="projectTitle">Project Workflow</Typography>
          <Typography
            className="projectDescription"
            sx={{ color: (theme) => theme.palette.primary.main, flex: 0.75, px: 2 }}
          >
            {workflow?.name}
          </Typography>
        </StyledCard>
        {filteredTrades?.length > 0 && (
          <StyledCard isSubcontractor>
            <Typography className="projectTitle">Subcontractors</Typography>
            <Stack className="projectDescription" spacing={3} sx={{ flex: 0.75 }}>
              <Scrollbar>
                <Stack spacing={3} maxHeight={300}>
                  {filteredTrades.map((trade, index) => (
                    <Stack direction="row" alignItems="center" key={trade?._id}>
                      {trade?.email && (
                        <Avatar
                          src={_mock.image.avatar(index)}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                      )}

                      <ListItemText primary={trade?.name} secondary={trade?.email} />
                      {!trade?.email && <Chip size="small" variant="outlined" label="N/A" />}
                    </Stack>
                  ))}
                </Stack>
              </Scrollbar>
            </Stack>
          </StyledCard>
        )}
        {members?.length > 0 && (
          <StyledCard>
            <Typography className="projectTitle" sx={{ minWidth: 'max-content' }}>
              Invited Users
            </Typography>
            <Stack className="projectDescription" spacing={3} sx={{ flex: 0.75 }}>
              <Scrollbar>
                <Stack spacing={3} maxHeight={300}>
                  {members
                    .filter((item) => item.team === 'internal')
                    .map((user, index) => (
                      <Stack direction="row" alignItems="center" key={user.email}>
                        <Avatar
                          src={_mock.image.avatar(index + 1)}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />

                        <ListItemText primary={user.role?.name} secondary={user.email} />
                      </Stack>
                    ))}
                  {members
                    .filter((item) => item.team === 'external')
                    .map((user, index) => (
                      <Stack direction="row" alignItems="center" key={user.email}>
                        <Avatar
                          src={_mock.image.avatar(index + 1)}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />

                        <ListItemText primary={user.role?.name} secondary={user.email} />
                      </Stack>
                    ))}
                </Stack>
              </Scrollbar>
            </Stack>
          </StyledCard>
        )}
      </Stack>
    </>
  );
};

export default ProjectFinal;
