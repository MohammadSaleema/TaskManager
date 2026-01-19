import React, { useState, useEffect } from 'react';
import './App.css';

// --- ICONS ---
const IconDashboard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconProjects = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const IconTasks = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'calendar'
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("taskminder_tasks");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Design Homepage', description: 'Create hi-fi mockups.', status: 'todo' },
      { id: 2, title: 'API Integration', description: 'Connect frontend to backend.', status: 'inprogress' },
      { id: 3, title: 'Unit Testing', description: 'Write Jest tests.', status: 'done' },
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' });

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("taskminder_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // --- HANDLERS ---
  const handleAddNew = () => {
    setFormData({ title: '', description: '', status: 'todo' });
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description, status: task.status });
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) setTasks(tasks.filter(t => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (currentTask) {
      setTasks(tasks.map(t => t.id === currentTask.id ? { ...t, ...formData } : t));
    } else {
      const newTask = { id: Date.now(), ...formData };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const getTasks = (status) => {
    return tasks.filter(t => t.status === status && t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-shape">◇</div>
          <h2>TaskMinder.</h2>
        </div>
        <nav>
          <button className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}><IconDashboard /> Dashboard</button>
          <button className={`nav-link ${currentView === 'projects' ? 'active' : ''}`} onClick={() => setCurrentView('projects')}><IconProjects /> Projects</button>
          <button className={`nav-link ${currentView === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentView('tasks')}><IconTasks /> Tasks</button>
          <button className={`nav-link ${currentView === 'calendar' ? 'active' : ''}`} onClick={() => setCurrentView('calendar')}><IconCalendar /> Calendar</button>
        </nav>
        <div className="logout-container">
          <button className="btn-logout">← Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            <IconSearch />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="user-profile"><span className="bell">🔔</span><div className="avatar">👨‍💻</div></div>
        </header>

        {/* CONDITIONALLY RENDER VIEW */}
        {currentView === 'tasks' && (
          <>
            <div className="page-header">
              <h1>Tasks</h1>
              <button className="btn-primary" onClick={handleAddNew}>+ New task</button>
            </div>
            <div className="kanban-board">
              <div className="column todo">
                <div className="col-header"><span className="dot todo-dot"></span> To do <span className="count">{getTasks('todo').length}</span></div>
                <div className="task-list">
                  {getTasks('todo').map(t => <TaskCard key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} />)}
                </div>
              </div>
              <div className="column inprogress">
                <div className="col-header"><span className="dot progress-dot"></span> In progress <span className="count">{getTasks('inprogress').length}</span></div>
                <div className="task-list">
                  {getTasks('inprogress').map(t => <TaskCard key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} />)}
                </div>
              </div>
              <div className="column done">
                <div className="col-header"><span className="dot done-dot"></span> Done <span className="count">{getTasks('done').length}</span></div>
                <div className="task-list">
                  {getTasks('done').map(t => <TaskCard key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} />)}
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'dashboard' && <div className="placeholder-view"><h2>Dashboard</h2><p>Coming Soon...</p></div>}
        {currentView === 'projects' && <div className="placeholder-view"><h2>Projects</h2><p>Coming Soon...</p></div>}

      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"><h3>{currentTask ? 'Edit Task' : 'New Task'}</h3><button onClick={() => setIsModalOpen(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <label>Title</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus />
              <label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              <label>Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option></select>
              <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

const TaskCard = ({ task, onEdit, onDelete }) => (
  <div className="card">
    <div className="card-top">
      <div className="card-user">👤</div>
      <div className="card-actions">
        <button onClick={() => onEdit(task)}><IconEdit /></button>
        <button onClick={() => onDelete(task.id)}><IconTrash /></button>
      </div>
    </div>
    <p className="card-desc">{task.description}</p>
    <h4 className="card-title">{task.title}</h4>
  </div>
);

// SIMPLE CALENDAR COMPONENT
const CalendarView = () => {
  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(year, date.getMonth(), 1).getDay(); // 0 = Sunday
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);
  const currentDay = date.getDate();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{monthName} {year}</h2>
        <div className="calendar-actions">
          <button className="btn-secondary">Today</button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="day-name">Sun</div><div className="day-name">Mon</div><div className="day-name">Tue</div><div className="day-name">Wed</div><div className="day-name">Thu</div><div className="day-name">Fri</div><div className="day-name">Sat</div>
        
        {/* Empty slots for days before the 1st of the month */}
        {emptySlots.map(i => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
        
        {/* Actual Days */}
        {days.map(d => (
          <div key={d} className={`calendar-day ${d === currentDay ? 'today' : ''}`}>
            <span className="day-number">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;