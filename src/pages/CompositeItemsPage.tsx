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
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import CompositeItemDrawer from '../components/CompositeItemDrawer';
import StockOutCompositeDrawer from '../components/StockOutCompositeDrawer';
import {
  fetchCompositeItems,
  fetchCompositeItem,
  type CompositeItem,
} from '../services/composite';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CompositeDetailsDialog from '../components/CompositeDetailsDialog';

type Row = CompositeItem & {
  description?: string;
  _components?: Array<{ component_item_id: number; quantity: number }>;
};

const CompositeItemsPage: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsSku, setDetailsSku] = useState('');
  const [detailsName, setDetailsName] = useState('');
  const [detailsComponents, setDetailsComponents] = useState<any[] | null>(
    null
  );

  // Create drawer
  const [createOpen, setCreateOpen] = useState(false);

  // Stock out drawer
  const [stockOutOpen, setStockOutOpen] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);

  // 👇 Load data and setRows (this was missing)
  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchCompositeItems(); // must return an array
      setRows(data || []); // 👈 now rows is actually used
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load composite items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // client filter
  const filteredRows = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(s) ||
        (r.sku || '').toLowerCase().includes(s) ||
        (r.description || '').toLowerCase().includes(s)
    );
  }, [rows, q]);

  const onCreated = async () => {
    await load();
  };

  const onOpenStockOut = async (row: Row) => {
    try {
      const detail = await fetchCompositeItem(row.id); // includes components
      setSelected({ ...row, _components: detail?.components ?? [] });
    } catch {
      setSelected(row);
    }
    setStockOutOpen(true);
  };

  const onOpenDetails = async (row: Row) => {
    try {
      const detail = await fetchCompositeItem(row.id);
      setDetailsSku(row.sku);
      setDetailsName(row.name);
      setDetailsComponents(detail?.components ?? []);
      setDetailsOpen(true);
    } catch {
      setDetailsSku(row.sku);
      setDetailsName(row.name);
      setDetailsComponents(null);
      setDetailsOpen(true);
    }
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', minWidth: 140, flex: 1 },
    { field: 'name', headerName: 'Name', minWidth: 180, flex: 1.2 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 1.4,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 270,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ height: '100%' }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<InfoOutlinedIcon fontSize="small" />}
            onClick={() => onOpenDetails(params.row)}
            sx={{ padding: '5px' }}
          >
            Details
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RemoveShoppingCartIcon fontSize="small" />}
            onClick={() => onOpenStockOut(params.row)}
          >
            Stock Out
          </Button>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{err}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Composite Items (Kits)
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: 'flex', gap: 8 }}
        >
          <TextField
            size="small"
            placeholder="Search by name/SKU/description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ width: '20vw' }}
          />
        </form>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Kit
        </Button>
      </Stack>

      <div style={{ height: '73vh', width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(r) => r.id}
          initialState={{
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          // Provide handlers to action buttons inside renderCell
          // @ts-expect-error
          apiRefPropCallback={(api: any) => {
            (api as any).__onStockOut = onOpenStockOut;
          }}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      <CompositeItemDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={onCreated}
      />

      <StockOutCompositeDrawer
        open={stockOutOpen}
        onClose={() => setStockOutOpen(false)}
        compositeId={selected?.id ?? null}
        compositeLabel={
          selected ? `${selected.sku} — ${selected.name}` : undefined
        }
        onSaved={async () => {}}
      />

      <CompositeDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        sku={detailsSku}
        name={detailsName}
        components={detailsComponents}
      />
    </Box>
  );
};

export default CompositeItemsPage;
