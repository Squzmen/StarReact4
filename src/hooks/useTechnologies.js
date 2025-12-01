// src/hooks/useTechnologies.js
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов',
    status: 'completed',
    category: 'frontend',
    notes: 'Изучил функциональные и классовые компоненты. Понял разницу между props и state. Практиковался на создании переиспользуемых компонентов.'
  },
  {
    id: 2,
    title: 'JSX Syntax',
    description: 'Освоение синтаксиса JSX',
    status: 'in-progress',
    category: 'frontend',
    notes: 'JSX упрощает создание UI. Важно помнить что это синтаксический сахар для React.createElement(). Разобрался с условным рендерингом и списками.'
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов',
    status: 'in-progress',
    category: 'frontend',
    notes: 'Использую useState для локального состояния. Изучаю useReducer для сложной логики. Планирую изучить Redux.'
  },
  {
    id: 4,
    title: 'React Hooks',
    description: 'Современные хуки React',
    status: 'not-started',
    category: 'frontend',
    notes: 'useState, useEffect, useContext - базовые хуки. Нужно изучить useMemo и useCallback для оптимизации производительности.'
  },
  {
    id: 5,
    title: 'React Router',
    description: 'Маршрутизация в React приложениях',
    status: 'in-progress',
    category: 'frontend',
    notes: 'Разобрался с BrowserRouter, Routes, Route. Изучил навигацию с Link и useNavigate. Осталось освоить защищённые маршруты и lazy loading.'
  },
  {
    id: 6,
    title: 'CSS-in-JS',
    description: 'Стилизация компонентов',
    status: 'not-started',
    category: 'frontend',
    notes: 'Styled-components выглядит интересно. Также хочу попробовать Emotion и CSS Modules.'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);
  const [deletedTechnologies, setDeletedTechnologies] = useLocalStorage('deletedTechnologies', []);

  const updateStatus = (techId) => {
    setTechnologies(prev =>
      prev.map(tech => {
        if (tech.id === techId) {
          let newStatus;
          if (tech.status === 'not-started') newStatus = 'in-progress';
          else if (tech.status === 'in-progress') newStatus = 'completed';
          else newStatus = 'not-started';
          return { ...tech, status: newStatus };
        }
        return tech;
      })
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // НОВОЕ: Установка дедлайна (Задание 1)
  const setDeadline = (techId, deadlineData) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId 
          ? { 
              ...tech, 
              deadline: deadlineData.deadline,
              priority: deadlineData.priority,
              reminder: deadlineData.reminder
            } 
          : tech
      )
    );
  };

  // НОВОЕ: Массовое обновление статусов (Задание 2)
  const bulkUpdateStatus = (techIds, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        techIds.includes(tech.id)
          ? { ...tech, status: newStatus }
          : tech
      )
    );
  };

  // НОВОЕ: Импорт технологий
  const importTechnologies = (importedTechs) => {
    const maxId = technologies.length > 0 
      ? Math.max(...technologies.map(t => t.id))
      : 0;

    const newTechs = importedTechs.map((tech, index) => ({
      ...tech,
      id: tech.id || (maxId + index + 1),
      status: tech.status || tech.userStatus || 'not-started',
      notes: tech.notes || tech.userNotes || '',
      deadline: tech.deadline || tech.userDeadline || '',
      category: tech.category || 'other'
    }));

    // Объединяем с существующими, избегая дубликатов
    setTechnologies(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const uniqueNewTechs = newTechs.filter(t => !existingIds.has(t.id));
      return [...prev, ...uniqueNewTechs];
    });
  };

  const markAllCompleted = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
  };

  const resetAll = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
  };

  const randomNext = () => {
    const unfinished = technologies.filter(tech => tech.status !== 'completed');
    if (unfinished.length === 0) {
      alert('Все технологии уже завершены! 🎉');
      return;
    }

    const randomTech = unfinished[Math.floor(Math.random() * unfinished.length)];
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === randomTech.id
          ? { ...tech, status: 'in-progress' }
          : tech
      )
    );
  };

  const deleteTechnology = (techId) => {
    const techToDelete = technologies.find(tech => tech.id === techId);
    if (techToDelete) {
      setDeletedTechnologies(prev => [...prev, { ...techToDelete, deletedAt: Date.now() }]);
      setTechnologies(prev => prev.filter(tech => tech.id !== techId));
    }
  };

  const restoreTechnology = (techId) => {
    const techToRestore = deletedTechnologies.find(tech => tech.id === techId);
    if (techToRestore) {
      const { deletedAt, ...cleanTech } = techToRestore;
      setTechnologies(prev => [...prev, cleanTech]);
      setDeletedTechnologies(prev => prev.filter(tech => tech.id !== techId));
    }
  };

  const permanentlyDelete = (techId) => {
    setDeletedTechnologies(prev => prev.filter(tech => tech.id !== techId));
  };

  const resetToInitial = () => {
    setTechnologies(initialTechnologies);
    setDeletedTechnologies([]);
  };

  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  return {
    technologies,
    deletedTechnologies,
    updateStatus,
    updateNotes,
    setDeadline,          // НОВОЕ
    bulkUpdateStatus,     // НОВОЕ
    importTechnologies,   // НОВОЕ
    markAllCompleted,
    resetAll,
    randomNext,
    deleteTechnology,
    restoreTechnology,
    permanentlyDelete,
    resetToInitial,
    progress: calculateProgress()
  };
}

export default useTechnologies;
