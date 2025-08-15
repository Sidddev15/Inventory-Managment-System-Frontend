import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ItemAutocomplete from './ItemAutocomplete';
import type { InventoryItem } from '../services/inventory';
import type { CompositeComponent } from '../services/composite';

type Row = CompositeComponent & { _key: string; _item?: InventoryItem | null };

type Props = {
  rows: Row[];
  onChange: (rows: Row[]) => void;
};

const ComponentRowsEditor: React.FC<Props> = ({ rows, onChange }) => {
  const addRow = () => {
    onChange([
      ...rows,
      {
        _key: crypto.randomUUID(),
        component_item_id: 0,
        quantity: 1,
        _item: null,
      },
    ]);
  };
  const removeRow = (key: string) => {
    onChange(rows.filter((r) => r._key !== key));
  };
  const setItem = (key: string, item: InventoryItem | null) => {
    onChange(
      rows.map((r) =>
        r._key === key
          ? {
              ...r,
              _item: item,
              component_item_id: item ? item.id : 0,
              code: item?.code,
              name: item?.name,
            }
          : r
      )
    );
  };
  const setQty = (key: string, qty: number | '') => {
    onChange(
      rows.map((r) =>
        r._key === key ? { ...r, quantity: qty === '' ? 0 : Number(qty) } : r
      )
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {rows.map((row) => (
        <Box
          key={row._key}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 140px 40px',
            gap: 1,
          }}
        >
          <ItemAutocomplete
            value={row._item ?? null}
            onChange={(i) => setItem(row._key, i)}
          />
          <TextField
            size="small"
            label="Qty *"
            type="number"
            inputProps={{ min: 1 }}
            value={row.quantity}
            onChange={(e) =>
              setQty(
                row._key,
                e.target.value === '' ? ('' as any) : Number(e.target.value)
              )
            }
          />
          <IconButton color="error" onClick={() => removeRow(row._key)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}
      <Box>
        <IconButton onClick={addRow}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export type ComponentRow = Row;
export default ComponentRowsEditor;
