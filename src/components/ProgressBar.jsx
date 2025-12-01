import './ProgressBar.css';

function ProgressBar({ 
  progress = 0,
  label = '',
  color = '#d4af37',
  height = 30,
  showPercentage = true,
  animated = false
}) {
  // Нормализация прогресса
  const normalizedProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className="progress-bar-component">
      {(label || showPercentage) && (
        <div className="progress-header-info">
          {label && <span className="progress-label-text">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage-text">{normalizedProgress}%</span>
          )}
        </div>
      )}
      
      <div 
        className="progress-outer-bar"
        style={{ height: `${height}px` }}
      >
        <div
          className={`progress-inner-fill ${animated ? 'animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            background: normalizedProgress > 0 
              ? `linear-gradient(to right, ${color}, #ffd700)` 
              : 'transparent'
          }}
        >
          {/* Индикатор для пустого прогресса */}
          {normalizedProgress === 0 && (
            <div className="empty-progress-indicator"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
