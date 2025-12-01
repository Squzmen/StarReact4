// src/components/DeadlineForm.js
import { useState } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technology, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    deadline: technology?.deadline || '',
    priority: technology?.priority || 'medium',
    reminder: technology?.reminder || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="deadline-form-overlay" onClick={onCancel}>
      <div className="deadline-form-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="deadline-form-header">
            <h2>⏰ Установить дедлайн</h2>
          </div>

          <div className="deadline-form-body">
            <div className="deadline-form-group">
              <label htmlFor="deadline">Дата завершения *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="deadline-form-group">
              <label htmlFor="priority">Приоритет</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">⬇️ Низкий</option>
                <option value="medium">➡️ Средний</option>
                <option value="high">⬆️ Высокий</option>
                <option value="urgent">🔥 Срочный</option>
              </select>
            </div>

            <div className="deadline-form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="reminder"
                  name="reminder"
                  checked={formData.reminder}
                  onChange={handleChange}
                />
                <label htmlFor="reminder">
                  Включить напоминание
                </label>
              </div>
            </div>
          </div>

          <div className="deadline-form-footer">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeadlineForm;
