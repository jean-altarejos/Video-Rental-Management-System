import React, { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { genreService } from '../services/genreService';
import axios from 'axios';

export default function MovieManager() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loadingGenres, setLoadingGenres]= useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Validation Errors State
  const [errors, setErrors] = useState({});

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  
  // Form State
  const [formData, setFormData] = useState({
    movieName: '',
    genreID: '',
    releaseDate: '',
    dateAdded: new Date().toISOString().split('T')[0], //YYYY-MM-DD
    numberInStock: 0,
    numberAvailable: 0,

  });

  const loadGenres = async () => {
    setLoading(true);
    try {
      const response = await genreService.getAll();
      setGenres(response.data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getAll();
      setMovies(response.data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  //Fetch Genres on Mount
  useEffect(() => {
    loadGenres();
  },[]);


  // Fetch all movies on mount
  useEffect(() => {
    loadMovies();
  }, []);



  // Filter movies dynamically based on search term
  const filteredMovies = movies.filter((m) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const nameMatch = m.movieName ? m.movieName.toLowerCase().includes(term) : false;
    const genreMatch = m.genreID ? m.genreId.toString().includes(term) : false;

    return nameMatch || genreMatch;
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Capitalize Movie Name automatically
    if (name === 'movieName'){
      updatedValue = value.toUpperCase();
    }


    if (['genreID', 'numberInStock', 'numberAvailable'].includes(name)) {
    if (value === '') {
      updatedValue = 0; // 👈 Set to 0 instead of empty string/null
    } else {
      const parsed = parseInt(value, 10);
      updatedValue = isNaN(parsed) ? 0 : parsed;
    }
  }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  //Clear validation error when typing
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: null}));
  }
  
  //Validation Logic
  const validate = () => {
    const newErrors = {};

    //Movie Name validation
    if(!formData.movieName.trim()){
      newErrors.movieName = 'Movie title is required.';
    } else if (formData.movieName.length > 100){
      newErrors.movieName = 'Movie title cannot exceed 100 characters.';
    }

    //Genre ID validation
    if (!formData.genreID) {
      newErrors.genreID = 'Please select a genre.'
    }

    //Date validation
    if (!formData.releaseDate){
      newErrors.releaseDate = 'Release date is required.';
    }
    if (!formData.dateAdded){
      newErrors.dateAdded = 'Date added is required.';
    }

    //Number In Stock validation (0 to 20)
    if (!formData.numberInStock ==='' || isNaN(formData.numberInStock)){
      newErrors.numberInStock = 'Number in stock is required.';
    } else if (formData.numberInStock < 0 || formData.numberInStock > 20) {
      newErrors.numberInStock = 'Stock must be between 0 and 20.';
    }

    //Number Available validation
    if (formData.numberAvailable === '' || isNaN(formData.numberAvailable)){
      newErrors.numberAvailable = 'Number available is required.';
    } else if (formData.numberAvailable < 0) {
      newErrors.numberAvailable = 'Available stock cannot be negative.';
    } else if (formData.numberAvailable > formData.numberInStock){
      newErrors.numberAvailable = 'Available stock cannot exceel total stock.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // 2. CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedStock = Number(formData.numberInStock) || 0;
    const parsedAvailable = Number(formData.numberAvailable) || 0;

    if (!formData.genreID || parseInt(formData.genreID, 10) <= 0) {
    setErrors((prev) => ({ ...prev, genreID: 'Please select a valid Genre.' }));
    return; // Stop form submission here
    }

    if (!validate()) return;

    setIsSubmitting(true);


    const payload = {
      movieName: formData.movieName, 
      genreID: parseInt(formData.genreID, 10),
      releaseDate: formData.releaseDate,
      dateAdded: formData.dateAdded,
      numberInStock: parsedStock,
      numberAvailable: parsedAvailable,
      createdDate: new Date().toISOString(),
      modifieddate: new Date().toISOString(),
    };

    try {
      if (editingId) {
        // Update existing customer
        await movieService.update(editingId, payload);
      } else {
        // Create new customer
        await movieService.create(payload);
      }
      
      resetForm();
      loadMovies(); // Refresh table
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.errors) {
        // Normalize error keys to camelCase for UI mapping
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};


        // Maps "GenreID" (or lower/upper casing) from .NET into React errors state
      if (backendErrors.GenreID || backendErrors.genreID) {
        const errorMsg = (backendErrors.GenreID || backendErrors.genreID)[0];
        setErrors((prev) => ({ ...prev, genreID: errorMsg }));
      }

        Object.keys(backendErrors).forEach((key) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          formattedErrors[fieldName] = backendErrors[key][0];
        });

        setErrors(formattedErrors);

      } else {
        console.error('Failed to save movie:', err);
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare form for Editing
  const handleEdit = (movies) => {
    setEditingId(movies.movieID);
    setFormData({
      movieName: movies.movieName, 
      genreID: parseInt(movies.genreID, 10),
      releaseDate: movies.releaseDate ? movies.releaseDate.substring(0,10) : '',
      dateAdded: movies.dateAdded ? movies.dateAdded.substring(0,10): '',
      numberInStock: parseInt(movies.numberInStock, 10),
      numberAvailable: parseInt(movies.numberAvailable, 10)
    });
    setValidationErrors({});
  };

  
  // 3. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.delete(id);
      loadCustomers(); // Refresh table
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  const resetForm = () => {
    setFormData({ movieName: '', genreID: '', releaseDate: '', dateAdded: '', numberInStock: '', numberAvailable: '' });
    setEditingId(null);
    setValidationErrors({});
  };

return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Movie Management</h2>

      {/* --- FORM SECTION --- */}
      <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>{editingId ? `Edit Movie (#${editingId})` : 'Add New Movie'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Movie Name:</label>
            <input
              type="text"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              placeholder="Avengers"
              style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
            {validationErrors.movieName && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.movieName[0]}</span>
            )}
          </div>
          <div style={{ padding: '0px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Genre:</label>

              <select
                name="genreID"
                value={formData.genreID}
                onChange={handleChange}
                disabled={loadingGenres} 
                style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
              >
                <option value="">
                  {loadingGenres ? 'Loading genres...' : '-- Choose Genre --'}
                </option>

                {!loadingGenres &&
                  genres.map((g) => (
                    <option key={g.genreID || g.genreId} value={g.genreID || g.genreId}>
                      {g.genreName}
                    </option>
                  ))}
              </select>
              {validationErrors.genreID && (
              <span style={{ color: 'red', fontSize: '12px' }}
            >{validationErrors.genreID[0]}</span>
            )}
            </div>
          </div>

          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Release Date:</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
            {validationErrors.releaseDate && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.releaseDate[0]}</span>
            )}
          </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Date Added:</label>
          <input
            type="date"
            name="dateAdded"
            value={formData.dateAdded}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
          {validationErrors.dateAdded && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.dateAdded[0]}</span>
            )}
          </div>


        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Number in Stock (0 to 20):</label>
          <input
            type="number"
            name="numberInStock"
            min="0"
            max="20"
            value={formData.numberInStock}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
          {validationErrors.numberInStock && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.numberInStock[0]}</span>
            )}
        </div>


        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Number Available (Stock minus Rented):</label>
          <input
            type="number"
            name="numberAvailable"
            min="0"
            max={formData.numberInStock || 20}
            value={formData.numberAvailable}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
                      />
          {validationErrors.numberAvailable && (
              <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.numberAvailable[0]}</span>
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
            {editingId ? 'Update Movie' : 'Create Movie'}
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

      {/* --- TABLE SECTION HEADER & SEARCH --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Movie List ({filteredMovies.length})</h3>

        {/* Search Input Field */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search by movie name, genre, or release date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 30px 8px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Movie</th>
              <th style={{ padding: '10px' }}>Date Added</th>
              <th style={{ padding: '10px' }}>Release Date</th>
              <th style={{ padding: '10px' }}>No of Stock</th>
              <th style={{ padding: '10px' }}>No of Available</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                  {searchTerm ? `No movies found matching "${searchTerm}"` : 'No movies found.'}
                </td>
              </tr>
            ) : (
              filteredMovies.map((m) => (
                <tr key={m.movieID} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{m.movieID}</td>
                  <td style={{ padding: '10px' }}>{m.movieName}</td>
                  
                  <td style={{ padding: '10px' }}>
                    {m.dateAdded ? new Date(m.dateAdded).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '10px' }}>{m.numberInStock}</td>
                  <td style={{ padding: '10px' }}>{m.numberAvailable}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(m)}
                      style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.movieID)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
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