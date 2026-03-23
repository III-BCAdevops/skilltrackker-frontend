import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSkillById, updateSkill } from '../services/api';

const initialFormState = {
  name: '',
  level: '',
  description: '',
};

function EditSkill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSkill = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getSkillById(id);
        setFormData({
          name: response.data?.name || '',
          level: response.data?.level || '',
          description: response.data?.description || '',
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to load skill details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkill();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await updateSkill(id, formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to update skill. Please verify input and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading skill details...</p>;
  }

  return (
    <section>
      <h2>Edit Skill</h2>

      {error && <p className="error-message">{error}</p>}

      <form className="skill-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="level">Level</label>
        <input
          id="level"
          name="level"
          type="text"
          value={formData.level}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Skill'}
        </button>
      </form>
    </section>
  );
}

export default EditSkill;