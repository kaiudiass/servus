import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, Settings, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

import logoImg from '../../assets/servusLogo.png';

export function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logoImg} alt="Servus" className={styles.logoImg} />
        <span className={styles.logoSubtitle}>Gerenciamento de escala</span>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
          <Home size={20} />
          <span>Início</span>
        </NavLink>
        <NavLink to="/escalas" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
          <ClipboardList size={20} />
          <span>Escalas</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
            <Settings size={20} />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
}