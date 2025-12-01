// src/components/TechnologyForm.jsx
import { useState, useEffect } from 'react';
import './TechnologyForm.css';

function TechnologyForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: 'Не начато',
    description: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполнение формы при редактировании
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Валидация полей
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Название обязательно';
        } else if (value.trim().length < 2) {
          error = 'Название должно содержать минимум 2 символа';
        } else if (value.trim().length > 50) {
          error = 'Название не должно превышать 50 символов';
        }
        break;

      case 'category':
        if (!value.trim()) {
          error = 'Категория обязательна';
        }
        break;

      case 'description':
        if (value.trim().length > 200) {
          error = 'Описание не должно превышать 200 символов';
        }
        break;

      case 'notes':
        if (value.trim().length > 500) {
          error = 'Заметки не должны превышать 500 символов';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Изменение поля
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Валидация в реальном времени только для тронутых полей
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Потеря фокуса
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация всех полей
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Отметить все поля как тронутые
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Если есть ошибки - не отправляем
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      
      // Фокус на первое поле с ошибкой
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    // Отправка данных
    try {
      await onSubmit(formData);
      
      // Очистка формы после успешной отправки
      setFormData({
        name: '',
        category: '',
        status: 'Не начато',
        description: '',
        notes: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <form 
      className="technology-form" 
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Название */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Название технологии <span className="required" aria-label="обязательное поле">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${isFieldInvalid('name') ? 'invalid' : ''}`}
          aria-required="true"
          aria-invalid={isFieldInvalid('name')}
          aria-describedby={isFieldInvalid('name') ? 'name-error' : undefined}
          placeholder="Например: React, Python, Docker"
        />
        {isFieldInvalid('name') && (
          <p id="name-error" className="error-message" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Категория */}
      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Категория <span className="required" aria-label="обязательное поле">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-select ${isFieldInvalid('category') ? 'invalid' : ''}`}
          aria-required="true"
          aria-invalid={isFieldInvalid('category')}
          aria-describedby={isFieldInvalid('category') ? 'category-error' : undefined}
        >
          <option value="">Выберите категорию</option>
          <option value="Языки программирования">Языки программирования</option>
          <option value="Фреймворки">Фреймворки</option>
          <option value="Библиотеки">Библиотеки</option>
          <option value="Инструменты">Инструменты</option>
          <option value="Базы данных">Базы данных</option>
          <option value="DevOps">DevOps</option>
          <option value="Другое">Другое</option>
        </select>
        {isFieldInvalid('category') && (
          <p id="category-error" className="error-message" role="alert">
            {errors.category}
          </p>
        )}
      </div>

      {/* Статус */}
      <div className="form-group">
        <label htmlFor="status" className="form-label">
          Статус изучения
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Не начато">Не начато</option>
          <option value="В процессе">В процессе</option>
          <option value="Изучено">Изучено</option>
        </select>
      </div>

      {/* Описание */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Краткое описание
          <span className="char-count">
            {formData.description.length}/200
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-textarea ${isFieldInvalid('description') ? 'invalid' : ''}`}
          rows="3"
          aria-invalid={isFieldInvalid('description')}
          aria-describedby={isFieldInvalid('description') ? 'description-error' : undefined}
          placeholder="Краткое описание технологии и её применения"
        />
        {isFieldInvalid('description') && (
          <p id="description-error" className="error-message" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {/* Заметки */}
      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Заметки
          <span className="char-count">
            {formData.notes.length}/500
          </span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-textarea ${isFieldInvalid('notes') ? 'invalid' : ''}`}
          rows="5"
          aria-invalid={isFieldInvalid('notes')}
          aria-describedby={isFieldInvalid('notes') ? 'notes-error' : undefined}
          placeholder="Дополнительные заметки, ресурсы для изучения"
        />
        {isFieldInvalid('notes') && (
          <p id="notes-error" className="error-message" role="alert">
            {errors.notes}
          </p>
        )}
      </div>

      {/* Кнопки */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : initialData ? 'Обновить' : 'Добавить технологию'}
        </button>
      </div>
    </form>
  );
}

export default TechnologyForm;
