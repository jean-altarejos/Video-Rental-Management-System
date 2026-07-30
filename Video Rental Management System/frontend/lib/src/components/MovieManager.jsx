// import React, { useState, useEffect } from 'react';
// import { movieService } from '../services/movieService';
// import { genreService } from '../services/genreService';
// import axios from 'axios';

// export default function MovieManager() {
//   const [movies, setMovies] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [loadingGenres, setLoadingGenres]= useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // String/ID state holding the currently selected dropdown option
//   const [selectedGenre, setSelectedGenre] = useState("");
 
//   //Pagination
//   const [inStockOnly, setInStockOnly] = useState(false);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);

//   //Validation Errors State
//   const [errors, setErrors] = useState({});

//   // Search State
//   const [searchTerm, setSearchTerm] = useState('');

  
//   // Form State
//   const [formData, setFormData] = useState({
//     movieName: '',
//     genreID: '',
//     releaseDate: '',
//     dateAdded: new Date().toISOString().split('T')[0], //YYYY-MM-DD
//     numberInStock: 0,
//     numberAvailable: 0,

//   });

  
//   const loadGenres = async () => {
//   setLoading(true);
//   try {
//     const response = await genreService.getAll();
    
//     // If backend returns ApiResponse<List<Genre>>:
//     // response.data.data contains the array
//     const genreArray = response.data?.data || response.data || [];
    
//     setGenres(genreArray);
//   } catch (err) {
//     console.error('Failed to fetch genres:', err);
//   } finally {
//     setLoading(false);
//   }
// };

//   const loadMovies = async () => {
//     setLoading(true);
//     try {
//       const response = await movieService.getAll();
//       setMovies(response.data.data || []);
//     } catch (err) {
//       console.error('Failed to fetch movies:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //Fetch whenever filters or page changes
//   useEffect(() => {
//     fetchMovies();
//   }, [genres, inStockOnly, pageNumber]);

//   //Fetch Genres on Mount
//   useEffect(() => {
//     loadGenres();
//   },[]);


//   // Fetch all movies on mount
//   useEffect(() => {
//     loadMovies();
//   }, []);

// const fetchMovies = async () => {
//   setLoading(true);
//   try {
//     const response = await axios.get('https://localhost:7065/api/movies', {
//       params: {
//         pageNumber,
//         pageSize,
//         genres: genres || undefined,
//         inStockOnly: inStockOnly || undefined
//       }
//     });

//     // Extract from response.data.data
//     const pagedResult = response.data.data;

