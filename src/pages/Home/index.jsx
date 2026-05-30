import { useState, useEffect } from 'react';
import { Bell, Calendar, AlertCircle, Clock, X, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useScale } from '../../contexts/ScaleContext';
import { useNotice } from '../../contexts/NoticeContext';
import { NoticeCard } from '../../components/NoticeCard';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import styles from './Home.module.css';

export function Home() {
  const { user } = useAuth();
  const { upcomingScales, fetchUpcoming, sectors } = useScale();
  const { getActiveNotices } = useNotice();

  const notices = getActiveNotices(user);
  
  usePushNotifications();
  
  useEffect(() => {
    fetchUpcoming(true); 
  }, []);

  const myScales = upcomingScales;
  const [selectedScale, setSelectedScale] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleNotifyCant = () => {
    if (!selectedScale) return;
    
    const formattedDate = formatDate(selectedScale.date);
    const message = `Olá, infelizmente não vou conseguir fazer parte: ${formattedDate} às ${selectedScale.time}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5533998774422&text=${encodeURIComponent(message)}`;
    
    window.location.href = whatsappUrl;
    setSelectedScale(null);
  };

  return (
    <div className={styles.container}>
      {notices.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Bell size={18} />
            Avisos Gerais
          </h2>
          <div className={styles.noticeGrid}>
            {notices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Calendar size={18} />
          Minhas Escalas
        </h2>
        {myScales.length > 0 ? (
          <div className={styles.grid}>
            {myScales.map(scale => (
              <div key={scale.id} className={styles.scaleCard} onClick={() => setSelectedScale(scale)}>
                <div className={styles.scaleHeader}>
                  <div className={styles.scaleDateInfo}>
                    <span className={styles.scaleDay}>{scale.day}</span>
                    <span className={styles.scaleDate}>{formatDate(scale.date).split(',')[1]}</span>
                  </div>
                  <div className={styles.scaleTime}>
                    <Clock size={14} />
                    {scale.time}
                  </div>
                </div>
                {scale.obs && (
                  <div className={styles.scaleNotice}>
                    <AlertCircle size={14} />
                    <span>{scale.obs}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <p>Nenhuma escala encontrada para você.</p>
          </div>
        )}
      </section>

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

            {selectedScale && Object.values(selectedScale.sectors).some(names => names.includes(user?.name)) && (
              <div className={styles.detailActions}>
                <Button variant="secondary" fullWidth onClick={handleNotifyCant}>
                  Avisar que não dá
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}