import { useEffect, useRef } from 'react';
import styles from './Input.module.css';

export function Input({ label, error, fullWidth, className, multiline, ...props }) {
  const Component = multiline ? 'textarea' : 'input';
  const textareaRef = useRef(null);

  useEffect(() => {
    if (multiline && textareaRef.current) {
      const textarea = textareaRef.current;
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Inicial

      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, [multiline, props.value]);

  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <Component 
        ref={multiline ? textareaRef : null}
        className={`${styles.input} ${multiline ? styles.textarea : ''} ${error ? styles.error : ''} ${className || ''}`} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}