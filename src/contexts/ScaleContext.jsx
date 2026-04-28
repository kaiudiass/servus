import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { scaleService } from '../services/scaleService';
import { sectorService } from '../services/sectorService';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

const ScaleContext = createContext(null);

export function ScaleProvider({ children }) {
  const [scales, setScales] = useState([]);
  const [upcomingScales, setUpcomingScales] = useState([]);
  const [historyScales, setHistoryScales] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, user, loading: authLoading } = useAuth();

  const loadInitialData = useCallback(async (isAdminUser) => {
    try {
      setLoading(true);
      
      const promises = [
        scaleService.getScales(),
        sectorService.getSectors()
      ];

      if (isAdminUser) {
        promises.push(userService.getUsers());
      }

      const results = await Promise.allSettled(promises);
      
      if (results[0].status === 'fulfilled') {
        setScales(results[0].value.data.data || []);
      }
      
      if (results[1].status === 'fulfilled') {
        setSectors(results[1].value.data.data || []);
      }

      if (isAdminUser && results[2]?.status === 'fulfilled') {
        setUsers(results[2].value.data.data || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadInitialData(isAdmin);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [loadInitialData, isAdmin, user, authLoading]);

  const getScaleById = (id) => scales.find(s => s.id === id);

  const getScalesByDate = (date) => scales.filter(s => s.date === date);

  const fetchUpcoming = async (onlyMine = false) => {
    try {
      const response = await scaleService.getUpcomingScales(onlyMine);
      setUpcomingScales(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar escalas próximas', error);
    }
  };

  const fetchHistory = async (onlyMine = false) => {
    try {
      const response = await scaleService.getHistoryScales(onlyMine);
      setHistoryScales(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico', error);
    }
  };

  const createScale = async (scaleData) => {
    try {
      const response = await scaleService.createScale(scaleData);
      const newScale = response.data.data;
      setScales(prev => [newScale, ...prev]);
      return newScale;
    } catch (error) {
      console.error('Erro ao criar escala', error);
      return null;
    }
  };

  const copyScale = async (sourceId, newDate, newDay) => {
    try {
      const response = await scaleService.copyScale(sourceId, { newDate, newDay });
      const newScale = response.data.data;
      setScales(prev => [newScale, ...prev]);
      return newScale;
    } catch (error) {
      console.error('Erro ao copiar escala', error);
      return null;
    }
  };

  const updateScale = async (id, updates) => {
    try {
      const response = await scaleService.updateScale(id, updates);
      const updated = response.data.data;
      setScales(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar escala', error);
      return null;
    }
  };

  const updateScaleSector = async (scaleId, sectorId, names) => {
    try {
      const response = await scaleService.updateScaleSector(scaleId, sectorId, names);
      const updated = response.data.data;
      setScales(prev => prev.map(s => s.id === scaleId ? updated : s));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar setor da escala', error);
      return null;
    }
  };

  const deleteScale = async (id) => {
    try {
      await scaleService.deleteScale(id);
      setScales(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar escala', error);
      return false;
    }
  };

  const createSector = async ({ name, description }) => {
    try {
      const response = await sectorService.createSector({ name, description });
      const newSector = response.data.data;
      setSectors(prev => [...prev, newSector]);
      return newSector;
    } catch (error) {
      console.error('Erro ao criar setor', error);
      return null;
    }
  };

  const deleteSector = async (id) => {
    try {
      await sectorService.deleteSector(id);
      setSectors(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar setor', error);
      return false;
    }
  };

  const updateSector = async (id, updates) => {
    try {
      const response = await sectorService.updateSector(id, updates);
      const updated = response.data.data;
      setSectors(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar setor', error);
      return null;
    }
  };

  const updateSectorMembers = async (sectorId, newUserIds) => {
    try {
      await sectorService.updateMembers(sectorId, newUserIds);
      setUsers(prev => prev.map(user => {
        const hasSector = user.sectors?.includes(sectorId);
        const shouldHaveSector = newUserIds.includes(user.id);

        if (hasSector && !shouldHaveSector) {
          return { ...user, sectors: user.sectors.filter(id => id !== sectorId) };
        }
        if (!hasSector && shouldHaveSector) {
          return { ...user, sectors: [...(user.sectors || []), sectorId] };
        }
        return user;
      }));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar membros', error);
      return false;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const response = await userService.updateUser(id, updates);
      const updated = response.data.data;
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar usuário', error);
      return null;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      return false;
    }
  };

  const deleteScaleUser = async (scaleId, userId) => {
    try {
      await scaleService.deleteScaleUser(scaleId, userId);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário da escala', error);
      return false;
    }
  };

  return (
    <ScaleContext.Provider value={{
      scales,
      upcomingScales,
      historyScales,
      sectors,
      users,
      loading,
      getScaleById,
      getScalesByDate,
      fetchUpcoming,
      fetchHistory,
      createScale,
      copyScale,
      updateScale,
      updateScaleSector,
      deleteScale,
      createSector,
      deleteSector,
      updateSector,
      updateSectorMembers,
      updateUser,
      deleteUser,
      deleteScaleUser,
    }}>
      {children}
    </ScaleContext.Provider>
  );
}

export function useScale() {
  const context = useContext(ScaleContext);
  if (!context) throw new Error('useScale must be used within ScaleProvider');
  return context;
}