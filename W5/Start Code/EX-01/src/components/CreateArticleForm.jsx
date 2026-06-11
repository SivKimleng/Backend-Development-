import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ArticleForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    journalistId: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const journalistId = Number(form.journalistId);
    const categoryId = Number(form.categoryId);

    if (!journalistId || !categoryId) {
      setError(
        "Journalist ID and Category ID must be valid numbers greater than 0.",
      );
      return;
    }

    const articleData = {
      title: form.title.trim(),
      content: form.content.trim(),
      journalistId,
      categoryId,
    };

    try {
      await axios.post("http://localhost:5000/articles", articleData);
      setForm({
        title: "",
        content: "",
        journalistId: "",
        categoryId: "",
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          `Server error ${err.response.status}: ${err.response.data?.message || "Could not add article."}`,
        );
      } else if (err.request) {
        setError(
          "No response from server. Make sure the API is running on port 5000.",
        );
      } else {
        setError("Unexpected error. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Navigation Links */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          📄 View Articles
        </Link>
        <Link to="/add"> ➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add New Article</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <br />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <br />
        <input
          type="number"
          name="journalistId"
          value={form.journalistId}
          onChange={handleChange}
          placeholder="Journalist ID"
          required
        />
        <br />
        <input
          type="number"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          placeholder="Category ID"
          required
        />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}