import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. Import qiling
import './index.css'; // Tailwind yoki asosiy CSS faylingiz
import App from './App/App';

// 2. QueryClient yarating
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Oyna fokuslanganda avtomatik so'rov yubormaslik
      retry: 1, // Xatolik bo'lganda 1 marta qayta urinish
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Ilovani QueryClientProvider ichiga oling */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);