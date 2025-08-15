import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  type PriceListItem,
  fetchPriceListDetail,
} from '../services/pricelist';
import PriceListItemAdder from '../components/PriceListItemAdder';
import PriceListItemsTable from '../components/PriceListItemsTable';

const PriceListDetailPage: React.FC = () => {
  const { id } = useParams();
  const listId = Number(id);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState('Price List');
  const [items, setItems] = useState<PriceListItem[]>([]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchPriceListDetail(listId);
      setTitle(data.name);
      // Optionally enrich with code/name from backend response; we’ll accept what we get
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to load price list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [listId]);

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
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add items to this price list, set prices, and keep it ready for
        quotes/orders.
      </Typography>

      <PriceListItemAdder priceListId={listId} onAdded={load} />

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Items in this price list
        </Typography>
        <PriceListItemsTable
          rows={items}
          onChanged={load}
          enableInlineUpdate={false /* set true if you add PUT endpoint */}
          enableDelete={false /* set true if you add DELETE endpoint */}
        />
      </Stack>
    </Box>
  );
};

export default PriceListDetailPage;
