// src/components/DynamicBackground.js
import { useEffect } from 'react';
import { useBackground } from '../context/BackgroundContext';
import StarBackground from './StarBackground';
import './DynamicBackground.css';

function DynamicBackground() {
  const { backgroundType, backgroundData, loading, error } = useBackground();

  useEffect(() => {
    console.log('=== DynamicBackground ===');
    console.log('Type:', backgroundType);
    console.log('Data:', backgroundData);
  }, [backgroundType, backgroundData]);

  if (backgroundType === 'stars') {
    return <StarBackground />;
  }

  if (loading) {
    return (
      <div className="dynamic-background loading">
        <StarBackground />
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Загрузка космического фона...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !backgroundData) {
    return <StarBackground />;
  }

  return (
    <div className="dynamic-background active">
      <img 
        src={backgroundData.url}
        alt={backgroundData.title || 'Space'}
        className="background-image-direct"
        onLoad={() => console.log('✅ Image loaded:', backgroundData.url)}
        onError={(e) => {
          console.error('❌ Image failed:', backgroundData.url);
          e.target.style.display = 'none';
        }}
      />
      <div className="background-overlay"></div>

      {backgroundData.title && (
        <div className="background-info">
          <button className="info-toggle" onClick={(e) => {
            e.currentTarget.parentElement.classList.toggle('expanded');
          }}>
            ℹ️ Инфо
          </button>
          <div className="info-content">
            <h4>{backgroundData.title}</h4>
            {backgroundData.date && (
              <p className="info-date">📅 {backgroundData.date}</p>
            )}
            {backgroundData.description && (
              <p>{backgroundData.description.substring(0, 150)}...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicBackground;
