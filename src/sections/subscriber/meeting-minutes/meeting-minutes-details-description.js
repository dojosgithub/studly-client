import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

export default function Description({ data }) {
  console.log('DATA:', data)
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        Hello
      </Grid>
    </Grid>
  );
}

Description.propTypes = {
  data: PropTypes.object,
};
