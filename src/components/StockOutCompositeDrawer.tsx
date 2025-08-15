import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { stockOutComposite } from '../services/composite';
import { fetchCompositeItem } from '../services/composite';
import { fetchInventoryByIds } from '../services/inventory';

type ComponentRow = {
  component_item_id: number;
  quantity: number;
  code?: string;
  name?: string;
  available?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  compositeId: number | null;
  compositeLabel?: string;
  onSaved: () => Promise<void> | void;
};

const StockOutCompositeDrawer: React.FC<Props> = ({
  open,
  onClose,
  compositeId,
  compositeLabel,
  onSaved,
}) => {
  const [qty, setQty] = useState<number | ''>('');
  const [ref, setRef] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [components, setComponents] = useState<ComponentRow[] | null>(null);
  const [maxKits, setMaxKits] = useState<number | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!open || !compositeId) return;
      setLoadingDetails(true);
      setErr(null);
      try {
        // 1) Get kit components
        const detail = await fetchCompositeItem(compositeId);
        const comps: ComponentRow[] = (detail?.components || []).map(
          (c: any) => ({
            component_item_id: c.component_item_id,
            quantity: c.quantity,
            code: c.code, // if your backend joins code/name, great; else leave undefined
            name: c.name,
          })
        );
        setComponents(comps);

        if (comps.length === 0) {
          setMaxKits(0);
          return;
        }

        // 2) Get available stock for components
        let inventory = [] as any[];
        try {
          const ids = comps.map((c) => c.component_item_id);
          inventory = await fetchInventoryByIds(ids);
        } catch {
          // Fallback (optional): skip availability if endpoint not ready
          inventory = [];
        }

        const merged = comps.map((c) => {
          const inv = inventory.find((i: any) => i.id === c.component_item_id);
          return {
            ...c,
            available: inv?.quantity ?? null,
            code: c.code ?? inv?.code,
            name: c.name ?? inv?.name,
          };
        });

        setComponents(merged);

        // 3) Compute max kits
        const limits = merged
          .map((c) =>
            typeof c.available === 'number'
              ? Math.floor(c.available / c.quantity)
              : Infinity
          )
          .filter((n) => Number.isFinite(n)) as number[];

        const min = limits.length ? Math.min(...limits) : null; // if no stock info, null
        setMaxKits(min);
      } catch (e: any) {
        setErr(e?.response?.data?.error || 'Failed to load kit details');
      } finally {
        setLoadingDetails(false);
      }
    };

    if (open) {
      setQty('');
      setRef('');
      setNote('');
      setSaving(false);
      setErr(null);
      setComponents(null);
      setMaxKits(null);
      loadDetails();
    }
  }, [open, compositeId]);

  const canSave = useMemo(() => {
    if (!compositeId) return false;
    if (qty === '' || Number(qty) <= 0) return false;
    if (maxKits !== null && Number(qty) > maxKits) return false;
    if (components && components.length === 0) return false;
    return true;
  }, [compositeId, qty, maxKits, components]);

  const handleSave = async () => {
    if (!canSave || !compositeId) return;
    try {
      setSaving(true);
      setErr(null);
      await stockOutComposite({
        composite_item_id: compositeId,
        quantity: Number(qty),
        reference_no: ref || undefined,
        note: note || undefined,
      });
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to stock out kit');
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
          Stock Out Composite
        </Typography>
        {compositeLabel && (
          <Typography variant="body2" color="text.secondary">
            {compositeLabel}
          </Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loadingDetails ? (
          <Typography variant="body2" color="text.secondary">
            Loading kit details…
          </Typography>
        ) : components?.length ? (
          <>
            <Typography variant="subtitle2">Components</Typography>
            <List dense>
              {components.map((c, idx) => (
                <ListItem key={`${c.component_item_id}-${idx}`} disableGutters>
                  <ListItemText
                    primary={`${c.code ?? `#${c.component_item_id}`} — ${
                      c.name ?? 'Item'
                    }`}
                    secondary={`Qty/kit: ${c.quantity} • Available: ${
                      c.available ?? '—'
                    }`}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary">
              Max buildable kits: {maxKits === null ? '—' : maxKits}
            </Typography>
          </>
        ) : (
          <Alert severity="warning">
            This kit has no components. Please add components before stocking
            out.
          </Alert>
        )}

        <TextField
          label="Quantity *"
          type="number"
          size="small"
          inputProps={{ min: 1 }}
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === '' ? ('' as any) : Number(e.target.value))
          }
        />
        <TextField
          label="Reference No."
          size="small"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
        <TextField
          label="Note"
          size="small"
          multiline
          minRows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {err && <Alert severity="error">{err}</Alert>}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? 'Processing…' : 'Stock Out'}
          </Button>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default StockOutCompositeDrawer;
