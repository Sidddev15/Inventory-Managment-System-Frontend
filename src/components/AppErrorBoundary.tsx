import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type State = { hasError: boolean; error?: any };

export default class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: any, errorInfo: any) {
    // hook your logger here (Sentry, etc.)
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 4,
            display: 'grid',
            placeItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Box sx={{ maxWidth: 560, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              An unexpected error occurred. You can try reloading the page.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Reload
            </Button>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}
