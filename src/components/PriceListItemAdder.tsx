import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import ItemAutocomplete from './ItemAutocomplete';
import CompositeAutocomplete from './CompositeAutocomplete';
import { type InventoryItem } from '../services/inventory';
import { addPriceListItem } from '../services/pricelist';

type CompositeOption = { id: number; sku: string; name: string };

const PriceListItemAdder: React.FC<{
  priceListId: number;
  onAdded: () => Promise<void> | void;
}> = ({ priceListId, onAdded }) => {
  const [type, setType] = useState<'inventory' | 'composite'>('inventory');
  const [inv, setInv] = useState<InventoryItem | null>(null);
  const [cmp, setCmp] = useState<CompositeOption | null>(null);
  const [price, setPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('INR');
  const [saving, setSaving] = useState(false);

  const canAdd = useMemo(() => {
    if (price === '' || Number(price) < 0) return false;
    if (type === 'inventory') return !!inv;
    return !!cmp;
  }, [type, inv, cmp, price]);

  const handleAdd = async () => {
    if (!canAdd) return;
    setSaving(true);
    try {
      await addPriceListItem({
        price_list_id: priceListId,
        item_type: type,
        item_id: type === 'inventory' ? (inv as any).id : (cmp as any).id,
        price: Number(price),
        currency,
      });
      setPrice('');
      setInv(null);
      setCmp(null);
      await onAdded();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{ flexWrap: 'wrap' }}
    >
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="ptype">Item Type</InputLabel>
        <Select
          labelId="ptype"
          label="Item Type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <MenuItem value="inventory">Inventory Item</MenuItem>
          <MenuItem value="composite">Composite Item</MenuItem>
        </Select>
      </FormControl>

      {type === 'inventory' ? (
        <Box sx={{ minWidth: 320 }}>
          <ItemAutocomplete value={inv} onChange={setInv} />
        </Box>
      ) : (
        <Box sx={{ minWidth: 320 }}>
          <CompositeAutocomplete value={cmp} onChange={setCmp} />
        </Box>
      )}

      <TextField
        size="small"
        label="Price *"
        type="number"
        inputProps={{ min: 0, step: 0.01 }}
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === '' ? '' : Number(e.target.value))
        }
      />

      <TextField
        size="small"
        label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        sx={{ width: 120 }}
      />

      <Button
        variant="contained"
        onClick={handleAdd}
        disabled={!canAdd || saving}
      >
        {saving ? 'Adding…' : 'Add'}
      </Button>
    </Stack>
  );
};

export default PriceListItemAdder;
