import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import CustomerManager from './components/CustomerManager';
import './App.css'

const InventoryManager = () => <div><h2>Inventory Module</h2><p>Inventory management forms & tables go here.</p></div>;
const RentalManager = () => <div><h2>Rentals Module</h2><p>Rental agreements & tracking go here.</p></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Wrapper */}
        <Route path="/" element={<SidebarLayout />}>
          {/* Default redirect to customers */}
          <Route index element={<Navigate to="/customers" replace />} />
          
          {/* Module Routes */}
          <Route path="customers" element={<CustomerManager />} />
          <Route path="inventory" element={<InventoryManager />} />
          <Route path="rentals" element={<RentalManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}