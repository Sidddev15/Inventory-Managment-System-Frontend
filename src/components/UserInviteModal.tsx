import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { registerUser } from '../services/users';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const UserInviteModal: React.FC<Props> = ({ open, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff' | 'viewer'>('staff');
  const [password, setPassword] = useState('password123'); // simple default; change in production
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setRole('staff');
      setPassword('password123');
      setErr(null);
      setSaving(false);
    }
  }, [open]);

  const canSave = useMemo(
    () => name.trim() && email.includes('@') && password.trim().length >= 6,
    [name, email, password]
  );

  const handleInvite = async () => {
    try {
      setSaving(true);
      setErr(null);
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        role,
        password,
      });
      await onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Invite / Register User</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 2 }}
          size="small"
          label="Full Name *"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          size="small"
          label="Email *"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          size="small"
          select
          label="Role *"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="viewer">Viewer</MenuItem>
        </TextField>
        <TextField
          sx={{ mt: 2, mb: 1 }}
          size="small"
          label="Temp Password *"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="User should change this later"
        />
        {err && <div style={{ color: '#d32f2f', marginTop: 4 }}>{err}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleInvite}
          disabled={!canSave || saving}
        >
          {saving ? 'Creating…' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInviteModal;
