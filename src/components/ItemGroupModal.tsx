import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import {
  type ItemGroup,
  type SaveInventoryPayload,
  createItemGroup,
  updateItemGroup,
} from '../services/inventory';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initial?: ItemGroup | null;
  onSaved: () => Promise<void> | void;
};

const ItemGroupModal: React.FC<Props> = ({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setName(initial.name ?? '');
      setDescription(initial.description ?? '');
    } else {
      setName('');
      setDescription('');
    }
  }, [mode, initial, open]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErr(null);
      const payload: SaveInventoryPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        code: '',
      };
      if (mode === 'create') {
        await createItemGroup(payload);
      } else if (mode === 'edit' && initial) {
        await updateItemGroup(initial.id, payload);
      }
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {mode === 'create'
          ? 'Add Item Group'
          : `Edit Item Group — ${initial?.name}`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Group Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            multiline
            minRows={3}
          />
          {err && <Typography color="error">{err}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemGroupModal;
