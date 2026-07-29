import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API Base URL - update port/protocol to match your .NET app
const API_BASE_URL = 'https://localhost:7065/api';

export default function RentalManager() {
  // Master Data State
  const [customers, setCustomers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);

  // Form State for New Rental Transaction
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [dateRented, setDateRented] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);

  // Loading & Validation State
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Fetch initial dropdown data & active rentals on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [custRes, movieRes, rentalRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers`),
        axios.get(`${API_BASE_URL}/movies`),
        axios.get(`${API_BASE_URL}/rentals`),
      ]);

      setCustomers(custRes.data);
      setMovies(movieRes.data);
      setActiveRentals(rentalRes.data);
    } catch (err) {
      console.error('Failed to load initial rental data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Add Movie to Current Cart (with Stock Check)
  const handleAddMovieToCart = (movieIdStr) => {
    if (!movieIdStr) return;

    const movieId = parseInt(movieIdStr, 10);
    const movie = movies.find((m) => m.movieID === movieId);

    // Business Rule: Validate stock availability
    if (!movie || movie.numberAvailable <= 0) {
      alert(`"${movie?.movieName || 'Movie'}" is out of stock!`);
      return;
    }

    if (selectedMovieIds.includes(movieId)) {
      alert('This movie is already added to the current transaction.');
      return;
    }

    setSelectedMovieIds((prev) => [...prev, movieId]);
    // Clear movie error if present
    if (errors.movies) setErrors((prev) => ({ ...prev, movies: null }));
  };

  const handleRemoveMovieFromCart = (movieId) => {
    setSelectedMovieIds((prev) => prev.filter((id) => id !== movieId));
  };

  // 3. Client-Side Validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedCustomerId) {
      newErrors.customer = 'Please select a customer.';
    }

    if (!dateRented) {
      newErrors.dateRented = 'Date Rented is required.';
    }

    if (selectedMovieIds.length === 0) {
      newErrors.movies = 'Select at least one movie for this rental.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Rent Movies (Submit Transaction)
  const handleRentSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const nowIso = new Date().toISOString();

    // Rental Header + Detail DTO matching .NET expectations
    const payload = {
      customer_ID: parseInt(selectedCustomerId, 10),
      dateRented: dateRented,
      createdDate: nowIso,
      modifiedDate: nowIso,
      rentalDetails: selectedMovieIds.map((movieId) => ({
        movieID: movieId,
        dateReturned: null,
      })),
    };

    try {
      await axios.post(`${API_BASE_URL}/rentals`, payload);
      alert('Rental transaction created successfully!');

      // Reset Form & Reload Data to refresh available stock
      setSelectedCustomerId('');
      setSelectedMovieIds([]);
      setDateRented(new Date().toISOString().split('T')[0]);
      setErrors({});
      loadInitialData();
    } catch (err) {
      console.error('Rental Creation Failed:', err);
      if (err.response?.data?.errors) {
        alert('Validation error occurred. Check console for details.');
      } else {
        alert('Failed to process rental transaction.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Return Movie Handler
  const handleReturnMovie = async (rentalDetailId, movieId) => {
    const today = new Date().toISOString().split('T')[0];

    try {
      // Endpoint to process return in backend
      await axios.put(`${API_BASE_URL}/rentals/details/${rentalDetailId}/return`, {
        dateReturned: today,
      });

      alert('Movie marked as returned!');
      loadInitialData(); // Re-fetch to update NumberAvailable
    } catch (err) {
      console.error('Return process failed:', err);
      alert('Failed to return movie.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Rental Manager</h2>

      {isLoading ? (
        <p>Loading catalog and customer data...</p>
      ) : (
        <div style={styles.gridContainer}>
          {/* LEFT: Rent Movie Form */}
          <div style={styles.card}>
            <h3>Rent Movies (New Transaction)</h3>
            <form onSubmit={handleRentSubmit} style={styles.form}>
              
              {/* Customer Select */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Customer:</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    if (errors.customer) setErrors({ ...errors, customer: null });
                  }}
                  style={styles.input}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.customer_ID || c.customerID} value={c.customer_ID || c.customerID}>
                      {c.customerName || `${c.firstName} ${c.lastName}`}
                    </option>
                  ))}
                </select>
                {errors.customer && <span style={styles.error}>{errors.customer}</span>}
              </div>

              {/* Date Rented */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Date Rented:</label>
                <input
                  type="date"
                  value={dateRented}
                  onChange={(e) => setDateRented(e.target.value)}
                  style={styles.input}
                />
                {errors.dateRented && <span style={styles.error}>{errors.dateRented}</span>}
              </div>

              {/* Add Movie Picker */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Add Movies to Rental:</label>
                <select
                  onChange={(e) => {
                    handleAddMovieToCart(e.target.value);
                    e.target.value = ''; // reset dropdown selection
                  }}
                  style={styles.input}
                >
                  <option value="">-- Select Movie --</option>
                  {movies.map((m) => (
                    <option
                      key={m.movieID}
                      value={m.movieID}
                      disabled={m.numberAvailable <= 0}
                    >
                      {m.movieName} ({m.numberAvailable} Available)
                    </option>
                  ))}
                </select>
                {errors.movies && <span style={styles.error}>{errors.movies}</span>}
              </div>

              {/* Selected Movies List */}
              <div style={styles.selectedContainer}>
                <label style={styles.label}>Selected Movies Queue:</label>
                {selectedMovieIds.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                    No movies selected yet.
                  </p>
                ) : (
                  <ul style={styles.movieList}>
                    {selectedMovieIds.map((id) => {
                      const item = movies.find((m) => m.movieID === id);
                      return (
                        <li key={id} style={styles.movieListItem}>
                          <span>{item?.movieName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMovieFromCart(id)}
                            style={styles.removeBtn}
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.button,
                  backgroundColor: isSubmitting ? '#ccc' : '#28a745',
                }}
              >
                {isSubmitting ? 'Processing Transaction...' : 'Process Rental'}
              </button>
            </form>
          </div>

          {/* RIGHT: Active Rentals & Return Handling */}
          <div style={styles.card}>
            <h3>Active / Past Rentals</h3>
            {activeRentals.length === 0 ? (
              <p style={{ color: '#666' }}>No rental records found.</p>
            ) : (
              <div style={styles.rentalList}>
                {activeRentals.map((rental) => (
                  <div key={rental.rentalID} style={styles.rentalCard}>
                    <div style={styles.rentalHeader}>
                      <strong>Rental #{rental.rentalID}</strong> - Date: {rental.dateRented?.split('T')[0]}
                    </div>
                    <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                      Customer ID: {rental.customer_ID}
                    </div>

                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>Movie ID</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rental.rentalDetails?.map((detail) => {
                          const isReturned = Boolean(detail.dateReturned);
                          return (
                            <tr key={detail.rentalDetailId}>
                              <td>{detail.movieID}</td>
                              <td>
                                {isReturned ? (
                                  <span style={{ color: 'green' }}>
                                    Returned ({detail.dateReturned.split('T')[0]})
                                  </span>
                                ) : (
                                  <span style={{ color: 'orange', fontWeight: 'bold' }}>
                                    Rented
                                  </span>
                                )}
                              </td>
                              <td>
                                {!isReturned ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReturnMovie(detail.rentalDetailId, detail.movieID)
                                    }
                                    style={styles.returnBtn}
                                  >
                                    Return Movie
                                  </button>
                                ) : (
                                  <span style={{ color: '#888', fontSize: '12px' }}>N/A</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Form Styles
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  card: {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  error: {
    color: '#d9534f',
    fontSize: '12px',
  },
  selectedContainer: {
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  movieList: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0 0',
  },
  movieListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
    borderBottom: '1px solid #eee',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    padding: '2px 6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  button: {
    padding: '10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  rentalList: {
    maxHeight: '500px',
    overflowY: 'auto',
  },
  rentalCard: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: '#fdfdfd',
  },
  rentalHeader: {
    borderBottom: '1px solid #eee',
    paddingBottom: '4px',
    marginBottom: '6px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  returnBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    padding: '2px 8px',
    cursor: 'pointer',
  },
};