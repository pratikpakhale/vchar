import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { MyProvider } from '../src/pages/utils/SideBarContext.tsx';
import { ThemeProvider } from './components/theme-povider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MyProvider>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </MyProvider>
);
