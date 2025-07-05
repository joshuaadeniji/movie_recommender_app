import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [popularResponse, trendingResponse] = await Promise.all([
        api.get('/movies/popular'),
        api.get('/movies/trending/week')
      ]);

      setPopularMovies(popularResponse.data.results || []);
      setTrendingMovies(trendingResponse.data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Discover Your Next Favorite Movie</h1>
        <p className="hero-subtitle">
          Explore thousands of movies, create watchlists, and get personalized recommendations
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Trending This Week
        </h2>
        <div className="movie-grid">
          {trendingMovies.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Popular Movies
        </h2>
        <div className="movie-grid">
          {popularMovies.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;