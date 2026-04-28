import { AlertCircle, Bell } from 'lucide-react';
import styles from './NoticeCard.module.css';

export function NoticeCard({ notice }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={`${styles.card} ${styles[notice.priority]}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {notice.priority === 'high' ? <AlertCircle size={16} /> : <Bell size={16} />}
          <span className={styles.title}>{notice.title}</span>
        </div>
        <span className={styles.date}>{formatDate(notice.date)}</span>
      </div>
      <p className={styles.description}>{notice.description}</p>
    </div>
  );
}