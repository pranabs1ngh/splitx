import { StrictMode } from '/node_modules/react/index.js';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Update document title
document.title = 'AppSplitting - Split Expenses with Friends';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);