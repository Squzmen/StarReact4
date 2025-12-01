import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function Trash() {
  const { deletedTechnologies, restoreTechnology, permanentlyDelete } = useTechnologies();

  const getStatusEmoji = (status) => {
    const emojis = {
      'not-started': '⚪',
      'in-progress': '🟡',
      'completed': '🟢'
    };
    return emojis[status] || '⚪';
  };

  const getStatusText = (status) => {
    const texts = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return texts[status] || 'Не начато';
  };

  const formatDeletedTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🗑️ Корзина</h1>
        <Link to="/technologies" className="btn-secondary">
          ← Назад к списку
        </Link>
      </div>

      {deletedTechnologies.length === 0 ? (
        <div className="empty-state">
          <p>Корзина пуста</p>
          <Link to="/technologies" className="btn-primary">
            Перейти к технологиям
          </Link>
        </div>
      ) : (
        <>
          <p className="trash-info">
            В корзине {deletedTechnologies.length} {deletedTechnologies.length === 1 ? 'технология' : 'технологий'}
          </p>

          <div className="technologies-grid">
            {deletedTechnologies.map(tech => (
              <div key={tech.id} className="technology-item deleted">
                <h3>{tech.title}</h3>
                <p>{tech.description}</p>
                
                <div className="technology-meta">
                  <span className={`status-badge status-${tech.status}`}>
                    {getStatusEmoji(tech.status)} {getStatusText(tech.status)}
                  </span>
                </div>

                <div className="deleted-info">
                  <small>Удалено: {formatDeletedTime(tech.deletedAt)}</small>
                </div>

                <div className="trash-actions">
                  <button 
                    onClick={() => restoreTechnology(tech.id)}
                    className="btn-restore"
                  >
                    ↺ Восстановить
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Удалить навсегда? Это действие нельзя отменить.')) {
                        permanentlyDelete(tech.id);
                      }
                    }}
                    className="btn-delete-permanent"
                  >
                    ✕ Удалить навсегда
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Trash;