//     setMovies(pagedResult?.items || []);
//     setTotalPages(pagedResult?.totalPages || 1);
//   } catch (error) {
//     console.error('Error fetching movies:', error);
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleGenreChange = (e) => {
//     setGenres(e.target.value);
//     setPageNumber(1);
//   }

//   const handleStockFilterChange = (e) => {
//     setInStockOnly(e.target.checked);
//     setPageNumber(1);
//   }

//   // Filter movies dynamically based on search term
//   const filteredMovies = movies.filter((m) => {
//     const term = searchTerm.toLowerCase().trim();
//     if (!term) return true;

//     const nameMatch = m.movieName ? m.movieName.toLowerCase().includes(term) : false;
//     const genreMatch = m.genreID ? m.genreId.toString().includes(term) : false;

//     return nameMatch || genreMatch;
//   });

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let updatedValue = value;

//     // Capitalize Movie Name automatically
//   if (name === 'movieName') {
//     updatedValue = value.toUpperCase();
//   }

//   // Handle dropdown choice: keep empty string if nothing selected, otherwise convert to number
//   if (name === 'genreID') {
//     updatedValue = value === '' ? '' : parseInt(value, 10);
//   }

//   // Handle number inputs: convert empty/invalid to 0
//   if (['numberInStock', 'numberAvailable'].includes(name)) {
//     updatedValue = value === '' ? 0 : (parseInt(value, 10) || 0);
//   }


//     /*if (['genreID', 'numberInStock', 'numberAvailable'].includes(name)) {
//     if (value === '') {
//       updatedValue = 0; // 👈 Set to 0 instead of empty string/null
//     } else {
//       const parsed = parseInt(value, 10);
//       updatedValue = isNaN(parsed) ? 0 : parsed;
//     }
//   }*/

//     setFormData((prev) => ({
//       ...prev,
//       [name]: updatedValue,
//     }));
//   };

//   //Clear validation error when typing
//   if (errors[name]) {
//     setErrors((prev) => ({ ...prev, [name]: null}));
//   }
  
//   //Validation Logic
//   const validate = () => {
//     const newErrors = {};

//     //Movie Name validation
//     if(!formData.movieName.trim()){
//       newErrors.movieName = 'Movie title is required.';
//     } else if (formData.movieName.length > 100){
//       newErrors.movieName = 'Movie title cannot exceed 100 characters.';
//     }

//     //Genre ID validation
//     if (!formData.genreID) {
//       newErrors.genreID = 'Please select a genre.'
//     }

//     //Date validation
//     if (!formData.releaseDate){
//       newErrors.releaseDate = 'Release date is required.';
//     }
//     if (!formData.dateAdded){
//       newErrors.dateAdded = 'Date added is required.';
//     }

//     //Number In Stock validation (0 to 20)
//     if (!formData.numberInStock ==='' || isNaN(formData.numberInStock)){
//       newErrors.numberInStock = 'Number in stock is required.';
//     } else if (formData.numberInStock < 0 || formData.numberInStock > 20) {
//       newErrors.numberInStock = 'Stock must be between 0 and 20.';
//     }

//     //Number Available validation
//     if (formData.numberAvailable === '' || isNaN(formData.numberAvailable)){
//       newErrors.numberAvailable = 'Number available is required.';
//     } else if (formData.numberAvailable < 0) {
//       newErrors.numberAvailable = 'Available stock cannot be negative.';
//     } else if (formData.numberAvailable > formData.numberInStock){
//       newErrors.numberAvailable = 'Available stock cannot exceel total stock.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }

//   // 2. CREATE or UPDATE
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const parsedStock = Number(formData.numberInStock) || 0;
//     const parsedAvailable = Number(formData.numberAvailable) || 0;

//     if (!formData.genreID || parseInt(formData.genreID, 10) <= 0) {
//     setErrors((prev) => ({ ...prev, genreID: 'Please select a valid Genre.' }));
//     return; // Stop form submission here
//     }

//     if (!validate()) return;

//     setIsSubmitting(true);


//     const payload = {
//       movieName: formData.movieName, 
//       genreID: parseInt(formData.genreID, 10),
//       releaseDate: formData.releaseDate,
//       dateAdded: formData.dateAdded,
//       numberInStock: parsedStock,
//       numberAvailable: parsedAvailable,
//       createdDate: new Date().toISOString(),
//       modifieddate: new Date().toISOString(),
//     };

//     try {
//       if (editingId) {
//         // Update existing customer
//         await movieService.update(editingId, payload);
//       } else {
//         // Create new customer
//         await movieService.create(payload);
//       }
      
//       resetForm();
//       loadMovies(); // Refresh table
//     } catch (err) {
//       if (err.response && err.response.status === 400 && err.response.data.errors) {
//         // Normalize error keys to camelCase for UI mapping
//         const backendErrors = err.response.data.errors;
//         const formattedErrors = {};


//         // Maps "GenreID" (or lower/upper casing) from .NET into React errors state
//       if (backendErrors.GenreID || backendErrors.genreID) {
//         const errorMsg = (backendErrors.GenreID || backendErrors.genreID)[0];
//         setErrors((prev) => ({ ...prev, genreID: errorMsg }));
//       }

//         Object.keys(backendErrors).forEach((key) => {
//           const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
//           formattedErrors[fieldName] = backendErrors[key][0];
//         });

//         setErrors(formattedErrors);

//       } else {
//         console.error('Failed to save movie:', err);
//       }
      
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Prepare form for Editing
//   const handleEdit = (movies) => {
//     setEditingId(movies.movieID);
//     setFormData({
//       movieName: movies.movieName, 
//       genreID: parseInt(movies.genreID, 10),
//       releaseDate: movies.releaseDate ? movies.releaseDate.substring(0,10) : '',
//       dateAdded: movies.dateAdded ? movies.dateAdded.substring(0,10): '',
//       numberInStock: parseInt(movies.numberInStock, 10),
//       numberAvailable: parseInt(movies.numberAvailable, 10)
//     });
//     setValidationErrors({});
//   };

  
//   // 3. DELETE
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this customer?')) return;

//     try {
//       await customerService.delete(id);
//       loadCustomers(); // Refresh table
//     } catch (err) {
//       console.error('Failed to delete customer:', err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ movieName: '', genreID: '', releaseDate: '', dateAdded: '', numberInStock: '', numberAvailable: '' });
//     setEditingId(null);
//     setValidationErrors({});
//   };

// return (
//     <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
//       <h2>Movie Management</h2>

//       {/* --- FORM SECTION --- */}
//       <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
//         <h3>{editingId ? `Edit Movie (#${editingId})` : 'Add New Movie'}</h3>
        
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '12px' }}>
//             <label style={{ display: 'block', fontWeight: 'bold' }}>Movie Name:</label>
//             <input
//               type="text"
//               name="movieName"
//               value={formData.movieName}
//               onChange={handleChange}
//               placeholder="Avengers"
//               style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//             />
//             {validationErrors.movieName && (
//               <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.movieName[0]}</span>
//             )}
//           </div>
//           <div style={{ padding: '0px' }}>
//             <div style={{ marginBottom: '12px' }}>
//               <label style={{ display: 'block', fontWeight: 'bold' }}>Genre:</label>

