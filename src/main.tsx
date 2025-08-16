import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext.tsx';
import { ThemeProviderWithMode } from './theme/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProviderWithMode>
          <App />
        </ThemeProviderWithMode>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
