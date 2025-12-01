import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomNext }) {
  return (
    <div className="quick-actions">
      <button onClick={onMarkAllCompleted}>
        ✅ Отметить все
      </button>
      <button onClick={onResetAll}>
        🔄 Сбросить все
      </button>
      <button onClick={onRandomNext}>
        🎲 Случайный выбор
      </button>
    </div>
  );
}

export default QuickActions;
