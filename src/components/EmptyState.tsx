import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type Props = {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
};

const EmptyState: React.FC<Props> = ({
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        border: '1px dashed #e0e0e0',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
