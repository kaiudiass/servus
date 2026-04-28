import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';
import { Button } from '../components/Button';
import styles from './Register.module.css';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ name, email, password, phone });
      navigate('/login', { state: { message: 'Conta criada com sucesso!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoArea}>
        <h1 className={styles.logo}>Criar Conta</h1>
        <p className={styles.subtitle}>Gerenciamento de escalas</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome Completo</label>
          <div className={styles.inputWrapper}>
            <User size={18} className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className={styles.inputWithIcon}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>E-mail</label>
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
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Telefone</label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className={styles.inputWithIcon}
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha</label>
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
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirmar Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                placeholder="Confirme"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className={styles.inputWithIcon}
              />
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" fullWidth loading={loading}>
          <UserPlus size={18} style={{ marginRight: 8 }} />
          Cadastrar
        </Button>
      </form>

      <div className={styles.footer}>
        Já possui conta? <Link to="/login" className={styles.link}>Fazer Login</Link>
      </div>
    </div>
  );
}
