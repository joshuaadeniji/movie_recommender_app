import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import api from '../utils/api';

const Watchlist = () => {
  const { user } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      if (userData.watchlists && userData.watchlists.length > 0) {
        const moviePromises = userData.watchlists.map(id => 
          api.get(`/movies/${id}`).catch(() => null)
        );
        const movieResponses = await Promise.all(moviePromises);
        const movies = movieResponses.filter(Boolean).map(res => res.data);
        setWatchlistMovies(movies);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.delete(`/users/watchlist/${movieId}`);
      setWatchlistMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const markAsWatched = async (movieId) => {
    try {
      // In a real app, you might have a "watched" endpoint
      await api.delete(`/users/watchlist/${movieId}`);
      setWatchlistMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Bookmark size={32} style={{ color: '#6c5ce7' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>My Watchlist</h1>
      </div>

      {watchlistMovies.length > 0 ? (
        <div className="movie-grid">
          {watchlistMovies.map(movie => (
            <div key={movie.id} style={{ position: 'relative' }}>
              <MovieCard movie={movie} />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => markAsWatched(movie.id)}
                  style={{
                    background: 'rgba(0, 184, 148, 0.9)',
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
                    e.target.style.background = 'rgba(0, 184, 148, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 184, 148, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Mark as watched"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  style={{
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
                  title="Remove from watchlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
          <Bookmark size={64} style={{ marginBottom: '2rem', color: '#6c5ce7' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No movies in watchlist</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Add movies you want to watch later!<br />
            Your watchlist will help you keep track of movies to watch.
          </p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;