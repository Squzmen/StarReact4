// src/components/TechnologyNotes.js
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyNotes.css';

function TechnologyNotes({ technology }) {
  const { updateNotes } = useTechnologies();
  const [notes, setNotes] = useState(technology.notes || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateNotes(technology.id, notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(technology.notes || '');
    setIsEditing(false);
  };

  return (
    <div className="technology-notes">
      <div className="notes-header">
        <h3>📝 Заметки</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-secondary small">
            Редактировать
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте свои заметки о технологии..."
            rows={6}
          />
          <div className="notes-actions">
            <button onClick={handleSave} className="btn-primary">
              Сохранить
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Отмена
            </button>
          </div>
        </>
      ) : (
        <div className="notes-content">
          {notes ? (
            <p>{notes}</p>
          ) : (
            <p className="no-notes">Заметок пока нет. Нажмите "Редактировать", чтобы добавить.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TechnologyNotes;
