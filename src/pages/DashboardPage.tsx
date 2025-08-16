import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
// import Box from '@mui/material/Box';
// import  from '@mui/material/Grid';
// import { fetchLowStock } from '../services/inventory';
import { fetchLowStock, fetchInventorySummary } from '../services/inventory';
import { fetchRecentMovements } from '../services/movements';
import StatCard from '../components/StatCard';
import RecentMovementsTable from '../components/RecentMovementsTable';
import LowStockTable from '../components/LowStockTable';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [summary, setSummary] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      console.log('[Dashboard] loading…'); // 👈 add this
      try {
        setLoading(true);
        setErr(null);
        const [sum, low, mov] = await Promise.all([
          fetchInventorySummary(),
          fetchLowStock(),
          fetchRecentMovements(10),
        ]);
        setSummary(sum);
        setLowStock(low);
        setRecent(mov);
      } catch (e: any) {
        console.error('[Dashboard] error:', e);
        setErr(e?.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalItems = useMemo(() => summary.length, [summary]);
  const totalQty = useMemo(
    () => summary.reduce((acc, i) => acc + (i.quantity ?? 0), 0),
    [summary]
  );
  const lowCount = useMemo(() => lowStock.length, [lowStock]);

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
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ paddingBottom: '1rem' }}
      >
        Welcome! Low stock widgets and recent movements will appear here.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'max-content',
          justifyContent: 'start',
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ maxWidth: '200px' }}>
          <StatCard title="Total Items" value={totalItems} hint="Unique SKUs" />
        </Box>
        <Box sx={{ maxWidth: '200px' }}>
          <StatCard
            title="Total Quantity"
            value={totalQty}
            hint="All stock combined"
          />
        </Box>
        <Box sx={{ maxWidth: '200px' }}>
          <StatCard
            title="Low Stock"
            value={lowCount}
            hint="At/below threshold"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          columnGap: '20px',
        }}
      >
        <Box sx={{ flex: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Recent Movements
          </Typography>
          <RecentMovementsTable rows={recent} />
        </Box>
        <Box sx={{ flex: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Low Stock Items
          </Typography>
          <LowStockTable rows={lowStock} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
