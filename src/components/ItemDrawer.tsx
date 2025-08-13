import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  type InventoryItem,
  type ItemGroup,
  type SaveInventoryPayload,
  createInventoryItem,
  updateInventoryItemAPI,
} from '../services/inventory';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  groups: ItemGroup[];
  initial?: InventoryItem | null;
  onSaved: () => Promise<void> | void; // reload table
};

const ItemDrawer: React.FC<Props> = ({
  open,
  onClose,
  mode,
  groups,
  initial,
  onSaved,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [groupId, setGroupId] = useState<number | ''>('');
  const [threshold, setThreshold] = useState<number | ''>(10);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(''); // optional on create
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // populate for edit
  useEffect(() => {
    if (mode === 'edit' && initial) {
      setCode(initial.code ?? '');
      setName(initial.name ?? '');
      setSize(initial.size ?? '');
      setGroupId(initial.group_id ?? '');
      setThreshold(initial.threshold ?? 10);
      setDescription(initial.description ?? '');
      setQuantity(initial.quantity ?? '');
    } else if (mode === 'create') {
      setCode('');
      setName('');
      setSize('');
      setGroupId('');
      setThreshold(10);
      setDescription('');
      setQuantity('');
    }
  }, [mode, initial, open]);

  const canSave = useMemo(() => {
    if (!code.trim() || !name.trim()) return false;
    if (threshold !== '' && threshold! < 0) return false;
    if (quantity !== '' && quantity! < 0) return false;
    return true;
  }, [code, name, threshold, quantity]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErr(null);
      const payload: SaveInventoryPayload = {
        code: code.trim(),
        name: name.trim(),
        size: size.trim() || undefined,
        description: description.trim() || undefined,
        group_id: groupId === '' ? undefined : Number(groupId),
        threshold: threshold === '' ? undefined : Number(threshold),
        quantity:
          mode === 'create'
            ? quantity === ''
              ? undefined
              : Number(quantity)
            : undefined,
      };
      if (mode === 'create') {
        await createInventoryItem(payload);
      } else if (mode === 'edit' && initial) {
        await updateInventoryItemAPI(initial.id, payload);
      }
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 440 } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {mode === 'create' ? 'Add Item' : `Edit Item — ${initial?.code}`}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Code *"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          helperText="Unique item code / SKU"
          size="small"
        />
        <TextField
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />
        <TextField
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          size="small"
        />
        <FormControl size="small">
          <InputLabel id="group-select">Item Group</InputLabel>
          <Select
            labelId="group-select"
            label="Item Group"
            value={groupId === '' ? '' : Number(groupId)}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Threshold"
          type="number"
          inputProps={{ min: 0 }}
          value={threshold}
          onChange={(e) =>
            setThreshold(e.target.value === '' ? '' : Number(e.target.value))
          }
          size="small"
        />
        {mode === 'create' && (
          <TextField
            label="Initial Quantity"
            type="number"
            inputProps={{ min: 0 }}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === '' ? '' : Number(e.target.value))
            }
            size="small"
          />
        )}
        <TextField
          label="Description"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
        />

        {err && <Typography color="error">{err}</Typography>}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving
              ? 'Saving…'
              : mode === 'create'
              ? 'Create Item'
              : 'Save Changes'}
          </Button>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default ItemDrawer;
