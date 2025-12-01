// src/components/DataExporter.js
import { useState } from 'react';
import './DataExporter.css';

function DataExporter({ technologies }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeUserData, setIncludeUserData] = useState(true);
  const [exportStatus, setExportStatus] = useState('');

  const exportData = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      technologies: includeUserData 
        ? technologies.map(tech => ({
            ...tech,
            userNotes: tech.notes || '',
            userStatus: tech.status || 'not-started',
            userDeadline: tech.deadline || ''
          }))
        : technologies.map(({ notes, status, deadline, ...tech }) => tech),
      stats: {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length
      }
    };

    let dataStr, fileType, fileName;

    if (exportFormat === 'json') {
      dataStr = JSON.stringify(exportData, null, 2);
      fileType = 'application/json';
      fileName = `technology-roadmap-${new Date().toISOString().split('T')[0]}.json`;
    }

    const blob = new Blob([dataStr], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setExportStatus(`✅ Экспортировано ${technologies.length} технологий`);
    setTimeout(() => setExportStatus(''), 3000);
  };

  const canExport = technologies.length > 0;

  return (
    <div className="data-exporter">
      <h3>📥 Экспорт данных</h3>
      
      <div className="export-options">
        <div className="form-group">
          <label htmlFor="export-format">Формат экспорта</label>
          <select
            id="export-format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="csv" disabled>CSV (скоро)</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeUserData}
              onChange={(e) => setIncludeUserData(e.target.checked)}
            />
            <span>Включить мои заметки и прогресс</span>
          </label>
          <span className="help-text">
            При включении будут экспортированы ваши личные заметки и статусы изучения
          </span>
        </div>
      </div>

      {!canExport && (
        <div className="export-warning" role="alert">
          ⚠️ Нет данных для экспорта. Добавьте технологии в трекер.
        </div>
      )}
      
      {exportStatus && (
        <div className="export-success" role="status">
          {exportStatus}
        </div>
      )}

      <button
        onClick={exportData}
        disabled={!canExport}
        className="btn-primary export-btn"
        aria-describedby={canExport ? 'export-help' : undefined}
      >
        📥 Экспортировать данные
      </button>

      <div id="export-help" className="help-text">
        Данные будут сохранены в выбранном формате на вашем устройстве
      </div>
    </div>
  );
}

export default DataExporter;
