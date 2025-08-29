import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, database, googleProvider } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthContext } from '../context/AuthContext';

export default function Signup() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/inventory');
  }, [user, navigate]);

  const createUserDoc = async (user) => {
    const userDocRef = doc(database, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date(),
      });
      console.log('User document created');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await createUserDoc(user);

      alert('✅Sign up with email success!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error: ', error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await createUserDoc(user);

      alert('✅Google Sign up success!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign up error: ', error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSignup}>
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
        <button type='submit'>Sign Up</button>
      </form>
      <hr />
      <button onClick={handleGoogleSignup}>Google Sign Up</button>
    </>
  );
}
