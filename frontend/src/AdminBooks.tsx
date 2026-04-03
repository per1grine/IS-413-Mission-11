import { useEffect, useState } from 'react';
import type { book } from './types/Bookstore';
import { useNavigate } from 'react-router-dom';
import { fetchBooks, addBook, updateBook, deleteBook } from './api/BookstoreAPI';

const emptyForm: Omit<book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  ISBN: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

function AdminBooks() {
  const [books, setBooks] = useState<book[]>([]);
  const [form, setForm] = useState<Omit<book, 'bookID'>>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadBooks = () => {
    fetchBooks().then((data) => setBooks(data));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      updateBook(editingId, form).then(() => {
        loadBooks();
        setEditingId(null);
        setForm(emptyForm);
      });
    } else {
      addBook(form).then(() => {
        loadBooks();
        setForm(emptyForm);
      });
    }
  };

  const handleEdit = (b: book) => {
    setEditingId(b.bookID);
    setForm({
      title: b.title,
      author: b.author,
      publisher: b.publisher ?? '',
      ISBN: b.ISBN,
      classification: b.classification,
      category: b.category,
      pageCount: b.pageCount,
      price: b.price,
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    deleteBook(id).then(() => loadBooks());
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin — Manage Books</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Bookstore
        </button>
      </div>

      {/* Add / Edit Form */}
      <div className="card mb-4">
        <div className="card-header">
          {editingId !== null ? 'Edit Book' : 'Add New Book'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">Title *</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Author</label>
                <input
                  className="form-control"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Publisher</label>
                <input
                  className="form-control"
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">ISBN</label>
                <input
                  className="form-control"
                  name="ISBN"
                  value={form.ISBN}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Classification</label>
                <input
                  className="form-control"
                  name="classification"
                  value={form.classification}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Page Count</label>
                <input
                  type="number"
                  className="form-control"
                  name="pageCount"
                  value={form.pageCount}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Save Changes' : 'Add Book'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Books Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.ISBN}</td>
              <td>{b.category}</td>
              <td>${b.price?.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooks;
