import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Pages.css';

function Home() {
  const { technologies, deletedTechnologies, progress } = useTechnologies();

  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;

  return (
    <div className="page">
      <div className="hero-section">
        <h1>🌟 Добро пожаловать в Трекер технологий!</h1>
        <p className="hero-text">
          Отслеживайте свой прогресс в изучении современных технологий разработки
        </p>
      </div>

      {/* Панель прогресса */}
      <div className="home-progress">
        <ProgressBar 
          progress={progress}
          label="Общий прогресс"
          height={25}
        />
        
        <div className="home-stats">
          <div>📚 <strong>Всего:</strong> {total}</div>
          <div>🟢 <strong>Завершено:</strong> {completed}</div>
          <div>🟡 <strong>В процессе:</strong> {inProgress}</div>
          {deletedTechnologies.length > 0 && (
            <div>🗑️ <strong>В корзине:</strong> {deletedTechnologies.length}</div>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Отслеживание прогресса</h3>
          <p>Ведите учёт всех технологий, которые изучаете</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Заметки</h3>
          <p>Добавляйте заметки к каждой технологии</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Статусы</h3>
          <p>Отмечайте статус изучения каждой темы</p>
        </div>
      </div>

      <div className="cta-section">
        <Link to="/technologies" className="cta-button">
          Перейти к списку технологий →
        </Link>
      </div>
    </div>
  );
}

export default Home;
