import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyCard from '../components/TechnologyCard';
import './Pages.css';

function TechnologyList() {
  const { technologies, deletedTechnologies, updateStatus, resetToInitial } = useTechnologies();
  const [filter, setFilter] = useState('all');

  const filteredTechs = technologies.filter(tech => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  const handleReset = () => {
    if (window.confirm('Восстановить все технологии к начальному состоянию? Корзина будет очищена.')) {
      resetToInitial();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="header-actions">
          <Link to="/trash" className="btn-trash">
            🗑️ Корзина {deletedTechnologies.length > 0 && `(${deletedTechnologies.length})`}
          </Link>
          <Link to="/add-technology" className="btn-primary">
            + Добавить технологию
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все ({technologies.length})
        </button>
        <button 
          className={filter === 'not-started' ? 'active' : ''}
          onClick={() => setFilter('not-started')}
        >
          ⚪ Не начато
        </button>
        <button 
          className={filter === 'in-progress' ? 'active' : ''}
          onClick={() => setFilter('in-progress')}
        >
          🟡 В процессе
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          🟢 Завершено
        </button>
      </div>

      {/* Сетка карточек */}
      <div className="tech-cards-grid">
        {filteredTechs.map(tech => (
          <TechnologyCard 
            key={tech.id}
            technology={tech}
            onStatusChange={updateStatus}
          />
        ))}
      </div>

      {filteredTechs.length === 0 && (
        <div className="empty-state">
          <p>Технологий с таким статусом пока нет.</p>
          <Link to="/add-technology" className="btn-primary">
            Добавить технологию
          </Link>
        </div>
      )}

      {/* Кнопка сброса под карточками */}
      <div className="reset-section">
        <button onClick={handleReset} className="reset-button-bottom">
          🔄 Восстановить к начальному состоянию
        </button>
      </div>
    </div>
  );
}

export default TechnologyList;
