import { LogOut, User, Phone, Pencil, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useScale } from '../contexts/ScaleContext';
import { Button } from '../components/Button';
import styles from './Profile.module.css';

export function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const { sectors, updateUser } = useScale();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    sectorIds: user?.sectors || []
  });

  const handleUpdate = async () => {
    const success = await updateUser(user.id, formData);
    if (success) {
      await refreshUser();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      sectorIds: user?.sectors || []
    });
    setIsEditing(false);
  };

  const toggleSector = (id) => {
    setFormData(prev => ({
      ...prev,
      sectorIds: prev.sectorIds.includes(id)
        ? prev.sectorIds.filter(sid => sid !== id)
        : [...prev.sectorIds, id]
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Deseja sair?')) {
      logout();
    }
  };

  const userSectorsNames = sectors
    .filter(s => user?.sectors?.includes(s.id))
    .map(s => s.name);

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <User size={32} />
          </div>
          <div className={styles.mainInfo}>
            {isEditing ? (
              <div className={styles.editHeaderFields}>
                <input
                  className={styles.editInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                />
                <input
                  className={styles.editInput}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Seu e-mail"
                />
              </div>
            ) : (
              <>
                <h1 className={styles.name}>{user?.name}</h1>
                <span className={styles.email}>{user?.email}</span>
              </>
            )}
          </div>
          <button 
            className={styles.editToggle}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          >
            {isEditing ? <X size={20} /> : <Pencil size={20} />}
          </button>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Telefone</span>
            {isEditing ? (
              <input
                className={styles.editInput}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            ) : (
              <span className={styles.infoValue}>
                {user?.phone || 'Não informado'}
              </span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Função</span>
            <span className={styles.infoValue}>
              {user?.role === 'master' ? 'Master Supremo' : user?.role === 'admin' ? 'Administrador' : 'Voluntário'}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Setores</span>
            <div className={styles.tagList}>
              {isEditing ? (
                sectors.map(sector => (
                  <button
                    key={sector.id}
                    type="button"
                    className={`${styles.tag} ${formData.sectorIds.includes(sector.id) ? styles.tagActive : ''}`}
                    onClick={() => toggleSector(sector.id)}
                  >
                    {sector.name}
                  </button>
                ))
              ) : (
                userSectorsNames.length > 0 ? (
                  userSectorsNames.map(name => (
                    <span key={name} className={styles.tag}>{name}</span>
                  ))
                ) : (
                  <span className={styles.noTags}>Nenhum setor vinculado</span>
                )
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <Button fullWidth onClick={handleUpdate}>
              <Check size={18} />
              Salvar Alterações
            </Button>
          ) : (
            <Button variant="danger" fullWidth onClick={handleLogout}>
              <LogOut size={18} />
              Sair da Conta
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}