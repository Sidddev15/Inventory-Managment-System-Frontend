import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import ItemAutocomplete from './ItemAutocomplete';
import type { InventoryItem } from '../services/inventory';
import { adjustStock, stockIn, stockOut } from '../services/movements';
import { useAuth } from '../store/AuthContext';

type Mode = 'IN' | 'OUT' | 'ADJUSTMENT';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  onSaved: () => Promise<void> | void; // refresh table after success
};

const ModeTitle: Record<Mode, string> = {
  IN: 'Stock In',
  OUT: 'Stock Out',
  ADJUSTMENT: 'Adjust Stock',
};

const MovementActionDrawer: React.FC<Props> = ({
  open,
  onClose,
  mode,
  onSaved,
}) => {
  const { hasRole } = useAuth();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [qty, setQty] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [ref, setRef] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // permissions guard (UI level)
  const canDo = useMemo(() => {
    if (mode === 'ADJUSTMENT') return hasRole('admin');
    return hasRole('admin', 'staff');
  }, [mode, hasRole]);

  useEffect(() => {
    if (!open) {
      setItem(null);
      setQty('');
      setReason('');
      setRef('');
      setNote('');
      setErr(null);
      setSaving(false);
    }
  }, [open, mode]);

  const title = ModeTitle[mode];
  const primaryLabel = mode === 'ADJUSTMENT' ? 'New Quantity *' : 'Quantity *';
  const canSave = !!item && qty !== '' && Number(qty) >= 0 && canDo;

  const handleSubmit = async () => {
    if (!canSave || !item) return;
    try {
      setSaving(true);
      setErr(null);
      const payload = {
        item_id: item.id,
        quantity: Number(qty),
        reason: reason || undefined,
        reference_no: ref || undefined,
        note: note || undefined,
      };
      if (mode === 'IN') await stockIn(payload);
      else if (mode === 'OUT') await stockOut(payload);
      else await adjustStock(payload); // ADJUSTMENT
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 460 } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {!canDo && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            You don’t have permissions for this action.
          </Alert>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ItemAutocomplete value={item} onChange={setItem} disabled={!canDo} />
        <TextField
          label={primaryLabel}
          type="number"
          inputProps={{ min: 0 }}
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === '' ? '' : Number(e.target.value))
          }
          size="small"
          disabled={!canDo}
        />
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          size="small"
          disabled={!canDo}
        />
        <TextField
          label="Reference No."
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          size="small"
          disabled={!canDo}
        />
        <TextField
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          minRows={3}
          size="small"
          disabled={!canDo}
        />

        {err && <Alert severity="error">{err}</Alert>}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSave || saving}
          >
            {saving ? 'Saving…' : title}
          </Button>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default MovementActionDrawer;
