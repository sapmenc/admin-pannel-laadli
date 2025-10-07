import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// ✅ Import React Query setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ Create a query client instance
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
