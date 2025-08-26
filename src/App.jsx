import './App.css';
import { useAuthContext } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LogIn from './pages/LogIn';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Nav from './components/Nav';

function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <Nav />
      <Routes>
        <Route
          path='/'
          element={
            user ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <LogIn />
            )
          }
        />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/dashboard'
          element={
            user ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <LogIn />
            )
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
