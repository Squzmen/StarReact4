// src/pages/TechnologyDetail.js
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyNotes from '../components/TechnologyNotes';
import DeadlineForm from '../components/DeadlineForm';
import './Pages.css';

function TechnologyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    technologies, 
    updateStatus, 
    deleteTechnology,
    setDeadline
  } = useTechnologies();

  const [showDeadlineForm, setShowDeadlineForm] = useState(false);

  const technology = technologies.find(tech => tech.id === parseInt(id));

  if (!technology) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Технология не найдена</h2>
          <button onClick={() => navigate('/technologies')} className="btn-primary">
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-not-started';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '✅ Завершено';
      case 'in-progress':
        return '🔄 В процессе';
      default:
        return '⏳ Не начато';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить технологию "${technology.title}"?`)) {
      deleteTechnology(technology.id);
      navigate('/technologies');
    }
  };

  const handleSaveDeadline = (deadlineData) => {
    setDeadline(technology.id, deadlineData);
    setShowDeadlineForm(false);
  };

  const renderDeadlineInfo = () => {
    if (!technology.deadline) return null;

    const deadlineDate = new Date(technology.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const priorityEmoji = {
      low: '⬇️',
      medium: '➡️',
      high: '⬆️',
      urgent: '🔥'
    };

    const priorityLabel = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      urgent: 'Срочный'
    };

    return (
      <div className="deadline-info-box">
        <div className="deadline-row">
          <span className="deadline-label">📅 Дедлайн:</span>
          <span className="deadline-date">
            {new Date(technology.deadline).toLocaleDateString('ru-RU')}
            {diffDays >= 0 ? ` (через ${diffDays} дн.)` : ` (просрочено на ${Math.abs(diffDays)} дн.)`}
          </span>
        </div>
        {technology.priority && (
          <div className="deadline-row">
            <span className="deadline-label">Приоритет:</span>
            <span className="deadline-priority">
              {priorityEmoji[technology.priority]} {priorityLabel[technology.priority]}
            </span>
          </div>
        )}
        {technology.reminder && (
          <div className="deadline-row">
            <span className="reminder-badge">🔔 Напоминание включено</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="detail-header">
        <button onClick={() => navigate('/technologies')} className="back-button">
          ← Назад
        </button>
        <h1>{technology.title}</h1>
        <span className={`status-badge ${getStatusClass(technology.status)}`}>
          {getStatusText(technology.status)}
        </span>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Описание</h2>
          <p>{technology.description}</p>
        </div>
      
        {technology.category && (
          <div className="detail-section">
            <h2>Категория</h2>
            <span className="category-badge">{technology.category}</span>
          </div>
        )}

        <div className="detail-section">
          <div className="section-header-with-button">
            <h2>⏰ Сроки изучения</h2>
            <button 
              className="btn-secondary small-btn" 
              onClick={() => setShowDeadlineForm(true)}
            >
              {technology.deadline ? 'Изменить' : 'Установить дедлайн'}
            </button>
          </div>
          {renderDeadlineInfo() || (
            <p className="no-deadline">Дедлайн не установлен</p>
          )}
        </div>

        <TechnologyNotes technology={technology} />

        <div className="detail-actions">
          <button
            onClick={() => updateStatus(technology.id)}
            className="btn-primary"
          >
            Изменить статус
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Удалить
          </button>
        </div>
      </div>

      {showDeadlineForm && (
        <DeadlineForm
          technology={technology}
          onSave={handleSaveDeadline}
          onCancel={() => setShowDeadlineForm(false)}
        />
      )}
    </div>
  );
}

export default TechnologyDetail;
