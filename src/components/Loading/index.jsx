import React from 'react';
import styles from './Loading.module.css';

const Loading = ({ 
  fullScreen = false, 
  overlay = false, 
  size = 'medium', 
  text = 'Carregando...' 
}) => {
  const containerClass = `
    ${styles.container} 
    ${fullScreen ? styles.fullScreen : ''} 
    ${overlay ? styles.overlay : ''}
  `;

  return (
    <div className={containerClass} id="global-loading">
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.inner}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loading;
