import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Heart, Bookmark, Play, ArrowLeft, Users, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import api from '../utils/api';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchRecommendations();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data);
      
      // Check if movie is in user's favorites and watchlist
      if (user) {
        const userResponse = await api.get('/auth/me');
        const userData = userResponse.data;
        setIsFavorite(userData.favorites?.includes(parseInt(id)));
        setIsInWatchlist(userData.watchlists?.includes(parseInt(id)));
        setUserRating(userData.ratings?.[id] || 0);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/movies/${id}/recommendations`);
      setRecommendations(response.data.results?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
      } else {
        await api.post('/users/favorites', { movieId: parseInt(id) });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist) {
        await api.delete(`/users/watchlist/${id}`);
      } else {
        await api.post('/users/watchlist', { movieId: parseInt(id) });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/users/rate', { movieId: parseInt(id), rating });
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', color: '#a0a0a0', marginTop: '3rem' }}>
        <p>Movie not found</p>
      </div>
    );
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const trailer = movie.videos?.results?.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="movie-details">
      {backdropUrl && (
        <div 
          className="movie-backdrop"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
            position: 'relative',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(26, 26, 46, 0.9), rgba(26, 26, 46, 0.3))',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2rem'
          }}>
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              style={{ position: 'absolute', top: '2rem', left: '2rem' }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </div>
      )}

      <div className="movie-header">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="movie-poster-large"
        />
        
        <div className="movie-details-info">
          <h1 className="movie-title-large">{movie.title}</h1>
          
          <div className="movie-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} />
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              {movie.runtime ? `${movie.runtime} min` : 'N/A'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={16} />
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {movie.genres?.map(genre => (
              <span key={genre.id} className="movie-genre">
                {genre.name}
              </span>
            ))}
          </div>

          {director && (
            <p style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
              <strong>Director:</strong> {director.name}
            </p>
          )}

          <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
            {movie.overview}
          </p>

          <div className="movie-actions">
            {trailer && (
              <button 
                onClick={() => setShowTrailer(true)}
                className="btn btn-primary"
              >
                <Play size={16} />
                Watch Trailer
              </button>
            )}
            
            {user && (
              <>
                <button 
                  onClick={toggleFavorite}
                  className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Heart size={16} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                <button 
                  onClick={toggleWatchlist}
                  className={`btn ${isInWatchlist ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Bookmark size={16} />
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </>
            )}
          </div>

          {user && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Rate this movie:</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className={`btn ${userRating >= rating ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', minWidth: '40px' }}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {mainCast.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            Cast
          </h2>
          <div className="cast-grid">
            {mainCast.map(person => (
              <div key={person.id} className="cast-member">
                <img 
                  src={person.profile_path 
                    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Photo'
                  }
                  alt={person.name}
                  className="cast-photo"
                />
                <h4 className="cast-name">{person.name}</h4>
                <p className="cast-character">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            Recommended Movies
          </h2>
          <div className="movie-grid">
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {showTrailer && trailer && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowTrailer(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              style={{ borderRadius: '1rem' }}
              allowFullScreen
            />
            <button 
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;