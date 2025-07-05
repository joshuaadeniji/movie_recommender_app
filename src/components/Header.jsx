import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, User, Heart, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Film size={24} />
          MovieHub
        </Link>
        
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            {user && (
              <>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/watchlist">Watchlist</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className="user-actions">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-secondary">
                <User size={16} />
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;