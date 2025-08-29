import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../api/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function LogIn() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/inventory');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login Success!');
      navigate('/inventory');
    } catch (error) {
      console.error('Login error: ', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Google login success!');
      navigate('/inventory');
    } catch (error) {
      console.error('Google login error: ', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Log In</button>
      </form>
      <p>
        If you don't have an account, please <Link to='/signup'>sign up</Link>.
      </p>
      <hr />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
