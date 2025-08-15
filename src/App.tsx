import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import InventoryPage from './pages/InventoryPage';
import ItemGroupsPage from './pages/ItemGroupsPage';
import CompositeItemsPage from './pages/CompositeItemsPage';
import PriceListsPage from './pages/PriceListsPage';
import UsersPage from './pages/UsersPage';
import MovementsPage from './pages/MovementsPage';
import PriceListDetailPage from './pages/PriceListDetailPage';
import AppErrorBoundary from './components/AppErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <AppLayout>
                <InventoryPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/item-groups"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ItemGroupsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/movements"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MovementsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/composite-items"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CompositeItemsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-lists"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PriceListsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-lists/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PriceListDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <UsersPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" newestOnTop closeOnClick />
    </AppErrorBoundary>
  );
}

export default App;
