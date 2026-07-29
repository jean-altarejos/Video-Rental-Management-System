import React, { useState, useEffect } from 'react';
import { genreService } from '../services/genreService';

export default function GenreSelect({ value, onChange, name = "genreID", error }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    genreService.getAll()
      .then(res => setGenres(res.data))
      .catch(err => console.error('Error fetching genres:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <select disabled><option>Loading genres...</option></select>;

  return (
    <div>
      <select name={name} value={value || ''} onChange={onChange}>
        <option value="">-- Select Genre --</option>
        {genres.map((g) => (
          <option key={g.genreID} value={g.genreID}>
            {g.genreName}
          </option>
        ))}
      </select>
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </div>
  );
}