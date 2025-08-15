import React, { useEffect, useState } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import RecentMovementsTable from '../components/RecentMovementsTable';
import MovementFilterBar from '../components/MovementFilterBar';
import MovementActionDrawer from '../components/MovementActionDrawer';
import { useAuth } from '../store/AuthContext';
import {
  fetchRecentMovements,
  fetchMovementsByDate,
  fetchMovementsByRange,
} from '../services/movements';

const MovementsPage: React.FC = () => {
  const { hasRole } = useAuth();

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Action drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>(
    'IN'
  );

  // Load default recent movements on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchRecentMovements(25); // default view
        setRows(data);
      } catch (e: any) {
        setErr(e?.response?.data?.error || 'Failed to load movements');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter handlers (kept from your version)
  const handleSearchDate = async (date: string) => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchMovementsByDate(date); // YYYY-MM-DD
      setRows(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRange = async (from: string, to: string) => {
    try {
      setLoading(true);
      setErr(null);
      // Convert to ISO with explicit times if backend expects ISO strings:
      const data = await fetchMovementsByRange(
        `${from}T00:00:00.000Z`,
        `${to}T23:59:59.999Z`
      );
      setRows(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Drawer controls
  const openDrawer = (mode: 'IN' | 'OUT' | 'ADJUSTMENT') => {
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  // After a successful action, reload the default recent list
  // (If you want to preserve current filters, we can add that later.)
  const refreshAfterAction = async () => {
    const data = await fetchRecentMovements(25);
    setRows(data);
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
        Inventory Movements
      </Typography>

      {/* Action buttons */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => openDrawer('IN')}
          disabled={!hasRole('admin', 'staff')}
        >
          Stock In
        </Button>
        <Button
          variant="outlined"
          onClick={() => openDrawer('OUT')}
          disabled={!hasRole('admin', 'staff')}
        >
          Stock Out
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => openDrawer('ADJUSTMENT')}
          disabled={!hasRole('admin')}
        >
          Adjust
        </Button>
        <Box sx={{ flex: 1 }} />
      </Stack>

      {/* Existing filters (date / range) */}
      <MovementFilterBar
        onSearchDate={handleSearchDate}
        onSearchRange={handleSearchRange}
      />

      {/* Results */}
      <RecentMovementsTable rows={rows} />

      {/* Action Drawer */}
      <MovementActionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        onSaved={refreshAfterAction}
      />
    </Box>
  );
};

export default MovementsPage;
