import React, { useState, useEffect } from 'react';
import './RightSidebar.css';

export default function RightSidebar({ 
  userProfile = {
    name: 'Catherine Alicia N',
    school: 'Sekolah Teknik Elektro dan Informatika',
    nim: '19623247'
  }
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newTodo, setNewTodo] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const [todos, setTodos] = useState([
    { id: 1, text: 'Tugas Writing Essay #2', deadline: 'Batas Tenggat: 8 April 2025', checked: false },
    { id: 2, text: 'Tugas Writing Essay #2', deadline: 'Batas Tenggat: 8 April 2025', checked: false },
    { id: 3, text: 'Tugas Writing Essay #2', deadline: 'Batas Tenggat: 8 April 2025', checked: false },
  ]);

  const [notifications] = useState([
    { id: 1, text: "Don't Let Your Streak End!", subtext: "Start Practicing Now!" },
    { id: 2, text: "Don't Let Your Streak End!", subtext: "Start Practicing Now!" },
    { id: 3, text: "Don't Let Your Streak End!", subtext: "Start Practicing Now!" },
    { id: 4, text: "Don't Let Your Streak End!", subtext: "Start Practicing Now!" },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Todo Functions
  function toggleTodo(id) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    ));
  }

  function addTodo() {
    if (newTodo.trim() === '') return;
    
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      deadline: newDeadline || 'Tidak ada batas tenggat',
      checked: false
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    setNewDeadline('');
  }

  function deleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  // Drag and Drop Functions
  function handleDragStart(e, index) {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === index) return;
    
    const newTodos = [...todos];
    const draggedTodo = newTodos[draggedItem];
    
    newTodos.splice(draggedItem, 1);
    newTodos.splice(index, 0, draggedTodo);
    
    setDraggedItem(index);
    setTodos(newTodos);
  }

  function handleDragEnd() {
    setDraggedItem(null);
  }

  // Calendar functions
  function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return { firstDay, daysInMonth };
  }

  function changeMonth(offset) {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCalendarDate(newDate);
  }

  function isToday(day) {
    const today = new Date();
    return day === today.getDate() && 
           calendarDate.getMonth() === today.getMonth() && 
           calendarDate.getFullYear() === today.getFullYear();
  }

  const { firstDay, daysInMonth } = getDaysInMonth(calendarDate);
  const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  const dayNames = ['SUN', 'MON', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <aside className="right-sidebar">
      {/* User Profile Info */}
      <div className="user-profile-card">
        <img 
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=0063a3&color=fff&size=80`}
          alt="User" 
          className="profile-avatar" 
        />
        <div className="profile-details">
          <h3>{userProfile.name}</h3>
          <p>{userProfile.school}</p>
          <span className="profile-nim">{userProfile.nim}</span>
        </div>
      </div>

      {/* Date & Time Pills */}
      <div className="datetime-pills">
        <div className="date-pill">{formattedDate}</div>
        <div className="time-pill">{formattedTime}</div>
      </div>

      {/* Calendar Widget */}
      <div className="calendar-widget">
        <h3>Calendar</h3>
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span>{monthName}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>
        <div className="calendar-grid">
          {dayNames.map((day, i) => (
            <div key={i} className="calendar-day-name">{day}</div>
          ))}
          
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            return (
              <div 
                key={day} 
                className={`calendar-day ${isToday(day) ? 'active' : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-widget">
        <h3>Notification</h3>
        <div className="notification-list">
          {notifications.map(notif => (
            <div key={notif.id} className="notification-item">
              <div className="notif-icon">🔔</div>
              <div className="notif-content">
                <p className="notif-text">{notif.text}</p>
                <p className="notif-subtext">{notif.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* To Do List */}
      <div className="todo-widget">
        <div className="todo-header">
          <h3>To Do List</h3>
        </div>

        {/* Add Todo Form */}
        <div className="todo-add-form">
          <input 
            type="text"
            placeholder="Task name..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="todo-input"
          />
          <input 
            type="text"
            placeholder="Deadline (optional)..."
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="todo-input-deadline"
          />
          <button onClick={addTodo} className="todo-add-btn">+ Add</button>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`todo-item ${todo.checked ? 'checked' : ''} ${draggedItem === index ? 'dragging' : ''}`}
            >
              <div className="todo-drag-handle">⋮⋮</div>
              <input 
                type="checkbox" 
                checked={todo.checked}
                onChange={() => toggleTodo(todo.id)}
              />
              <div className="todo-content">
                <p className="todo-text">{todo.text}</p>
                <p className="todo-deadline">{todo.deadline}</p>
              </div>
              <button 
                className="todo-delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}