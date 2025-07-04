import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './fontawesome.ts';
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GlobalAppProvider } from './context/GlobalAppContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <GlobalAppProvider>
                    <App />
                </GlobalAppProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
