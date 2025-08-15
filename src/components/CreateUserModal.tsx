// src/components/CreateUserModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';
import { createUser } from '../services/users';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const CreateUserModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff' | 'viewer'>('staff');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [password, setPassword] = useState('password123');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setRole('staff');
      setStatus('active');
      setPassword('password123');
      setSaving(false);
      setErr(null);
    }
  }, [open]);

  const canSave = useMemo(
    () => name.trim() && email.includes('@') && password.trim().length >= 6,
    [name, email, password]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    try {
      setSaving(true);
      setErr(null);
      await createUser({
        name: name.trim(),
        email: email.trim(),
        role,
        status,
        password,
      });
      await onSuccess();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              autoComplete="name"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              autoComplete="email"
              required
            />
            <TextField
              label="Temp Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              autoComplete="new-password"
              required
              helperText="They should change this later"
            />
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              size="small"
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              size="small"
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>

            {err && <div style={{ color: '#d32f2f' }}>{err}</div>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSave || saving}
          >
            {saving ? 'Creating…' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUserModal;
