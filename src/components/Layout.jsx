import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, RotateCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import styles from './Layout.module.css';

const PAGE_TITLES = {
  '/admin': 'Painel Admin',
  '/escalas': 'Escalas',
  '/perfil': 'Meu Perfil'
};

export function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname];
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      {isDesktop && <Sidebar />}
      <div className={styles.wrapper}>
        <header className={styles.topHeader}>
          {location.pathname === '/' ? (
            <h1 className={styles.greeting}>Olá, {user?.name?.split(' ')[0]}</h1>
          ) : (
            <h1 className={styles.greeting}>{pageTitle || ''}</h1>
          )}
          <div className={styles.headerActions}>
            <button 
              className={styles.reloadBtn} 
              onClick={() => window.location.reload()}
              title="Recarregar"
            >
              <RotateCw size={18} />
            </button>
            <Link to="/perfil" className={styles.profileLink}>
              <div className={styles.avatar}>
                <User size={18} />
              </div>
            </Link>
          </div>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}