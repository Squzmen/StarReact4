import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="progress-header">
      <h2>Трекер изучения технологий</h2>
      <p>Общее: {total} | Изучено: {completed} | В процессе: {inProgress} | Не начато: {notStarted}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <p>Прогресс: {progressPercentage}%</p>
    </header>
  );
}

export default ProgressHeader;