import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import DemoDay from './DemoDay.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const isDemoDay = path === '/demo-day';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemoDay ? <DemoDay /> : <App />}
  </StrictMode>,
);
