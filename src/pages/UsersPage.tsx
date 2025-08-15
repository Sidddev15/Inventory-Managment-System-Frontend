import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  type ChipProps,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import { type User, fetchUsers } from '../services/users';
import { useAuth } from '../store/AuthContext';
import EditUserModal from '../components/EditUserModal';
import CreateUserModal from '../components/CreateUserModal';
import TableToolbar from '../components/TableToolbar';
import CenteredLoader from '../components/CenteredLoader';
// import EmptyState from '../components/EmptyState';

const roleColor: Record<User['role'], ChipProps['color']> = {
  admin: 'success',
  staff: 'info',
  viewer: 'warning',
};

const UsersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  const [rows, setRows] = useState<User[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const [density, setDensity] = useState<
    'compact' | 'standard' | 'comfortable'
  >('standard');

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (u) =>
        u.email.toLowerCase().includes(s) ||
        u.name.toLowerCase().includes(s) ||
        u.role.toLowerCase().includes(s) ||
        (u.status ?? '').toLowerCase().includes(s)
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

  const openEdit = (u: User) => {
    setSelected(u);
    setEditOpen(true);
  };

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
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: true,
      renderCell: (p: GridRenderCellParams<User>) => (
        <Chip size="small" label={p.row.status ?? 'active'} />
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
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (p: GridRenderCellParams<User>) => (
        <IconButton
          size="small"
          onClick={() => openEdit(p.row)}
          aria-label="Edit user"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    });
  }

  if (loading) return <CenteredLoader />;
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
        {/* <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            size="small"
            placeholder="Search by name/email/role/status"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ width: '20vw' }}
          />
        </form> */}
        <TableToolbar
          query={q}
          onQueryChange={setQ}
          density={density}
          onDensityChange={setDensity}
          placeholder="Search by name/email/role/status"
        />
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
          initialState={{
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
          density={density}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      {/* <EmptyState
        title="No users found"
        subtitle={
          q
            ? 'Try clearing your search.'
            : 'Invite your team to collaborate and manage inventory.'
        }
        actionText={isAdmin ? 'Create User' : undefined}
        onAction={isAdmin ? () => setOpenModal(true) : undefined}
      /> */}

      <CreateUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={load}
      />

      <EditUserModal
        open={editOpen}
        user={selected}
        onClose={() => setEditOpen(false)}
        onSaved={load}
        allowRoleChange={true}
      />
    </Box>
  );
};

export default UsersPage;
