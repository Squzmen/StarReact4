// src/components/BulkStatusEditor.js
import { useState, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onUpdate, onClose }) {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');

  // Скрыть навигацию при открытии
  useEffect(() => {
    const navigation = document.querySelector('.navigation');
    if (navigation) {
      navigation.style.display = 'none';
    }

    // Вернуть навигацию при закрытии
    return () => {
      if (navigation) {
        navigation.style.display = 'block';
      }
    };
  }, []);

  const handleToggle = (techId) => {
    setSelectedTechs(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTechs.length === technologies.length) {
      setSelectedTechs([]);
    } else {
      setSelectedTechs(technologies.map(tech => tech.id));
    }
  };

  const handleUpdate = () => {
    if (selectedTechs.length === 0) {
      alert('Выберите хотя бы одну технологию');
      return;
    }
    onUpdate(selectedTechs, newStatus);
    onClose();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return '✅ Завершено';
      case 'in-progress': return '🔄 В процессе';
      default: return '⏳ Не начато';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bulk-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Массовое редактирование</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="selection-controls">
            <button onClick={handleSelectAll} className="btn-secondary">
              {selectedTechs.length === technologies.length 
                ? '❌ Снять все' 
                : '☑️ Выбрать все'}
            </button>
            <span className="selection-count">
              Выбрано: {selectedTechs.length} из {technologies.length}
            </span>
          </div>

          <div className="tech-list">
            {technologies.map(tech => (
              <div 
                key={tech.id} 
                className={`tech-item ${selectedTechs.includes(tech.id) ? 'selected' : ''}`}
                onClick={() => handleToggle(tech.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedTechs.includes(tech.id)}
                  onChange={() => handleToggle(tech.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="tech-info">
                  <span className="tech-title">{tech.title}</span>
                  <span className="tech-current-status">
                    {getStatusLabel(tech.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="status-selector">
            <label htmlFor="new-status">Новый статус:</label>
            <select 
              id="new-status"
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="not-started">⏳ Не начато</option>
              <option value="in-progress">🔄 В процессе</option>
              <option value="completed">✅ Завершено</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Отмена
          </button>
          <button 
            onClick={handleUpdate} 
            className="btn-primary"
            disabled={selectedTechs.length === 0}
          >
            Применить к выбранным ({selectedTechs.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkStatusEditor;
