import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory user storage (replace with actual database)
const users = [];

// Add to favorites
router.post('/favorites', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
    }

    res.json({ message: 'Movie added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/favorites/:movieId', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.params;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id !== parseInt(movieId));

    res.json({ message: 'Movie removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to watchlist
router.post('/watchlist', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.watchlists.includes(movieId)) {
      user.watchlists.push(movieId);
    }

    res.json({ message: 'Movie added to watchlist', watchlists: user.watchlists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from watchlist
router.delete('/watchlist/:movieId', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.params;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watchlists = user.watchlists.filter(id => id !== parseInt(movieId));

    res.json({ message: 'Movie removed from watchlist', watchlists: user.watchlists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate movie
router.post('/rate', authenticateToken, (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    user.ratings[movieId] = rating;

    res.json({ message: 'Movie rated successfully', ratings: user.ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;