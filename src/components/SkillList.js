import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteSkill, getSkills } from '../services/api';

function SkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSkills();
      setSkills(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to fetch skills. Please check your backend and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this skill?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to delete this skill. Please try again.'
      );
    }
  };

  if (loading) {
    return <p className="status-message">Loading skills...</p>;
  }

  return (
    <section>
      <h2>All Skills</h2>

      {error && <p className="error-message">{error}</p>}

      {skills.length === 0 ? (
        <p className="status-message">No skills found. Add your first skill.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.name}</td>
                  <td>{skill.level}</td>
                  <td>{skill.description}</td>
                  <td className="actions-cell">
                    <Link className="button-link" to={`/edit/${skill.id}`}>
                      Edit
                    </Link>
                      <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(skill.id)}
                    >
                      Delete
                    </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SkillList;