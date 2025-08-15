import React, { useState } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  type PriceListItem,
  updatePriceListItem,
  deletePriceListItem,
} from '../services/pricelist';

const PriceListItemsTable: React.FC<{
  rows: PriceListItem[];
  onChanged: () => Promise<void> | void;
  enableInlineUpdate?: boolean; // set true if you added PUT endpoint
  enableDelete?: boolean; // set true if you added DELETE endpoint
}> = ({ rows, onChanged, enableInlineUpdate, enableDelete }) => {
  const [editing, setEditing] = useState<
    Record<number, { price: string; currency: string }>
  >({});

  const beginEdit = (r: PriceListItem) => {
    setEditing((s) => ({
      ...s,
      [r.id]: { price: String(r.price), currency: r.currency },
    }));
  };

  const onField = (id: number, k: 'price' | 'currency', v: string) => {
    setEditing((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));
  };

  const save = async (id: number) => {
    const e = editing[id];
    if (!e) return;
    await updatePriceListItem(id, {
      price: Number(e.price),
      currency: e.currency,
    });
    setEditing((s) => {
      const { [id]: _, ...rest } = s;
      return rest;
    });
    await onChanged();
  };

  const del = async (id: number) => {
    await deletePriceListItem(id);
    await onChanged();
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Code/Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell>Currency</TableCell>
            {(enableInlineUpdate || enableDelete) && (
              <TableCell align="right">Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => {
            const e = editing[r.id];
            const isEditing = !!e;
            return (
              <TableRow
                key={r.id}
                hover
                onDoubleClick={() => enableInlineUpdate && beginEdit(r)}
              >
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {r.item_type}
                </TableCell>
                <TableCell>
                  {r.code ? `${r.code} — ${r.name ?? ''}` : r.name ?? ''}
                </TableCell>
                <TableCell align="right">
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={e.price}
                      onChange={(ev) => onField(r.id, 'price', ev.target.value)}
                    />
                  ) : (
                    r.price
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={e.currency}
                      onChange={(ev) =>
                        onField(r.id, 'currency', ev.target.value)
                      }
                    />
                  ) : (
                    r.currency
                  )}
                </TableCell>
                {(enableInlineUpdate || enableDelete) && (
                  <TableCell align="right">
                    {isEditing && enableInlineUpdate && (
                      <Tooltip title="Save">
                        <IconButton size="small" onClick={() => save(r.id)}>
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {enableDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => del(r.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceListItemsTable;