//               <select
//                 name="genreID"
//                 value={formData.genreID}
//                 onChange={handleChange}
//                 disabled={loadingGenres} 
//                 style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//               >
//                 <option value="">
//                   {loadingGenres ? 'Loading genres...' : '-- Choose Genre --'}
//                 </option>

//                 {!loadingGenres &&
//                   genres.map((g) => (
//                     <option key={g.genreID || g.genreId} value={g.genreID || g.genreId}>
//                       {g.genreName}
//                     </option>
//                   ))}
//               </select>
//               {validationErrors.genreID && (
//               <span style={{ color: 'red', fontSize: '12px' }}
//             >{validationErrors.genreID[0]}</span>
//             )}
//             </div>
//           </div>

          
//           <div style={{ marginBottom: '12px' }}>
//             <label style={{ display: 'block', fontWeight: 'bold' }}>Release Date:</label>
//             <input
//               type="date"
//               name="releaseDate"
//               value={formData.releaseDate}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//             />
//             {validationErrors.releaseDate && (
//               <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.releaseDate[0]}</span>
//             )}
//           </div>

//         <div style={{ marginBottom: '12px' }}>
//           <label style={{ display: 'block', fontWeight: 'bold' }}>Date Added:</label>
//           <input
//             type="date"
//             name="dateAdded"
//             value={formData.dateAdded}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//           />
//           {validationErrors.dateAdded && (
//               <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.dateAdded[0]}</span>
//             )}
//           </div>


//         <div style={{ marginBottom: '12px' }}>
//           <label style={{ display: 'block', fontWeight: 'bold' }}>Number in Stock (0 to 20):</label>
//           <input
//             type="number"
//             name="numberInStock"
//             min="0"
//             max="20"
//             value={formData.numberInStock}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//           />
//           {validationErrors.numberInStock && (
//               <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.numberInStock[0]}</span>
//             )}
//         </div>


//         <div style={{ marginBottom: '12px' }}>
//           <label style={{ display: 'block', fontWeight: 'bold' }}>Number Available (Stock minus Rented):</label>
//           <input
//             type="number"
//             name="numberAvailable"
//             min="0"
//             max={formData.numberInStock || 20}
//             value={formData.numberAvailable}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
//                       />
//           {validationErrors.numberAvailable && (
//               <span style={{ color: 'red', fontSize: '12px' }}>{validationErrors.numberAvailable[0]}</span>
//             )}
//         </div>

