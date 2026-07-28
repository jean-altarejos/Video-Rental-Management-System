import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function SidebarLayout() {
  const navStyle = ({ isActive }) => ({
    display: 'block',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
      {/* --- SIDEBAR --- */}
      <aside style={{ width: '250px', backgroundColor: '#0f172a', color: '#fff', padding: '24px 16px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '32px', paddingLeft: '8px', color: '#f8fafc' }}>
          App Dashboard
        </h2>
        
        <nav>
          <NavLink to="/customers" style={navStyle}>
            👥 Customers
          </NavLink>
          <NavLink to="/inventory" style={navStyle}>
            📦 Inventory
          </NavLink>
          <NavLink to="/rentals" style={navStyle}>
            🔑 Rentals
          </NavLink>
        </nav>
      </aside>

      {/* --- MAIN CONTAINER --- */}
      <main style={{ flexGrow: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Outlet /> {/* Active route component renders here */}
        </div>
      </main>
    </div>
  );
}