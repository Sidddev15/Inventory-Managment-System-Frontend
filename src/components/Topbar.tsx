import React from 'react';
import { useAuth } from '../store/AuthContext';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ThemeModeToggle from '../components/ThemeModeToggle';

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      // Make AppBar look like a themed paper strip with a divider bottom
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (t) => t.zIndex.drawer + 1, // above sidebar
      }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 56 }}
      >
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Corporate Inventory
        </Typography>

        {/* Right controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Notifications">
            <IconButton aria-label="notifications">
              <Badge color="error" variant="dot" overlap="circular">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <ThemeModeToggle />

          <Tooltip title={user?.email || 'Account'}>
            <IconButton
              aria-label="account menu"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ ml: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            // Ensure the menu paper inherits themed background/text
            slotProps={{
              paper: {
                sx: {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                },
              },
            }}
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem disabled>Role: {user?.role}</MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
