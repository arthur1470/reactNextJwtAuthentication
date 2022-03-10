import { FormEvent, useContext, useState } from 'react';
import styles from '../styles/home.module.css';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isAuthenticated } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data);
  }

  return (    
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>    
  )
}
