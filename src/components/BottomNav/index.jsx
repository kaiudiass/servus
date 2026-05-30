import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const { isAdmin } = useAuth();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
        <Home size={22} />
        <span className={styles.label}>Início</span>
      </NavLink>
      <NavLink to="/escalas" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
        <ClipboardList size={22} />
        <span className={styles.label}>Escalas</span>
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
          <Settings size={22} />
          <span className={styles.label}>Admin</span>
        </NavLink>
      )}
    </nav>
  );
}