import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default', // ✅ theme-aware page background
          color: 'text.primary',
        }}
      >
        <Sidebar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <Box component="main" sx={{ p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
