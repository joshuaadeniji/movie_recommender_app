import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Heart, Bookmark, Star, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import api from '../utils/api';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalWatchlist: 0,
    totalRatings: 0
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      setStats({
        totalFavorites: userData.favorites?.length || 0,
        totalWatchlist: userData.watchlists?.length || 0,
        totalRatings: Object.keys(userData.ratings || {}).length
      });

      // Fetch favorite movies details
      if (userData.favorites?.length > 0) {
        const favoritePromises = userData.favorites.slice(0, 6).map(id => 
          api.get(`/movies/${id}`).catch(() => null)
        );
        const favoriteResponses = await Promise.all(favoritePromises);
        setFavoriteMovies(favoriteResponses.filter(Boolean).map(res => res.data));
      }

      // Fetch watchlist movies details
      if (userData.watchlists?.length > 0) {
        const watchlistPromises = userData.watchlists.slice(0, 6).map(id => 
          api.get(`/movies/${id}`).catch(() => null)
        );
        const watchlistResponses = await Promise.all(watchlistPromises);
        setWatchlistMovies(watchlistResponses.filter(Boolean).map(res => res.data));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd have an update profile endpoint
      console.log('Saving profile changes...');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="profile-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="profile-header" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '3rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6c5ce7, #fd79a8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          
          <div style={{ flex: 1 }}>
            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '2rem', fontWeight: 'bold' }}
                />
                <button onClick={handleSave} className="btn btn-primary">
                  <Save size={16} />
                </button>
                <button onClick={() => setEditMode(false)} className="btn btn-secondary">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {user?.name}
                </h1>
                <button onClick={() => setEditMode(true)} className="btn btn-secondary">
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', color: '#a0a0a0' }}>
              <Mail size={16} />
              {user?.email}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', color: '#a0a0a0' }}>
              <Calendar size={16} />
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fd79a8' }}>
              {stats.totalFavorites}
            </div>
            <div style={{ color: '#a0a0a0' }}>Favorites</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c5ce7' }}>
              {stats.totalWatchlist}
            </div>
            <div style={{ color: '#a0a0a0' }}>Watchlist</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b894' }}>
              {stats.totalRatings}
            </div>
            <div style={{ color: '#a0a0a0' }}>Ratings</div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`btn ${activeTab === 'favorites' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Heart size={16} />
            Favorites
          </button>
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`btn ${activeTab === 'watchlist' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Bookmark size={16} />
            Watchlist
          </button>
        </div>

        {activeTab === 'favorites' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              Favorite Movies
            </h2>
            {favoriteMovies.length > 0 ? (
              <div className="movie-grid">
                {favoriteMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#a0a0a0', padding: '3rem' }}>
                <Heart size={48} style={{ marginBottom: '1rem' }} />
                <p>No favorite movies yet</p>
                <p>Start exploring and add movies to your favorites!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              Watchlist
            </h2>
            {watchlistMovies.length > 0 ? (
              <div className="movie-grid">
                {watchlistMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#a0a0a0', padding: '3rem' }}>
                <Bookmark size={48} style={{ marginBottom: '1rem' }} />
                <p>No movies in watchlist yet</p>
                <p>Add movies you want to watch later!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;