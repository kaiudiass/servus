import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Clock, X, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScale } from '../contexts/ScaleContext';
import { ScaleCard } from '../components/ScaleCard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import styles from './Scales.module.css';

export function Scales() {
  const { upcomingScales, historyScales, fetchUpcoming, fetchHistory, sectors } = useScale();
  const { user } = useAuth();
  const [view, setView] = useState('upcoming'); // upcoming, past
  const [onlyMine, setOnlyMine] = useState(false);
  const [selectedScale, setSelectedScale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (view === 'upcoming') {
      fetchUpcoming(onlyMine);
    } else {
      fetchHistory(onlyMine);
    }
    setCurrentPage(1);
  }, [view, onlyMine]);

  const currentScales = view === 'upcoming' ? upcomingScales : historyScales;

  useEffect(() => {
    setCurrentPage(1);
  }, [view, onlyMine, user?.name]);

  const paginatedScales = currentScales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleNotifyCant = () => {
    alert('Notificação enviada aos administradores.');
    setSelectedScale(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.viewTabs}>
          <button
            className={`${styles.viewTab} ${view === 'upcoming' ? styles.active : ''}`}
            onClick={() => setView('upcoming')}
          >
            Próximas
          </button>
          <button
            className={`${styles.viewTab} ${view === 'past' ? styles.active : ''}`}
            onClick={() => setView('past')}
          >
            Passadas
          </button>
        </div>

        <button 
          className={`${styles.mineToggle} ${onlyMine ? styles.active : ''}`}
          onClick={() => setOnlyMine(!onlyMine)}
        >
          <div className={styles.toggleDot} />
          <span>Apenas as minhas</span>
        </button>
      </div>

      <div className={styles.grid}>
        {paginatedScales.length > 0 ? (
          paginatedScales.map(scale => (
            <ScaleCard
              key={scale.id}
              scale={scale}
              onPress={() => setSelectedScale(scale)}
              compact={true}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={40} />
            <p>Nenhuma escala encontrada nesta categoria.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={currentScales.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={!!selectedScale}
        onClose={() => setSelectedScale(null)}
        title="Detalhes da Escala"
        size="lg"
      >
        {selectedScale && (
          <div className={styles.detailContent}>
            <div className={styles.detailHeader}>
              <div className={styles.detailDateInfo}>
                <span className={styles.detailDay}>{selectedScale.day}</span>
                <span className={styles.detailDate}>{formatDate(selectedScale.date)}</span>
                <span className={styles.detailTime}>
                  <Clock size={14} />
                  {selectedScale.time}
                </span>
              </div>
            </div>

            <div className={styles.sectorsGrid}>
              {sectors.map(sector => {
                const names = selectedScale.sectors[sector.id] || [];
                if (names.length === 0) return null;
                return (
                  <div key={sector.id} className={styles.sectorViewCard}>
                    <span className={styles.sectorLabel}>
                      <Users size={12} />
                      {sector.name}
                    </span>
                    <span className={styles.sectorNames}>{names.join(', ')}</span>
                  </div>
                );
              })}
            </div>

            {selectedScale.obs && (
              <div className={styles.obsNote}>
                <AlertCircle size={16} />
                <span>{selectedScale.obs}</span>
              </div>
            )}

            <div className={styles.detailActions}>
              <Button variant="secondary" fullWidth onClick={handleNotifyCant}>
                Avisar que não dá
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}