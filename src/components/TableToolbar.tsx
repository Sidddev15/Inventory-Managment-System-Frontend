import React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import SearchIcon from '@mui/icons-material/Search';

type Density = 'compact' | 'standard' | 'comfortable';

type Props = {
  query?: string;
  onQueryChange?: (q: string) => void;
  density: Density;
  onDensityChange: (d: Density) => void;
  placeholder?: string;
};

const TableToolbar: React.FC<Props> = ({
  query = '',
  onQueryChange,
  //   density,
  onDensityChange,
  placeholder,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {onQueryChange && (
        <TextField
          sx={{ width: '20vw' }}
          size="small"
          placeholder={placeholder || 'Search'}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      )}
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Dense">
        <IconButton
          size="small"
          onClick={() => onDensityChange('compact')}
          aria-label="Density compact"
        >
          <DensitySmallIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Standard">
        <IconButton
          size="small"
          onClick={() => onDensityChange('standard')}
          aria-label="Density standard"
        >
          <DensityMediumIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Comfortable">
        <IconButton
          size="small"
          onClick={() => onDensityChange('comfortable')}
          aria-label="Density comfortable"
        >
          <DensityLargeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TableToolbar;
