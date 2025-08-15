import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type ChipProps,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { type User, fetchUsers, updateUserRole } from '../services/users';
import CreateUserModal from '../components/CreateUserModal';
import { useAuth } from '../store/AuthContext';

const roleColor: Record<User['role'], ChipProps['color']> = {
  admin: 'success',
  staff: 'info',
  viewer: 'warning',
};

// keep hooks out of renderCell
const RoleEditorCell: React.FC<{
  row: User;
  meId?: number;
  onUpdated: () => Promise<void> | void;
}> = ({ row, meId, onUpdated }) => {
  const [roleDraft, setRoleDraft] = useState<User['role']>(row.role);
  const [saving, setSaving] = useState(false);
  const canChange = row.id !== meId;

  const saveRole = async () => {
    if (!canChange) return;
    try {
      setSaving(true);
      await updateUserRole(row.id, roleDraft);
      await onUpdated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ height: '100%' }}
    >
      <TextField
        select
        size="small"
        value={roleDraft}
        onChange={(e) => setRoleDraft(e.target.value as User['role'])}
        sx={{ width: 140 }}
        disabled={!canChange}
      >
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="staff">Staff</MenuItem>
        <MenuItem value="viewer">Viewer</MenuItem>
      </TextField>
      <Button
        variant="outlined"
        size="small"
        onClick={saveRole}
        disabled={!canChange || saving}
      >
        {saving ? 'Saving…' : 'Update'}
      </Button>
    </Stack>
  );
};

const UsersPage: React.FC = () => {
  const { hasRole, user: me } = useAuth();
  const isAdmin = hasRole('admin');

  const [rows, setRows] = useState<User[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (u) =>
        u.email.toLowerCase().includes(s) ||
        u.name.toLowerCase().includes(s) ||
        u.role.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchUsers();
      setRows(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cols: GridColDef<User>[] = [
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1.6, minWidth: 220 },
    {
      field: 'role',
      headerName: 'Role',
      width: 140,
      sortable: true,
      renderCell: (p: GridRenderCellParams<User>) => (
        <Chip size="small" color={roleColor[p.row.role]} label={p.row.role} />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 140,
      sortable: true,
      renderCell: (p: GridRenderCellParams<User>) =>
        p.row.createdAt ? dayjs(p.row.createdAt).format('DD MMM YYYY') : '-',
    },
  ];

  if (isAdmin) {
    cols.push({
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <RoleEditorCell row={params.row} meId={me?.id} onUpdated={load} />
      ),
    });
  }

  if (loading)
    return (
      <Box sx={{ p: 3, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (err)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{err}</Alert>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Users & Roles
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            size="small"
            placeholder="Search by name/email/role"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <Box sx={{ flex: 1 }} />
        {isAdmin && (
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Create User
          </Button>
        )}
      </Stack>

      <div style={{ height: 560, width: '100%' }}>
        <DataGrid<User>
          rows={filtered}
          columns={cols}
          getRowId={(r) => r.id}
          disableRowSelectionOnClick
          initialState={{
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
        />
      </div>

      <CreateUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={load}
      />
    </Box>
  );
};

export default UsersPage;
