import { Link } from 'react-router-dom';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange }) {
  const statusEmoji = {
    'not-started': '⚪',
    'in-progress': '🟡',
    'completed': '🟢'
  };

  const statusText = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Завершено'
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    onStatusChange(technology.id);
  };

  return (
    <div className="technology-card">
      <h3>{technology.title}</h3>
      <p className="card-description">{technology.description}</p>
      
      <div className="status">
        <span>{statusText[technology.status]}</span>
        <span 
          className="status-icon"
          onClick={handleStatusClick}
          title="Нажмите для смены статуса"
        >
          {statusEmoji[technology.status]}
        </span>
      </div>

      {/* Заметки появляются при hover */}
      <div className="card-notes">
        <h4>📝 Заметки:</h4>
        {technology.notes && technology.notes.trim() !== '' ? (
          <div className="card-notes-text">{technology.notes}</div>
        ) : (
          <div className="card-notes-empty">Нет заметок</div>
        )}
        
        <Link to={`/technology/${technology.id}`} className="card-detail-link">
          Подробнее →
        </Link>
      </div>
    </div>
  );
}

export default TechnologyCard;
