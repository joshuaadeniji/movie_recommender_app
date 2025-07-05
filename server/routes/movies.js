import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || 'demo_key';
const TMDB_BASE_URL = process.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching movies' });
  }
});

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: { api_key: TMDB_API_KEY }
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
        params: { api_key: TMDB_API_KEY }
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, {
        params: { api_key: TMDB_API_KEY }
      })
    ]);

    const movie = movieResponse.data;
    const credits = creditsResponse.data;
    const videos = videosResponse.data;

    res.json({
      ...movie,
      credits,
      videos
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie details' });
  }
});

// Get trending movies
router.get('/trending/week', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending movies' });
  }
});

// Get movie recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

export default router;