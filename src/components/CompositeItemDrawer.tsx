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
} from '@mui/material';
import ComponentRowsEditor, { type ComponentRow } from './ComponentRowsEditor';
import { createCompositeItem } from '../services/composite';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const CompositeItemDrawer: React.FC<Props> = ({ open, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState<ComponentRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setSku('');
      setDescription('');
      setRows([]);
      setErr(null);
      setSaving(false);
    }
  }, [open]);

  const canSave = useMemo(
    () =>
      name.trim() &&
      sku.trim() &&
      rows.length > 0 &&
      rows.every((r) => r.component_item_id > 0 && (r.quantity ?? 0) > 0),
    [name, sku, rows]
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setErr(null);
      await createCompositeItem({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim() || undefined,
        components: rows.map((r) => ({
          component_item_id: r.component_item_id,
          quantity: r.quantity,
        })),
      });
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to create composite item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 520 } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Create Composite Item (Kit)
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          size="small"
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          size="small"
          label="SKU *"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          helperText="Unique code for the kit"
        />
        <TextField
          size="small"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
        />

        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
          Components
        </Typography>
        <ComponentRowsEditor rows={rows} onChange={setRows} />

        {err && <Alert severity="error">{err}</Alert>}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? 'Saving…' : 'Create Kit'}
          </Button>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default CompositeItemDrawer;