//           <button
//             type="submit"
//             style={{
//               padding: '10px 20px',
//               backgroundColor: editingId ? '#2563eb' : '#16a34a',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               marginRight: '10px'
//             }}
//           >
//             {editingId ? 'Update Movie' : 'Create Movie'}
//           </button>

//           {editingId && (
//             <button
//               type="button"
//               onClick={resetForm}
//               style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
//             >
//               Cancel
//             </button>
//           )}



          
//         </form>
//       </div>

//           {/* --- FILTER CONTROLS --- */}
//       <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
//         {/* Genre Dropdown */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Filter by Genre:</label>
//           <select 
//             value={selectedGenre} 
//             onChange={handleGenreChange}
//             className="border p-2 rounded w-48"
//           >
//             <option value="">All Genres</option>
//             {Array.isArray(genres) && genres.map((g) => (
//               <option key={g.genreID} value={g.GenreID}>{g.genreName}</option>
//             ))}

     
//           </select>
//         </div>

//         {/* Stock Toggle */}
//         <div className="flex items-center mt-6">
//           <label className="flex items-center cursor-pointer gap-2">
//             <input
//               type="checkbox"
//               checked={inStockOnly}
//               onChange={handleStockFilterChange}
//               className="h-4 w-4 text-blue-600"
//             />
//             <span className="text-sm font-medium">In Stock Only</span>
//           </label>
//         </div>
//       </div>

//       {/* --- TABLE SECTION HEADER & SEARCH --- */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//         <h3 style={{ margin: 0 }}>Movie List ({filteredMovies.length})</h3>

//         {/* Search Input Field */}
//         <div style={{ position: 'relative', width: '280px' }}>
//           <input
//             type="text"
//             placeholder="Search by movie name, genre, or release date..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: '100%',
//               padding: '8px 30px 8px 12px',
//               borderRadius: '6px',
//               border: '1px solid #ccc',
//               fontSize: '14px',
//               boxSizing: 'border-box'
//             }}
//           />
//           {searchTerm && (
//             <button
//               type="button"
//               onClick={() => setSearchTerm('')}
//               style={{
//                 position: 'absolute',
//                 right: '8px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: '#888',
//                 fontWeight: 'bold'
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --- TABLE SECTION --- */}
//       {loading ? (
//         <p>Loading movies...</p>
//       ) : (
//         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//           <thead>
//             <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8fafc' }}>
//               <th style={{ padding: '10px' }}>ID</th>
//               <th style={{ padding: '10px' }}>Movie</th>
//               <th style={{ padding: '10px' }}>Date Added</th>
//               <th style={{ padding: '10px' }}>Release Date</th>
//               <th style={{ padding: '10px' }}>No of Stock</th>
//               <th style={{ padding: '10px' }}>No of Available</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMovies.length === 0 ? (
//               <tr>
//                 <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
//                   {searchTerm ? `No movies found matching "${searchTerm}"` : 'No movies found.'}
//                 </td>
//               </tr>
//             ) : (
//               filteredMovies.map((m) => (
//                 <tr key={m.movieID} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '10px' }}>{m.movieID}</td>
//                   <td style={{ padding: '10px' }}>{m.movieName}</td>
                  
//                   <td style={{ padding: '10px' }}>
//                     {m.dateAdded ? new Date(m.dateAdded).toLocaleDateString() : 'N/A'}
//                   </td>
//                   <td style={{ padding: '10px' }}>
//                     {m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : 'N/A'}
//                   </td>
//                   <td style={{ padding: '10px' }}>{m.numberInStock}</td>
//                   <td style={{ padding: '10px' }}>{m.numberAvailable}</td>
//                   <td style={{ padding: '10px' }}>
//                     <button
//                       type="button"
//                       onClick={() => handleEdit(m)}
//                       style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer' }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handleDelete(m.movieID)}
//                       style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#dc2626',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* --- PAGINATION CONTROLS --- */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
//           disabled={pageNumber === 1 || loading}
//           className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Previous
//         </button>

//         <span className="text-sm">
//           Page <strong>{pageNumber}</strong> of <strong>{totalPages || 1}</strong>
//         </span>

