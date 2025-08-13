import React, { useMemo } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from '@mui/x-data-grid';
import { IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { InventoryItem } from '../services/inventory';

type Props = {
  rows: InventoryItem[];
  loading?: boolean;
  page: number;
  pageSize: number;
  rowCount: number; // keep if you want the total count shown; for pure client mode it's fine to pass rows.length
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (row: InventoryItem) => void;
  onDelete: (row: InventoryItem) => void;
};

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
  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'code', headerName: 'Code', flex: 1, minWidth: 140 },
      { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 160 },
      { field: 'size', headerName: 'Size', width: 120 },
      { field: 'quantity', headerName: 'Qty', width: 100, type: 'number' },
      {
        field: 'threshold',
        headerName: 'Threshold',
        width: 120,
        type: 'number',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ height: '100%' }}
          >
            <IconButton
              size="small"
              onClick={() => onEdit(params.row as InventoryItem)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row as InventoryItem)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    // model = { page, pageSize }
    if (model.page !== page) onPageChange(model.page);
    if (model.pageSize !== pageSize) onPageSizeChange(model.pageSize);
  };

  return (
    <div style={{ height: '73vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        pagination
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="client"
        rowCount={rowCount} // for client-side this can be rows.length
        initialState={{
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
        }}
      />
    </div>
  );
};

export default InventoryTable;
