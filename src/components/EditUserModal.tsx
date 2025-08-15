import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import {
  type Role,
  type Status,
  type User,
  updateUser,
} from '../services/users';

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  allowRoleChange?: boolean; // default: true, set false if you want to lock role changes
};

const EditUserModal: React.FC<Props> = ({
  open,
  user,
  onClose,
  onSaved,
  allowRoleChange = true,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [status, setStatus] = useState<Status>('active');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name || '');
    setEmail(user.email || '');
    setRole(user.role || 'staff');
    setStatus(user.status || 'active');
    setNewPassword('');
    setErr(null);
    setSaving(false);
  }, [open, user]);

  const canSave = useMemo(() => {
    if (!user) return false;
    if (!name.trim()) return false;
    if (!email.includes('@')) return false;
    if (newPassword && newPassword.length < 6) return false;
    return true;
  }, [user, name, email, newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      setErr(null);
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        status,
      };
      if (allowRoleChange) payload.role = role;
      if (newPassword) payload.password = newPassword;

      await updateUser(user.id, payload);
      await onSaved();
      onClose();
    } catch (error: any) {
      setErr(error?.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} autoComplete="on">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              fullWidth
              autoComplete="name"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              fullWidth
              autoComplete="email"
              required
            />
            {allowRoleChange && (
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                size="small"
                fullWidth
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </TextField>
            )}
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              size="small"
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <TextField
              label="Reset Password (optional)"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              fullWidth
              autoComplete="new-password"
              helperText="Leave blank to keep existing password"
            />
            {err && <Alert severity="error">{err}</Alert>}
          </Stack>
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
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;
