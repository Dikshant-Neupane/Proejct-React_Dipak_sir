import { useState, useEffect, useMemo } from 'react';
import StudentCard from './components/StudentCard';
import Button from './components/Button';
import Input from './components/Input';
import './App.css';

const INITIAL_STUDENTS = [
  { id: 1, name: 'Dikshant Neupane', course: 'Computer Science', grade: 94, isPresent: true },
  { id: 2, name: 'Bibek', course: 'Mathematics', grade: 82, isPresent: true },
  { id: 3, name: 'Rajan', course: 'Physics', grade: 91, isPresent: false },
  { id: 4, name: 'Swastik', course: 'Chemistry', grade: 76, isPresent: true },
  { id: 5, name: 'Nimesh', course: 'Mathematics', grade: 88, isPresent: false },
  { id: 6, name: 'Ojan', course: 'Computer Science', grade: 95, isPresent: true },
];

const COURSES = ['Mathematics', 'DSA', 'React', 'Numerical Method'];

function loadStudents() {
  try {
    const stored = localStorage.getItem('students');
    return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export default function App() {
  const [students, setStudents] = useState(loadStudents);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [form, setForm] = useState({ name: '', course: COURSES[0], grade: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const filtered = useMemo(() => {
    let result = students;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q));
    }

    if (filterCourse !== 'all') {
      result = result.filter(s => s.course === filterCourse);
    }

    if (filterStatus === 'present') {
      result = result.filter(s => s.isPresent);
    } else if (filterStatus === 'absent') {
      result = result.filter(s => !s.isPresent);
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'grade-desc') {
      result = [...result].sort((a, b) => b.grade - a.grade);
    } else if (sortBy === 'grade-asc') {
      result = [...result].sort((a, b) => a.grade - b.grade);
    }

    return result;
  }, [students, search, filterCourse, filterStatus, sortBy]);

  function handleDelete(id) {
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  function handleTogglePresence(id) {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s)
    );
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  }

  function handleAddStudent(e) {
    e.preventDefault();
    const grade = Number(form.grade);
    if (!form.name.trim()) return setFormError('Name is required.');
    if (!form.grade || isNaN(grade) || grade < 0 || grade > 100) {
      return setFormError('Grade must be a number between 0 and 100.');
    }

    setStudents(prev => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        course: form.course,
        grade,
        isPresent: true,
      },
    ]);
    setForm({ name: '', course: COURSES[0], grade: '' });
    setShowForm(false);
  }

  // show only the predefined `COURSES` in the course filter dropdown
  const allCoursesInUse = [...COURSES].sort();

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <div>
            <h1 className="app__title">Student Directory</h1>
            <p className="app__subtitle">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
          </div>
          <Button
            onClick={() => { setShowForm(v => !v); setFormError(''); }}
            variant={showForm ? 'outline' : 'primary'}
          >
            {showForm ? 'Cancel' : '+ Add Student'}
          </Button>
        </div>
      </header>

      <main className="app__main">
        {showForm && (
          <section className="add-form-section">
            <h2 className="section-title">New Student</h2>
            <form onSubmit={handleAddStudent} className="add-form">
              <Input
                label="Name"
                id="name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Full name"
              />
              <div className="input-group">
                <label htmlFor="course" className="input-label">Course</label>
                <select
                  id="course"
                  name="course"
                  className="input-field"
                  value={form.course}
                  onChange={handleFormChange}
                >
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input
                label="Grade"
                id="grade"
                name="grade"
                type="number"
                min="0"
                max="100"
                value={form.grade}
                onChange={handleFormChange}
                placeholder="0–100"
              />
              <div className="add-form__submit">
                {formError && <p className="form-error">{formError}</p>}
                <Button type="submit" variant="primary">Add Student</Button>
              </div>
            </form>
          </section>
        )}

        <section className="controls">
          <div className="controls__search">
            <Input
              label="Search students"
              id="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name…"
            />
          </div>
          <div className="controls__filters">
            <div className="input-group">
              <label htmlFor="filter-course" className="input-label">Course</label>
              <select
                id="filter-course"
                className="input-field"
                value={filterCourse}
                onChange={e => setFilterCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {allCoursesInUse.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="filter-status" className="input-label">Status</label>
              <select
                id="filter-status"
                className="input-field"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="sort" className="input-label">Sort by</label>
              <select
                id="sort"
                className="input-field"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="none">Default</option>
                <option value="name">Name (A–Z)</option>
                <option value="grade-desc">Grade (High–Low)</option>
                <option value="grade-asc">Grade (Low–High)</option>
              </select>
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {students.length === 0 ? (
              <>
                <p className="empty-state__title">No students yet</p>
                <p className="empty-state__sub">Add a student to get started.</p>
              </>
            ) : (
              <>
                <p className="empty-state__title">No results found</p>
                <p className="empty-state__sub">Try adjusting your search or filters.</p>
              </>
            )}
          </div>
        ) : (
          <div className="student-grid">
            {filtered.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={handleDelete}
                onTogglePresence={handleTogglePresence}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
