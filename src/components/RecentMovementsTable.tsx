import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import dayjs from 'dayjs';
import type { Movement } from '../services/movements';

const typeColor: Record<
  Movement['type'],
  'default' | 'success' | 'error' | 'warning'
> = {
  IN: 'success',
  OUT: 'error',
  ADJUSTMENT: 'warning',
};

const RecentMovementsTable: React.FC<{ rows: Movement[] }> = ({
  rows = [],
}) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ref</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Before → After</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>When</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>
                <Chip size="small" color={typeColor[r.type]} label={r.type} />
              </TableCell>
              <TableCell align="left">{r.quantity}</TableCell>
              <TableCell align="left">{r.reason || '-'}</TableCell>
              <TableCell align="left">{r.reference_no || '-'}</TableCell>
              <TableCell align="left">
                {r.before_quantity ?? '-'}
                {' → '}
                {r.after_quantity ?? '-'}
              </TableCell>
              <TableCell align="left">
                {dayjs(r.createdAt).format('DD MMM, HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentMovementsTable;
