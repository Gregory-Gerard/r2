import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@r2/ui/index.css';
import { App } from './app.tsx';

createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
