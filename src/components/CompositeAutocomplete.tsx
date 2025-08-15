import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { fetchCompositeItems } from '../services/composite';

type Option = { id: number; sku: string; name: string };

const CompositeAutocomplete: React.FC<{
  value: Option | null;
  onChange: (v: Option | null) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchCompositeItems(); // ensure you’ve implemented list on backend or adapt
        setOptions(data as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Autocomplete
      options={options}
      loading={loading}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(o) => `${o.sku} — ${o.name}`}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => (
        <TextField {...params} size="small" label="Composite Item" />
      )}
      disabled={disabled}
    />
  );
};

export default CompositeAutocomplete;
