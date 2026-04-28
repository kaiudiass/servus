import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Apenas define a mensagem se existir no state, sem manipular via window.history para evitar loops
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]); // Dependência específica do state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <LogIn size={32} />
        </div>
        <h1 className={styles.logo}>Get Escala</h1>
        <p className={styles.subtitle}>Gerenciamento de escalas</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Mail size={18} className={styles.inputIcon} />
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={styles.inputWithIcon}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.inputWithIcon}
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        
        <Button type="submit" fullWidth loading={loading}>
          Entrar
        </Button>
      </form>

      <div className={styles.footer}>
        Não tem uma conta? <Link to="/registrar" className={styles.link}>Cadastre-se</Link>
      </div>
    </div>
  );
}