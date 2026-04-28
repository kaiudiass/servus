import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScaleProvider } from './contexts/ScaleContext';
import { NoticeProvider } from './contexts/NoticeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Scales } from './pages/Scales';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScaleProvider>
          <NoticeProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Register />} />
              <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/escalas" element={<ProtectedRoute><Scales /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NoticeProvider>
        </ScaleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}