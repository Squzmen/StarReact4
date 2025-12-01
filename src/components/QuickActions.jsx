import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, technologies }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toLocaleString('ru-RU'),
      totalTechnologies: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      technologies: technologies
    };
    setExportData(JSON.stringify(data, null, 2));
    setShowExportModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    alert('Данные скопированы в буфер обмена!');
  };

  return (
    <>
      <div className="quick-actions">
        <button onClick={onMarkAllCompleted}>
          ✅ Отметить все
        </button>
        <button onClick={onResetAll}>
          🔄 Сбросить все
        </button>
        <button onClick={handleExport}>
          📤 Экспорт данных
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные успешно подготовлены для экспорта!</p>
        <textarea 
          readOnly 
          value={exportData}
          rows={10}
          style={{
            width: '100%',
            background: 'rgba(0, 5, 15, 0.8)',
            color: '#d4af37',
            border: '1px solid #d4af37',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '0.85em'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={copyToClipboard}>
            📋 Копировать
          </button>
          <button onClick={() => setShowExportModal(false)}>
            Закрыть
          </button>
        </div>
      </Modal>
    </>
  );
}

export default QuickActions;
