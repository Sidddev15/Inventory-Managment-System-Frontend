import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type Props = { title: string; value: number | string; hint?: string };

const StatCard: React.FC<Props> = ({ title, value, hint }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
          {value}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
