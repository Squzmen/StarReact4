import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    const newTech = {
      id: Date.now(),
      ...formData,
      notes: ''
    };
    
    technologies.push(newTech);
    localStorage.setItem('technologies', JSON.stringify(technologies));
    
    navigate('/technologies');
  };

  return (
    <div className="page">
      <h1>➕ Добавить новую технологию</h1>
      
      <form onSubmit={handleSubmit} className="tech-form">
        <div className="form-group">
          <label>Название технологии:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Например: React Hooks"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Описание:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Краткое описание технологии..."
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Начальный статус:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="not-started">⚪ Не начато</option>
            <option value="in-progress">🟡 В процессе</option>
            <option value="completed">🟢 Завершено</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            ✅ Добавить технологию
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/technologies')}
            className="btn-secondary"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;
