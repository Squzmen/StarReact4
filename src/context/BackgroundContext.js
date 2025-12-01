// src/context/BackgroundContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider');
  }
  return context;
};

export const BackgroundProvider = ({ children }) => {
  const [backgroundType, setBackgroundType] = useState(() => {
    return localStorage.getItem('backgroundType') || 'stars';
  });
  
  const [backgroundData, setBackgroundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const NASA_API_KEY = 'DEMO_KEY';

  // Функция для попытки fetch с разными CORS proxy
  const fetchWithProxy = async (url) => {
    const proxies = [
      '', // Сначала пробуем без proxy
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
    ];

    for (const proxy of proxies) {
      try {
        console.log(`Trying ${proxy ? 'with proxy: ' + proxy : 'direct fetch'}`);
        const fetchUrl = proxy ? `${proxy}${encodeURIComponent(url)}` : url;
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          console.log(`Failed with status: ${response.status}`);
          continue;
        }
        
        const text = await response.text();
        
        // Проверяем что это JSON а не HTML
        if (text.trim().startsWith('<')) {
          console.log('Got HTML instead of JSON, trying next proxy...');
          continue;
        }
        
        const data = JSON.parse(text);
        console.log('✅ Successfully fetched data');
        return data;
      } catch (err) {
        console.log(`Error with ${proxy || 'direct'}: ${err.message}`);
        continue;
      }
    }
    
    throw new Error('Все CORS proxy недоступны');
  };

  useEffect(() => {
    const loadBackground = async () => {
      if (backgroundType === 'stars') {
        setBackgroundData(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        switch (backgroundType) {
          case 'nasa-apod-today':
            try {
              const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
              const data = await fetchWithProxy(apodUrl);
              
              if (data.media_type === 'video') {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const dateStr = yesterday.toISOString().split('T')[0];
                
                const retryUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateStr}`;
                const retryData = await fetchWithProxy(retryUrl);
                
                setBackgroundData({
                  type: 'image',
                  url: retryData.url,
                  title: retryData.title,
                  description: retryData.explanation,
                  date: retryData.date
                });
              } else {
                setBackgroundData({
                  type: 'image',
                  url: data.url,
                  title: data.title,
                  description: data.explanation,
                  date: data.date
                });
              }
            } catch (err) {
              console.error('NASA APOD Today Error:', err);
              throw new Error('NASA APOD недоступен. Проверьте подключение к интернету.');
            }
            break;

          case 'nasa-apod-random':
            try {
              const randomUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=1`;
              const data = await fetchWithProxy(randomUrl);
              
              if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error('Некорректный ответ от API');
              }
              
              const photoData = data[0];
              
              if (photoData.media_type === 'video') {
                console.log('Got video, requesting another...');
                const retryUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=1`;
                const retryData = await fetchWithProxy(retryUrl);
                const retryPhoto = retryData[0];
                
                if (retryPhoto && retryPhoto.media_type !== 'video') {
                  setBackgroundData({
                    type: 'image',
                    url: retryPhoto.url,
                    title: retryPhoto.title,
                    description: retryPhoto.explanation,
                    date: retryPhoto.date
                  });
                } else {
                  // Запасной вариант - вчерашнее фото
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const dateStr = yesterday.toISOString().split('T')[0];
                  
                  const fallbackUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateStr}`;
                  const fallbackData = await fetchWithProxy(fallbackUrl);
                  
                  setBackgroundData({
                    type: 'image',
                    url: fallbackData.url,
                    title: fallbackData.title,
                    description: fallbackData.explanation,
                    date: fallbackData.date
                  });
                }
              } else {
                setBackgroundData({
                  type: 'image',
                  url: photoData.url,
                  title: photoData.title,
                  description: photoData.explanation,
                  date: photoData.date
                });
              }
            } catch (err) {
              console.error('NASA APOD Random Error:', err);
              throw new Error('NASA APOD недоступен. Попробуйте позже.');
            }
            break;

          default:
            setBackgroundData(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Background loading error:', err);
        setError(err.message || 'Ошибка загрузки фона');
        setLoading(false);
      }
    };

    loadBackground();
  }, [backgroundType, refreshTrigger]);

  const changeBackground = (type) => {
    console.log('Changing background to:', type);
    setBackgroundType(type);
    localStorage.setItem('backgroundType', type);
  };

  const refreshRandomPhoto = () => {
    if (backgroundType === 'nasa-apod-random') {
      console.log('Refreshing random photo...');
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <BackgroundContext.Provider
      value={{
        backgroundType,
        backgroundData,
        loading,
        error,
        changeBackground,
        refreshRandomPhoto
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
