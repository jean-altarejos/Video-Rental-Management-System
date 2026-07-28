import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';



export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: ''
  });

  // 1. Fetch all customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when typing
    if (validationErrors[name] || validationErrors[name.toLowerCase()]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      delete newErrors[name.toLowerCase()];
      setValidationErrors(newErrors);
    }
  };

  // 2. CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const payload = {
      name: formData.name.trim(),
      customerName: formData.name.trim(),
      email: formData.email.trim(),
      birthDate: formData.birthDate ? formData.birthDate : null
    };

    try {
      if (editingId) {
        // Update existing customer
        await customerService.update(editingId, payload);
      } else {
        // Create new customer
        await customerService.create(payload);
      }
      
      resetForm();
      loadCustomers(); // Refresh table
    } catch (err) {
      if (err.response && err.response.data) {
        // Normalize error keys to camelCase so field lookup always succeeds
        const rawErrors = err.response.data;
        const normalized = {};
        Object.keys(rawErrors).forEach((key) => {
          // Convert key like "Name" -> "name"
          const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
          normalized[camelKey] = rawErrors[key];
        });
        setValidationErrors(normalized);
      } else {
        console.error('Operation failed:', err);
      }
    }
  };

  // Prepare form for Editing (FIXED: customerIdd -> customerId)
  const handleEdit = (customer) => {
    setEditingId(customer.customerId); // 👈 Fixed typo here
    setFormData({
      name: customer.customerName || '',
      email: customer.email || '',
      birthDate: customer.birthdate ? customer.birthdate.substring(0, 10) : ''
    });
    setValidationErrors({});
  };

  // 3. DELETE (FIXED: customerId variable -> id parameter)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.delete(id); // 👈 Fixed variable reference here
      loadCustomers(); // Refresh table
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', birthDate: '' });
    setEditingId(null);
    setValidationErrors({});
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Customer Management</h2>

      {/* --- FORM SECTION --- */}
      <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>{editingId ? `Edit Customer (#${editingId})` : 'Add New Customer'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
            {validationErrors.name && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.name[0]}</span>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
            {validationErrors.email && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.email[0]}</span>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Birth Date:</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
            {validationErrors.birthDate && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.birthDate[0]}</span>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: editingId ? '#2563eb' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {editingId ? 'Update Customer' : 'Create Customer'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* --- TABLE SECTION --- */}
      <h3>Customer List</h3>
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Birth Date</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customerId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{c.customerId}</td>
                  <td style={{ padding: '10px' }}>{c.customerName}</td>
                  <td style={{ padding: '10px' }}>{c.email}</td>
                  <td style={{ padding: '10px' }}>
                    {c.birthdate ? new Date(c.birthdate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleEdit(c)}
                      style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.customerId)}
                      style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}