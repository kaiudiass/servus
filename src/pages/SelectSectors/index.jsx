import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useScale } from '../../contexts/ScaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import styles from './SelectSectors.module.css';

export function SelectSectors() {
  const navigate = useNavigate();
  const { sectors, updateUser, loading: scaleLoading } = useScale();
  const { user, refreshUser } = useAuth();
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scaleLoading && sectors.length === 0) {
      navigate('/', { replace: true });
    }
  }, [scaleLoading, sectors.length, navigate]);

  const toggleSector = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      alert('Por favor, selecione ao menos um setor para continuar.');
      return;
    }

    setLoading(true);
    try {
      const success = await updateUser(user.id, { sectorIds: selectedIds });
      if (success) {
        await refreshUser();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Erro ao salvar setores', error);
      alert('Erro ao salvar setores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (scaleLoading || sectors.length === 0) {
    return null; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Onde você deseja servir?</h1>
        <p className={styles.subtitle}>Selecione os setores que você deseja fazer parte.</p>
      </div>

      <div className={styles.tagsContainer}>
        {sectors.map(sector => (
          <button 
            key={sector.id} 
            type="button"
            className={`${styles.tag} ${selectedIds.includes(sector.id) ? styles.tagActive : ''}`}
            onClick={() => toggleSector(sector.id)}
          >
            {sector.name}
            {selectedIds.includes(sector.id) && <Check size={12} className={styles.checkIcon} />}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <Button 
          fullWidth 
          onClick={handleSave} 
          loading={loading}
          disabled={selectedIds.length === 0}
        >
          Finalizar Cadastro
          <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </Button>
      </div>
    </div>
  );
}
