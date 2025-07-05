import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import api from '../utils/api';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      searchMovies(q);
    }
  }, [location]);

  const searchMovies = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await api.get('/movies/search', {
        params: { query: searchQuery }
      });
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    searchMovies(newQuery);
    // Update URL
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {query && (
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Search Results for "{query}"
        </h2>
      )}

      {loading && <Loading />}

      {!loading && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && query && movies.length === 0 && (
        <div style={{ textAlign: 'center', color: '#a0a0a0', marginTop: '3rem' }}>
          <p>No movies found for "{query}"</p>
          <p>Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
};

export default Search;