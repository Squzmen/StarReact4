// src/components/BackgroundSelector.js
import { useState } from 'react';
import { useBackground } from '../context/BackgroundContext';
import './BackgroundSelector.css';

function BackgroundSelector() {
  const { backgroundType, changeBackground, loading, error, refreshRandomPhoto, backgroundData } = useBackground();
  const [isOpen, setIsOpen] = useState(false);

  const backgrounds = [
    { id: 'stars', name: 'Звёздный фон', icon: '✨', description: 'Анимированный звездный космос.' },
    { id: 'nasa-apod-today', name: 'NASA: Сегодня', icon: '🛰️', description: 'Астрономическое фото дня NASA.' },
    { id: 'nasa-apod-random', name: 'NASA: Случайное', icon: '🎲', description: 'Случайное космическое фото NASA.' }
  ];

  const handleSelect = (id) => {
    changeBackground(id);
  };

  const handleRetry = () => {
    const currentType = backgroundType;
    changeBackground('stars');
    setTimeout(() => changeBackground(currentType), 100);
  };

  const handleRefreshRandom = () => {
    refreshRandomPhoto();
  };

  const currentBg = backgrounds.find(bg => bg.id === backgroundType);

  const isPhotoBackground = backgroundType === 'nasa-apod-today' || backgroundType === 'nasa-apod-random';

  return (
    <div className={`background-selector ${isOpen ? 'open' : ''}`}>
      <button 
        className="selector-tab" 
        onClick={() => setIsOpen(!isOpen)} 
        title="Выбор фона"
      >
        <span className="tab-icon">{currentBg?.icon}</span>
        <span className="tab-text">{currentBg?.name || 'Фон'}</span>
      </button>

      <div className="selector-panel">
        <div className="panel-header">
          <h3>Фон</h3>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {loading && (
          <div className="panel-loading">
            <div className="spinner"></div>
            <p>Загружаем космические данные...</p>
          </div>
        )}

        {error && (
          <div className="panel-error">
            <div>{error}</div>
            <button onClick={handleRetry} className="retry-btn">
              Повторить
            </button>
          </div>
        )}

        <div className="background-options">
          {backgrounds.map(bg => (
            <div key={bg.id} className="option-wrapper">
              <button
                className={`background-option ${backgroundType === bg.id ? 'active' : ''}`}
                onClick={() => handleSelect(bg.id)}
                disabled={loading}
              >
                <span className="option-icon">{bg.icon}</span>
                <div className="option-info">
                  <div className="option-name">{bg.name}</div>
                  <div className="option-description">{bg.description}</div>
                </div>
                {backgroundType === bg.id && (
                  <span className="option-checkmark">★</span>
                )}
              </button>

              {bg.id === 'nasa-apod-random' && backgroundType === 'nasa-apod-random' && (
                <button
                  className="refresh-random-btn"
                  onClick={handleRefreshRandom}
                  disabled={loading}
                >
                  🔄 Новое случайное фото
                </button>
              )}
            </div>
          ))}
        </div>

        {/* НОВЫЙ БЛОК ИНФО ТОЛЬКО ДЛЯ ФОТО */}
        {isPhotoBackground && backgroundData && (
          <div className="background-info-panel">
            <h4 className="bg-info-title">{backgroundData.title}</h4>
            {backgroundData.date && (
              <p className="bg-info-date">{backgroundData.date}</p>
            )}
            {backgroundData.description && (
              <p className="bg-info-description">
                {backgroundData.description.substring(0, 220)}...
              </p>
            )}
          </div>
        )}
      </div>

      {isOpen && <div className="selector-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

export default BackgroundSelector;
