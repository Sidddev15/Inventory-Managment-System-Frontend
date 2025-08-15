import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

type ComponentRow = {
  component_item_id: number;
  quantity: number;
  code?: string;
  name?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  sku: string;
  name: string;
  components: ComponentRow[] | null | undefined;
};

const CompositeDetailsDialog: React.FC<Props> = ({
  open,
  onClose,
  sku,
  name,
  components,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ padding: '10px 15px', fontWeight: '600' }}>
        {sku} — {name}
      </DialogTitle>
      <DialogContent dividers sx={{ padding: '10px 15px' }}>
        {!components?.length ? (
          <Alert severity="warning">
            This kit currently has no components defined.
          </Alert>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 500,
                borderBottom: '2px dashed #ccc',
                maxWidth: '190px',
              }}
            >
              Unit Components
            </Typography>
            <List
              dense
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                height: '200px',
              }}
            >
              {components.map((c, idx) => (
                <ListItem
                  key={`${c.component_item_id}-${idx}`}
                  disableGutters
                  sx={{
                    // borderBottom: '1px solid #eee',
                    py: 0.2,
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: '#333',
                    },
                    '& .MuiListItemText-secondary': {
                      fontSize: '0.85rem',
                      color: '#666',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {`${c.code ?? `#${c.component_item_id}`} — ${
                          c.name ?? 'Item'
                        }`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {`Quantity per kit: ${c.quantity}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            margin: '0 auto',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompositeDetailsDialog;
