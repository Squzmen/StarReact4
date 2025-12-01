// src/components/Navigation.js
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/technologies', label: 'Технологии', icon: '📚' },
    { path: '/data-management', label: 'Управление', icon: '🗂️' },
    { path: '/add-technology', label: 'Добавить', icon: '➕' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">Tech Tracker</span>
        </Link>
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
