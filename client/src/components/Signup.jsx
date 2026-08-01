import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

const Signup = () => {
  const [email, setEmail] = useState('jason@fl1.digital');
  const [userName, setUserName] = useState('fl1jason');
  const [password, setPassword] = useState('Letmein123!');
  const [password2, setPassword2] = useState('Letmein123!');

  const { setUser } = useSession();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const validatePassword = () => {
    if (password !== password2) {
      displayError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        username: userName,
        email: email,
        password: password,
      });
      const data = response.data;

      setUser({
        username: data.user.username,
        id: data.user.id,
      });

      localStorage.setItem('authToken', data.token);
      navigate('/');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;