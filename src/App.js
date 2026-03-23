import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import SkillList from './components/SkillList';
import AddSkill from './components/AddSkill';
import EditSkill from './components/EditSkill';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Skill Tracker</h1>
          <nav>
            <Link to="/">All Skills</Link>
            <Link to="/add">Add Skill</Link>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<SkillList />} />
            <Route path="/add" element={<AddSkill />} />
            <Route path="/edit/:id" element={<EditSkill />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
