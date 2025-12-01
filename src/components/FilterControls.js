import './FilterControls.css';

function FilterControls({ activeFilter, setActiveFilter }) {
  return (
    <div className="filter-controls">
      <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>Все</button>
      <button className={activeFilter === 'not-started' ? 'active' : ''} onClick={() => setActiveFilter('not-started')}>Не начатые</button>
      <button className={activeFilter === 'in-progress' ? 'active' : ''} onClick={() => setActiveFilter('in-progress')}>В процессе</button>
      <button className={activeFilter === 'completed' ? 'active' : ''} onClick={() => setActiveFilter('completed')}>Выполненные</button>
    </div>
  );
}

export default FilterControls;