//         <button
//           onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
//           disabled={pageNumber >= totalPages || loading}
//           className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );

  

  
// }


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
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // String/ID state holding the currently selected dropdown option
  const [selectedGenre, setSelectedGenre] = useState('');

  // Pagination
  const [inStockOnly, setInStockOnly] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Validation Errors State
  const [errors, setErrors] = useState({});

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    movieName: '',
    genreID: '',
    releaseDate: '',
    dateAdded: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    numberInStock: 0,
    numberAvailable: 0,
  });

  const loadGenres = async () => {
    setLoadingGenres(true);
    try {
      const response = await genreService.getAll();
      const genreArray = response.data?.data || response.data || [];
      setGenres(genreArray);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    } finally {
      setLoadingGenres(false);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7065/api/movies', {
        params: {
          pageNumber,
          pageSize,
          genreId: selectedGenre || undefined, // FIX #1: Send selectedGenre ID, not the array
          inStockOnly: inStockOnly || undefined,
        },
      });

      const pagedResult = response.data?.data || response.data;

      // Handles both paged response formats (pagedResult.items OR direct array)
      if (Array.isArray(pagedResult)) {
        setMovies(pagedResult);
        setTotalPages(1);
      } else {
        setMovies(pagedResult?.items || []);
        setTotalPages(pagedResult?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Genres on Mount
  useEffect(() => {
    loadGenres();
  }, []);

  // Fetch whenever filters or page changes
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, inStockOnly, pageNumber]); // FIX #3: Trigger on selectedGenre change

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value); // FIX #3: Don't overwrite `genres` state!
    setPageNumber(1);
  };

  const handleStockFilterChange = (e) => {
    setInStockOnly(e.target.checked);
    setPageNumber(1);
  };

  // Filter movies dynamically based on search term
  const filteredMovies = movies.filter((m) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const movieTitle = m.movieName || m.title || '';
    const nameMatch = movieTitle.toLowerCase().includes(term);

    // FIX #2: Safely handle genreID / genreId matching without throwing undefined error
    const gId = m.genreID ?? m.genreId;
    const genreMatch = gId ? gId.toString().includes(term) : false;

    return nameMatch || genreMatch;
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'movieName') {
      updatedValue = value.toUpperCase();
    }

    if (name === 'genreID') {
      updatedValue = value === '' ? '' : parseInt(value, 10);
    }

    if (['numberInStock', 'numberAvailable'].includes(name)) {
      updatedValue = value === '' ? 0 : parseInt(value, 10) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validation Logic
  const validate = () => {
    const newErrors = {};

    if (!formData.movieName.trim()) {
      newErrors.movieName = 'Movie title is required.';
    } else if (formData.movieName.length > 100) {
      newErrors.movieName = 'Movie title cannot exceed 100 characters.';
    }

    if (!formData.genreID) {
      newErrors.genreID = 'Please select a genre.';
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required.';
    }
    if (!formData.dateAdded) {
      newErrors.dateAdded = 'Date added is required.';
    }

    if (formData.numberInStock === '' || isNaN(formData.numberInStock)) {
      newErrors.numberInStock = 'Number in stock is required.';
    } else if (formData.numberInStock < 0 || formData.numberInStock > 20) {
      newErrors.numberInStock = 'Stock must be between 0 and 20.';
    }

    if (formData.numberAvailable === '' || isNaN(formData.numberAvailable)) {
      newErrors.numberAvailable = 'Number available is required.';
    } else if (formData.numberAvailable < 0) {
      newErrors.numberAvailable = 'Available stock cannot be negative.';
    } else if (formData.numberAvailable > formData.numberInStock) {
      newErrors.numberAvailable = 'Available stock cannot exceed total stock.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      movieName: formData.movieName,
      genreID: parseInt(formData.genreID, 10),
      releaseDate: formData.releaseDate,
      dateAdded: formData.dateAdded,
      numberInStock: Number(formData.numberInStock) || 0,
      numberAvailable: Number(formData.numberAvailable) || 0,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await movieService.update(editingId, payload);
      } else {
        await movieService.create(payload);
      }

      resetForm();
      fetchMovies(); // Refresh table
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};

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

  const handleEdit = (movie) => {
    const id = movie.movieID || movie.movieId;
    setEditingId(id);
    setFormData({
      movieName: movie.movieName || '',
      genreID: movie.genreID || movie.genreId || '',
      releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : '',
      dateAdded: movie.dateAdded ? movie.dateAdded.substring(0, 10) : '',
      numberInStock: movie.numberInStock ?? 0,
      numberAvailable: movie.numberAvailable ?? 0,
    });
    setValidationErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await movieService.delete(id);
      fetchMovies();
    } catch (err) {
      console.error('Failed to delete movie:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      movieName: '',
      genreID: '',
      releaseDate: '',
      dateAdded: new Date().toISOString().split('T')[0],
      numberInStock: 0,
      numberAvailable: 0,
    });
    setEditingId(null);
    setValidationErrors({});
    setErrors({});
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
              placeholder="AVENGERS"
              style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
            {errors.movieName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.movieName}</span>}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Genre:</label>
            <select
              name="genreID"
              value={formData.genreID}
              onChange={handleChange}
              disabled={loadingGenres}
              style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            >
              <option value="">{loadingGenres ? 'Loading genres...' : '-- Choose Genre --'}</option>
              {!loadingGenres &&
                genres.map((g) => {
                  const id = g.genreID || g.genreId;
                  return (
                    <option key={id} value={id}>
                      {g.genreName || g.name}
                    </option>
                  );
                })}
            </select>
            {errors.genreID && <span style={{ color: 'red', fontSize: '12px' }}>{errors.genreID}</span>}
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
            {errors.releaseDate && <span style={{ color: 'red', fontSize: '12px' }}>{errors.releaseDate}</span>}
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
            {errors.dateAdded && <span style={{ color: 'red', fontSize: '12px' }}>{errors.dateAdded}</span>}
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
            {errors.numberInStock && <span style={{ color: 'red', fontSize: '12px' }}>{errors.numberInStock}</span>}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Number Available:</label>
            <input
              type="number"
              name="numberAvailable"
              min="0"
              max={formData.numberInStock || 20}
              value={formData.numberAvailable}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
            {errors.numberAvailable && <span style={{ color: 'red', fontSize: '12px' }}>{errors.numberAvailable}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: editingId ? '#2563eb' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {isSubmitting ? 'Saving...' : editingId ? 'Update Movie' : 'Create Movie'}
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

      {/* --- FILTER CONTROLS --- */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Filter by Genre:</label>
          <select value={selectedGenre} onChange={handleGenreChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}>
            <option value="">All Genres</option>
            {Array.isArray(genres) &&
              genres.map((g) => {
                const id = g.genreID || g.genreId;
                return (
                  <option key={id} value={id}>
                    {g.genreName || g.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
            <input type="checkbox" checked={inStockOnly} onChange={handleStockFilterChange} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* --- TABLE HEADER & SEARCH --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Movie List ({filteredMovies.length})</h3>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 30px 8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
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
              <th style={{ padding: '10px' }}>Stock</th>
              <th style={{ padding: '10px' }}>Available</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                  {searchTerm ? `No movies found matching "${searchTerm}"` : 'No movies found.'}
                </td>
              </tr>
            ) : (
              filteredMovies.map((m) => {
                const id = m.movieID || m.movieId;
                return (
                  <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{id}</td>
                    <td style={{ padding: '10px' }}>{m.movieName || m.title}</td>
                    <td style={{ padding: '10px' }}>{m.dateAdded ? new Date(m.dateAdded).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{m.numberInStock}</td>
                    <td style={{ padding: '10px' }}>{m.numberAvailable}</td>
                    <td style={{ padding: '10px' }}>
                      <button type="button" onClick={() => handleEdit(m)} style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* --- PAGINATION CONTROLS --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1 || loading}
          style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          Previous
        </button>

        <span style={{ fontSize: '14px' }}>
          Page <strong>{pageNumber}</strong> of <strong>{totalPages || 1}</strong>
        </span>

        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageNumber >= totalPages || loading}
          style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}