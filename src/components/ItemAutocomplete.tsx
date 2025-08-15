import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { type InventoryItem, fetchInventory } from '../services/inventory';

type Props = {
  value: InventoryItem | null;
  onChange: (item: InventoryItem | null) => void;
  disabled?: boolean;
};

const ItemAutocomplete: React.FC<Props> = ({ value, onChange, disabled }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchInventory();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const options = useMemo(() => items, [items]);

  return (
    <Autocomplete
      options={options}
      loading={loading}
      getOptionLabel={(o) => `${o.code ?? ''} — ${o.name ?? ''}`}
      value={value}
      onChange={(_, v) => onChange(v)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => (
        <TextField {...params} label="Item *" size="small" />
      )}
      disabled={disabled}
    />
  );
};

export default ItemAutocomplete;
