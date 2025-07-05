import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import api from '../utils/api';

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      if (userData.favorites && userData.favorites.length > 0) {
        const moviePromises = userData.favorites.map(id => 
          api.get(`/movies/${id}`).catch(() => null)
        );
        const movieResponses = await Promise.all(moviePromises);
        const movies = movieResponses.filter(Boolean).map(res => res.data);
        setFavoriteMovies(movies);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      await api.delete(`/users/favorites/${movieId}`);
      setFavoriteMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Heart size={32} style={{ color: '#fd79a8' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>My Favorites</h1>
      </div>

      {favoriteMovies.length > 0 ? (
        <div className="movie-grid">
          {favoriteMovies.map(movie => (
            <div key={movie.id} style={{ position: 'relative' }}>
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFavorite(movie.id)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 107, 107, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 107, 107, 1)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 107, 107, 0.9)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: '#a0a0a0', 
          padding: '4rem 2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Heart size={64} style={{ marginBottom: '2rem', color: '#fd79a8' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No favorites yet</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Start exploring movies and add them to your favorites!<br />
            Your favorite movies will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;