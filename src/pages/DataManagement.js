// src/pages/DataManagement.js
import { useState } from 'react';
import DataExporter from '../components/DataExporter';
import DataImporter from '../components/DataImporter';
import BulkStatusEditor from '../components/BulkStatusEditor';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';
import './DataManagement.css';

function DataManagement() {
  const { 
    technologies, 
    importTechnologies, 
    bulkUpdateStatus 
  } = useTechnologies();
  
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  const handleImport = (importedTechs) => {
    importTechnologies(importedTechs);
  };

  const handleBulkUpdate = (techIds, newStatus) => {
    bulkUpdateStatus(techIds, newStatus);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🗂️ Управление данными</h1>
      </div>

      <div className="data-management-grid">
        {/* Блок импорта */}
        <DataImporter onImport={handleImport} />

        {/* Блок экспорта */}
        <DataExporter technologies={technologies} />

        {/* Блок массового редактирования */}
        <div className="management-card">
          <h3>✏️ Массовое редактирование</h3>
          <p className="card-description">
            Измените статус нескольких технологий одновременно
          </p>
          <button 
            className="btn-primary"
            onClick={() => setShowBulkEditor(true)}
            disabled={technologies.length === 0}
          >
            📝 Открыть редактор ({technologies.length})
          </button>
          {technologies.length === 0 && (
            <p className="help-text">
              Добавьте технологии для использования
            </p>
          )}
        </div>

        {/* Статистика */}
        <div className="management-card stats-card">
          <h3>📊 Статистика</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{technologies.length}</span>
              <span className="stat-label">Всего</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-completed">
                {technologies.filter(t => t.status === 'completed').length}
              </span>
              <span className="stat-label">Завершено</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-progress">
                {technologies.filter(t => t.status === 'in-progress').length}
              </span>
              <span className="stat-label">В процессе</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-not-started">
                {technologies.filter(t => t.status === 'not-started').length}
              </span>
              <span className="stat-label">Не начато</span>
            </div>
          </div>
        </div>
      </div>

      {showBulkEditor && (
        <BulkStatusEditor
          technologies={technologies}
          onUpdate={handleBulkUpdate}
          onClose={() => setShowBulkEditor(false)}
        />
      )}
    </div>
  );
}

export default DataManagement;
