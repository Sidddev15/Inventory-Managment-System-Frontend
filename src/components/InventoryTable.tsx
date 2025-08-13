// src/components/InventoryTable.tsx
import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { InventoryItem } from '../services/inventory';

type Props = {
  rows: InventoryItem[];
  loading?: boolean;
  page: number;
  pageSize: number;
  rowCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (row: InventoryItem) => void;
  onDelete: (row: InventoryItem) => void;
};

const makeColumns = (
  onEdit: Props['onEdit'],
  onDelete: Props['onDelete']
): GridColDef<InventoryItem>[] => [
  { field: 'code', headerName: 'Code', flex: 1, minWidth: 140, align: 'left' },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.2,
    minWidth: 160,
    align: 'left',
  },
  { field: 'size', headerName: 'Size', width: 120, align: 'left' },
  { field: 'quantity', headerName: 'Qty', width: 100, type: 'number' },
  { field: 'threshold', headerName: 'Threshold', width: 120, type: 'number' },
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
];

const InventoryTable: React.FC<Props> = ({
  rows,
  loading,
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const columns = React.useMemo(
    () => makeColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        pagination
        paginationMode="client"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={({ page, pageSize }) => {
          onPageChange(page);
          onPageSizeChange(pageSize);
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
        }}
      />
    </div>
  );
};

export default InventoryTable;
