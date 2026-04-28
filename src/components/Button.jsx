import styles from './Button.module.css';

export function Button({ children, variant = 'primary', size = 'md', fullWidth, loading, disabled, ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.loader} /> : children}
    </button>
  );
}