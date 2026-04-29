import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { noticeService } from '../services/noticeService';
import { useAuth } from './AuthContext';

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const location = useLocation();
  const [adminNotices, setAdminNotices] = useState([]);
  const [userNotices, setUserNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadNotices = useCallback(async () => {
    try {
      const [adminRes, userRes] = await Promise.all([
        noticeService.getAllNotices(),
        noticeService.getUserNotices()
      ]);
      setAdminNotices(adminRes.data.data || []);
      setUserNotices(userRes.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar avisos', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadNotices();
    }
  }, [loadNotices, user, location.pathname]);

  const getActiveNotices = useCallback(() => {
    return userNotices;
  }, [userNotices]);

  const createNotice = async (noticeData) => {
    try {
      const response = await noticeService.createNotice(noticeData);
      const newNotice = response.data.data;
      setAdminNotices(prev => [newNotice, ...prev]);
      return newNotice;
    } catch (error) {
      console.error('Erro ao criar aviso', error);
      return null;
    }
  };

  const updateNotice = async (id, updates) => {
    try {
      const response = await noticeService.updateNotice(id, updates);
      const updated = response.data.data;
      setAdminNotices(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar aviso', error);
      return null;
    }
  };

  const deleteNotice = async (id) => {
    try {
      await noticeService.deleteNotice(id);
      setAdminNotices(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar aviso', error);
      return false;
    }
  };

  return (
    <NoticeContext.Provider value={{
      notices: adminNotices,
      userNotices,
      loading,
      getActiveNotices,
      createNotice,
      updateNotice,
      deleteNotice
    }}>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotice must be used within NoticeProvider');
  return context;
}