import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  type ItemGroup,
  fetchItemGroups,
  deleteItemGroup,
} from '../services/inventory';
import { useAuth } from '../store/AuthContext';
import ItemGroupModal from '../components/ItemGroupModal';

const ItemGroupsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [rows, setRows] = useState<ItemGroup[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // pagination (client-side)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<ItemGroup | null>(null);

  const filteredRows = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (g) =>
        g.name.toLowerCase().includes(s) ||
        g.description?.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const pagedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchItemGroups();
      setRows(data);
      setPage(0);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load item groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAdd = () => {
    setSelected(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const onEdit = (row: ItemGroup) => {
    setSelected(row);
    setModalMode('edit');
    setModalOpen(true);
  };

  const onDelete = async (row: ItemGroup) => {
    if (!hasRole('admin')) return alert('Only admins can delete groups');
    if (!confirm(`Delete group "${row.name}"?`)) return;
    try {
      await deleteItemGroup(row.id);
      await load();
    } catch (e: any) {
      const msg =
        e?.response?.status === 409
          ? e?.response?.data?.message
          : e?.response?.data?.error || 'Delete failed';
      alert(msg);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Group Name', flex: 1.2, minWidth: 200 },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.6,
        minWidth: 240,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ height: '100%' }}
          >
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [onEdit, onDelete]
  );

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
        Item Groups
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); /* client-side filter already applied */
          }}
        >
          <TextField
            size="small"
            placeholder="Search group by name/description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ width: '20vw' }}
          />
        </form>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" onClick={onAdd}>
          Add Group
        </Button>
      </Stack>

      <div style={{ height: '73vh', width: '100%' }}>
        <DataGrid
          rows={pagedRows}
          columns={columns}
          getRowId={(r) => r.id}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
          initialState={{
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      <ItemGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initial={selected}
        onSaved={load}
      />
    </Box>
  );
};

export default ItemGroupsPage;
