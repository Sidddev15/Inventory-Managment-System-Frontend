import React, { useEffect, useState } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import RecentMovementsTable from '../components/RecentMovementsTable';
import MovementFilterBar from '../components/MovementFilterBar';
import {
  fetchRecentMovements,
  fetchMovementsByDate,
  fetchMovementsByRange,
} from '../services/movements';

const MovementsPage: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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
      <MovementFilterBar
        onSearchDate={handleSearchDate}
        onSearchRange={handleSearchRange}
      />
      <RecentMovementsTable rows={rows} />
    </Box>
  );
};

export default MovementsPage;
