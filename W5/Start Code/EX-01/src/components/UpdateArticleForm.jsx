import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export default function UpdateArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });
  const [error, setError] = useState('');


  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(res => {
        setForm({
          title: res.data.title || '',
          content: res.data.content || '',
          journalistId: res.data.journalistId || '',
          categoryId: res.data.categoryId || '',
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const journalistId = Number(form.journalistId);
    const categoryId = Number(form.categoryId);

    if (!journalistId || !categoryId) {
      setError('Journalist ID and Category ID must be valid numbers greater than 0.');
      return;
    }
    const updatedData = {
      title: form.title,
      content: form.content,
      journalistId,
      categoryId,
    };

    try {
      await api.put(`/articles/${id}`, updatedData);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(`Server error ${err.response.status}: ${err.response.data?.message || 'Could not update article.'}`);
      } else if (err.request) {
        setError('No response from server. Make sure the API is running on port 5000.');
      } else {
        setError('Unexpected error. Please try again.');
      }
    }
  };

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>View Articles</Link>
        <Link to="/add">Add Article</Link>
      </nav>

      <form onSubmit={handleSubmit}>
        <h3>Update Article</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
        <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
        <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
