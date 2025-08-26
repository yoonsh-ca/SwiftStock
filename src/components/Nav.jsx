import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebase';
import { Link } from 'react-router-dom';

export default function Nav() {
  const { user } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout Success!');
    } catch (error) {
      console.error('Logout error: ', error.message);
    }
  };

  return (
    <nav>
      {user ? (
        <>
          <Link to='/dashboard'>
            <h1>SwiftStock</h1>
          </Link>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Link to='/dashboard'>
            <h1>SwiftStock</h1>
          </Link>
        </>
      )}
    </nav>
  );
}
