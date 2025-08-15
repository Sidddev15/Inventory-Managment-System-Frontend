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
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import {
  type PriceList,
  fetchPriceLists,
  createPriceList,
} from '../services/pricelist';
import { useNavigate } from 'react-router-dom';

const cols: GridColDef[] = [
  { field: 'name', headerName: 'Price List', flex: 1.2, minWidth: 220 },
  {
    field: 'valid_from',
    headerName: 'Valid From',
    width: 140,
    valueFormatter: (value) =>
      value ? dayjs(String(value)).format('DD MMM YYYY') : '-',
  },
  {
    field: 'valid_to',
    headerName: 'Valid To',
    width: 140,
    valueFormatter: (value) =>
      value ? dayjs(String(value)).format('DD MMM YYYY') : '-',
  },
  { field: 'description', headerName: 'Description', flex: 1.4, minWidth: 240 },
];

const PriceListsPage: React.FC = () => {
  const nav = useNavigate();
  const [rows, setRows] = useState<PriceList[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.description?.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchPriceLists();
      setRows(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load price lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    const name = prompt('Name of the price list?');
    if (!name) return;
    const valid_from =
      prompt('Valid from (YYYY-MM-DD) (optional)') || undefined;
    const valid_to = prompt('Valid to (YYYY-MM-DD) (optional)') || undefined;
    const description = prompt('Description (optional)') || undefined;
    await createPriceList({ name, valid_from, valid_to, description });
    await load();
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
        Price Lists
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            size="small"
            placeholder="Search by name/description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" onClick={onCreate}>
          Create Price List
        </Button>
      </Stack>

      <div style={{ height: '73vh', width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={cols}
          getRowId={(r) => r.id}
          onRowDoubleClick={(params) => nav(`/price-lists/${params.id}`)}
          initialState={{
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
        />
      </div>
    </Box>
  );
};

export default PriceListsPage;
