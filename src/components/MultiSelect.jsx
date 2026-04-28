import { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import styles from './MultiSelect.module.css';

export function MultiSelect({ label, options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOption = (optionId) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter(id => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  const removeItem = (e, itemId) => {
    e.stopPropagation();
    onChange(selected.filter(id => id !== itemId));
  };

  const getSelectedNames = () => {
    return options.filter(o => selected.includes(o.id)).map(o => o.name);
  };

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.selectContainer} ${isOpen ? styles.isOpen : ''}`}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.selectedText}>
            {selected.length > 0 ? getSelectedNames().join(', ') : placeholder || 'Selecione...'}
          </span>
          <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
        </button>
        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.searchBox}>
              <input
                autoFocus
                type="text"
                placeholder="Pesquisar..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.option} ${selected.includes(option.id) ? styles.selected : ''}`}
                    onClick={() => toggleOption(option.id)}
                  >
                    <span className={styles.checkbox}>
                      {selected.includes(option.id) && <Check size={12} />}
                    </span>
                    <span className={styles.optionName}>{option.name}</span>
                  </button>
                ))
              ) : (
                <div className={styles.noOptions}>Nenhum voluntário encontrado</div>
              )}
            </div>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className={styles.tags}>
          {selected.map(id => {
            const opt = options.find(o => o.id === id);
            return (
              <span key={id} className={styles.tag}>
                {opt?.name}
                <button type="button" onClick={(e) => removeItem(e, id)}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}