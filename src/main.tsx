import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ProtocoloProvider } from './context/ProtocoloContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtocoloProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProtocoloProvider>
  </StrictMode>,
);
