import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LogIn from './pages/LogIn';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Inventory from './components/Inventory';
import ItemDetail from './pages/ItemDetail';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventory/:id' element={<ItemDetail />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
