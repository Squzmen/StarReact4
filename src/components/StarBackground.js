import { useEffect, useState } from 'react';
import './StarBackground.css';

function StarBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const numStars = Math.floor(Math.random() * 86) + 75; // 75-160 звёзд
    const newStars = [];
    
    // Типы звёзд с вероятностями (как в реальности)
    const starTypes = [
      { class: 'star-blue', probability: 0.1, glowPower: [4, 8] },      // 10% - горячие голубые
      { class: 'star-white', probability: 0.2, glowPower: [3, 6] },     // 20% - белые
      { class: 'star-yellow', probability: 0.3, glowPower: [2, 5] },    // 30% - жёлтые
      { class: 'star-orange', probability: 0.25, glowPower: [2, 4] },   // 25% - оранжевые
      { class: 'star-red', probability: 0.15, glowPower: [1, 3] }       // 15% - красные холодные
    ];
    
    for (let i = 0; i < numStars; i++) {
      const size = Math.random() * 3 + 1.5; // 1.5-4.5px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 4; // 4-8s
      const delay = Math.random() * 10;
      
      // Выбор типа звезды по вероятности
      const rand = Math.random();
      let cumulativeProbability = 0;
      let selectedType = starTypes[0];
      
      for (const type of starTypes) {
        cumulativeProbability += type.probability;
        if (rand <= cumulativeProbability) {
          selectedType = type;
          break;
        }
      }
      
      const glowIntensity = Math.random() * 
        (selectedType.glowPower[1] - selectedType.glowPower[0]) + 
        selectedType.glowPower[0];
      
      const maxOpacity = Math.random() * 0.4 + 0.6; // 0.6-1.0
      
      newStars.push({
        id: i,
        size,
        top,
        left,
        duration,
        delay,
        type: selectedType.class,
        glowIntensity,
        maxOpacity
      });
    }
    
    setStars(newStars);
  }, []);

  return (
    <div className="star-background">
      {stars.map(star => (
        <div
          key={star.id}
          className={`star ${star.type}`}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            '--size': `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            '--glow': `0 0 ${star.glowIntensity}px var(--color)`,
            '--max-opacity': star.maxOpacity
          }}
        />
      ))}
    </div>
  );
}

export default StarBackground;
