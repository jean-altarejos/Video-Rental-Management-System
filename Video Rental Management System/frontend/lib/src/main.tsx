// src/main.tsx
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App' 
import './index.css'

// 1. Initialize React Query Client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive auto-refetching during dev
      retry: 1,                    // Number of retries on API failure
      staleTime: 1000 * 60 * 5,    // Cache data for 5 minutes
    },
  },
});

// 2. Mount React application
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
}