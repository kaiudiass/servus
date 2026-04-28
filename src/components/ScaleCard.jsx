import { Calendar, Clock } from 'lucide-react';
import styles from './ScaleCard.module.css';

const SECTOR_NAMES = {
  direcao: 'Direção de Culto',
  introducao: 'Introdução',
  recepcao: 'Recepção',
  intercessao: 'Intercessão',
  louvor: 'Louvor',
  palavra: 'Palavra Pastoral',
  midia: 'Mídia',
  map: 'MAP',
  kids: 'Kids',
  zeladoria: 'Zeladoria',
};

export function ScaleCard({ scale, onPress, compact, showActions }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const dayLabel = {
    sabado: 'Sábado',
    domingo: 'Domingo',
    quarta: 'Quarta-feira',
  }[scale.day] || scale.day;

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`} onClick={onPress}>
      <div className={styles.header}>
        <div className={styles.dateBlock}>
          <span className={styles.day}>{dayLabel}</span>
          <span className={styles.date}>
            <Calendar size={12} />
            {formatDate(scale.date)}
          </span>
        </div>
        <div className={styles.timeBlock}>
          <Clock size={12} />
          <span className={styles.time}>{scale.time}</span>
        </div>
      </div>
      {!compact && (
        <div className={styles.sectors}>
          {Object.entries(scale.sectors).map(([key, names]) => (
            names.length > 0 && (
              <div key={key} className={styles.sectorSquare}>
                <span className={styles.sectorRole}>{SECTOR_NAMES[key] || key}</span>
                <span className={styles.sectorNames}>{names.join(', ')}</span>
              </div>
            )
          ))}
        </div>
      )}
      {scale.obs && !compact && <div className={styles.obs}>{scale.obs}</div>}
    </div>
  );
}