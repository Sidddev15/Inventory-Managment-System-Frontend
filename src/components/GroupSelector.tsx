import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { ItemGroup } from '../services/inventory';

type Props = {
  groups: ItemGroup[];
  value: number | 'all';
  onChange: (val: number | 'all') => void;
};

const GroupSelector: React.FC<Props> = ({ groups, value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="group-select-label">Item Group</InputLabel>
      <Select
        labelId="group-select-label"
        label="Item Group"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        <MenuItem value="all">All</MenuItem>
        {groups.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GroupSelector;
