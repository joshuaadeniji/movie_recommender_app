import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-year">
          <Calendar size={14} />
          {releaseYear}
        </div>
        <div className="movie-rating">
          <Star size={14} />
          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </div>
        {movie.overview && (
          <p className="movie-overview">{movie.overview}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;