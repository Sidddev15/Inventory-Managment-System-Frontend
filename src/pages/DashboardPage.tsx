import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome! Low stock widgets and recent movements will appear here.
      </Typography>
    </Box>
  );
};

export default DashboardPage;
