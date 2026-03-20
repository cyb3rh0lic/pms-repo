import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Guests from './pages/Guests';
import Housekeeping from './pages/Housekeeping';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">🏨 Hotel PMS</div>
          <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            대시보드
          </NavLink>
          <NavLink to="/reservations" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            예약 관리
          </NavLink>
          <NavLink to="/guests" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            고객 관리
          </NavLink>
          <NavLink to="/housekeeping" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            하우스키핑
          </NavLink>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/housekeeping" element={<Housekeeping />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;