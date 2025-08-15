import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import InventoryTable from '../components/InventoryTable';
import GroupSelector from '../components/GroupSelector';
import {
  fetchInventory,
  fetchItemGroups,
  deleteInventoryItem,
  type InventoryItem,
  type ItemGroup,
} from '../services/inventory';
import { useAuth } from '../store/AuthContext';
import ItemDrawer from '../components/ItemDrawer';

const InventoryPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [rows, setRows] = useState<InventoryItem[]>([]);
  const [groups, setGroups] = useState<ItemGroup[]>([]);
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  // pagination (client-side for now)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const pagedRows = useMemo(() => {
    const start = page * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const [gs, items] = await Promise.all([
        fetchItemGroups(),
        fetchInventory(groupFilter === 'all' ? {} : { group_id: groupFilter }),
      ]);
      setGroups(gs);
      // naive client search by code/name
      const filtered = q
        ? items.filter(
            (i) =>
              i.code?.toLowerCase().includes(q.toLowerCase()) ||
              i.name?.toLowerCase().includes(q.toLowerCase())
          )
        : items;
      setRows(filtered);
      setPage(0);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupFilter]); // reload when group changes

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await load();
  };

  const onAdd = () => {
    setSelected(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const onEdit = (row: InventoryItem) => {
    setSelected(row);
    setDrawerMode('edit');
    setDrawerOpen(true);
    // alert(`Edit will open in a drawer (next commit). Item: ${row.code}`);
  };

  const onDelete = async (row: InventoryItem) => {
    if (!hasRole('admin')) return alert('Only admins can delete items');
    if (!confirm(`Delete ${row.name}? This cannot be undone.`)) return;
    try {
      await deleteInventoryItem(row.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Delete failed');
    }
  };

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
        Inventory
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <form onSubmit={onSearch} style={{ display: 'flex', gap: 8 }}>
          <TextField
            size="small"
            placeholder="Search by code or name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ width: '20vw' }}
          />
          <Button type="submit" variant="outlined">
            Search
          </Button>
        </form>

        <GroupSelector
          groups={groups}
          value={groupFilter}
          onChange={(val) => setGroupFilter(val)}
        />

        <Box sx={{ flex: 1 }} />

        <Button variant="contained" onClick={onAdd}>
          Add Item
        </Button>
      </Stack>

      <InventoryTable
        rows={pagedRows}
        loading={false}
        page={page}
        pageSize={pageSize}
        rowCount={rows.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ItemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        groups={groups}
        initial={selected}
        onSaved={load}
      />
    </Box>
  );
};

export default InventoryPage;
