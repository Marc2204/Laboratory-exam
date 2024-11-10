import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { Modal, Button, Form } from 'react-bootstrap';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    published_year: '',
    genre: '',
    description: '',
  });
  const [editingBook, setEditingBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error("There was an error fetching the books!", error);
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post('http://localhost:8000/api/books', newBook);
      fetchBooks();
      setNewBook({
        title: '',
        author: '',
        published_year: '',
        genre: '',
        description: '',
      });
    } catch (error) {
      console.error("There was an error adding the book!", error);
    }
  };

  const handleEditBook = async () => {
    if (editingBook) {
      try {
        await axios.put(`http://localhost:8000/api/books/${editingBook.id}`, editingBook);
        fetchBooks();
        setShowModal(false);
        setEditingBook(null);
      } catch (error) {
        console.error("There was an error updating the book!", error);
      }
    }
  };

  const handleDeleteBook = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this book?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("There was an error deleting the book!", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h2>BOOK MANAGEMENT SYSTEM</h2>
          <nav>
            <ul className="nav justify-content-center">
              <li className="nav-item">
                <Link className="nav-link btn btn-lg btn-outline-primary animate__animated animate__fadeIn" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-lg btn-outline-success animate__animated animate__fadeIn" to="/add">
                  Add New Book
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <div className="animate__animated animate__fadeIn">
              <h3>Book List</h3>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published Year</th>
                    <th>Genre</th>
                    <th>Description</th>
                    <th>Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.published_year}</td>
                      <td>{book.genre}</td>
                      <td>{book.description}</td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => startEdit(book)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          } />

          <Route path="/add" element={
            <div className="animate__animated animate__fadeIn d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
              <div className="w-50">
                <h3>Add New Book</h3>

                {newBook.title === '' || newBook.author === '' || newBook.published_year === '' || newBook.genre === '' || newBook.description === '' ? (
                  <div className="alert alert-danger text-center" role="alert">
                    Please fill in all fields.
                  </div>
                ) : null}

                <input
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Title"
                  required
                />
                <input
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Author"
                  required
                />
                <input
                  type="number"
                  name="published_year"
                  value={newBook.published_year}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Published Year"
                  min="1000"
                  max="9999"
                  required
                />
                <input
                  type="text"
                  name="genre"
                  value={newBook.genre}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Genre"
                  required
                />
                <textarea
                  name="description"
                  value={newBook.description}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Description"
                  required
                ></textarea>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    if (newBook.title === '' || newBook.author === '' || newBook.published_year === '' || newBook.genre === '' || newBook.description === '') {
                      alert('Please fill in all fields.');
                    } else {
                      handleAddBook();
                    }
                  }}
                >
                  Add Book
                </button>
              </div>
            </div>
          } />
        </Routes>

        {/* Modal for editing a book */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editingBook ? editingBook.title : ''}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                />
              </Form.Group>

              <Form.Group controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={editingBook ? editingBook.author : ''}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                />
              </Form.Group>

              <Form.Group controlId="formPublishedYear">
                <Form.Label>Published Year</Form.Label>
                <Form.Control
                  type="number"
                  name="published_year"
                  value={editingBook ? editingBook.published_year : ''}
                  onChange={handleInputChange}
                  min="1000"
                  max="9999"
                  placeholder="Enter published year"
                />
              </Form.Group>

              <Form.Group controlId="formGenre">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={editingBook ? editingBook.genre : ''}
                  onChange={handleInputChange}
                  placeholder="Enter genre"
                />
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={editingBook ? editingBook.description : ''}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditBook}>
              Update Book
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Router>
  );
}

export default App;
