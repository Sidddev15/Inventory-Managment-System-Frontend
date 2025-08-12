import React, { useState } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';

type Props = {
  onSearchDate: (date: string) => void;
  onSearchRange: (from: string, to: string) => void;
};

const MovementFilterBar: React.FC<Props> = ({
  onSearchDate,
  onSearchRange,
}) => {
  const [date, setDate] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <TextField
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button variant="contained" onClick={() => date && onSearchDate(date)}>
          Search by Date
        </Button>

        <TextField
          type="date"
          label="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          type="date"
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={() => from && to && onSearchRange(from, to)}
        >
          Search Range
        </Button>
      </Stack>
    </Box>
  );
};

export default MovementFilterBar;
