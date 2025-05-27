import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import './index.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ScamReportsProvider } from './contexts/ScamReportsContext';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ScamReportsProvider>
            <App />
          </ScamReportsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);