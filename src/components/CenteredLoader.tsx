import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const CenteredLoader: React.FC = () => (
  <Box sx={{ p: 3, display: 'grid', placeItems: 'center', minHeight: 240 }}>
    <CircularProgress />
  </Box>
);

export default CenteredLoader;
