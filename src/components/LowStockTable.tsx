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

type Item = {
  id: number;
  name: string;
  code: string;
  quantity: number;
  threshold?: number;
  size?: string;
};

const LowStockTable: React.FC<{ rows: Item[] }> = ({ rows = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Code
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Qty
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Threshold
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Flag
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell align="left">{r.code}</TableCell>
              <TableCell align="left">{r.name}</TableCell>
              <TableCell align="left">{r.quantity}</TableCell>
              <TableCell align="left">{r.threshold ?? '-'}</TableCell>
              <TableCell align="left">
                <Chip
                  size="small"
                  label={r.quantity <= (r.threshold ?? 10) ? 'LOW' : 'OK'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LowStockTable;
