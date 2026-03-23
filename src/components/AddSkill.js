import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSkill } from '../services/api';

const initialFormState = {
  name: '',
  level: '',
  description: '',
};

function AddSkill() {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
      await createSkill(formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to add skill. Please verify input and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Add Skill</h2>

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
          placeholder="Beginner, Intermediate, Advanced"
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
          {submitting ? 'Saving...' : 'Save Skill'}
        </button>
      </form>
    </section>
  );
}

export default AddSkill;