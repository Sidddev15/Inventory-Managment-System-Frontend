import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useAuth } from '../store/AuthContext';

const nav = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
  { label: 'Inventory', icon: <Inventory2Icon />, to: '/inventory' },
  { label: 'Item Groups', icon: <CategoryIcon />, to: '/item-groups' },
  { label: 'Movements', icon: <ReceiptLongIcon />, to: '/movements' },
  { label: 'Composite Items', icon: <ViewWeekIcon />, to: '/composite-items' },
  { label: 'Price Lists', icon: <PriceChangeIcon />, to: '/price-lists' },
  { label: 'Users', icon: <PeopleIcon />, to: '/users' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { hasRole } = useAuth();

  const visibleNav = nav.filter((item) => {
    if (item.to === '/users') return hasRole('admin');
    return true;
  });

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: 'background.paper', // 🎯 theme-aware
        borderRight: 1, // 1px + theme.divider color
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        height: '100vh',
        color: 'text.primary', // 🎯 theme-aware text color
      }}
    >
      <Box
        sx={{
          padding: '19px 10px 19px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'text.primary' }}
        >
          EEC
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Inventory System
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* {nav.map((item) => (
          <ListItemButton
            key={item.to}
            selected={pathname.startsWith(item.to)}
            onClick={() => navigate(item.to)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))} */}
        {visibleNav.map((item) => (
          <ListItemButton
            key={item.to}
            selected={pathname.startsWith(item.to)}
            onClick={() => navigate(item.to)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
