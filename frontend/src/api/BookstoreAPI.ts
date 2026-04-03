import type { book } from '../types/Bookstore';

const API_URL = `${import.meta.env.VITE_API_URL}/api/Bookstore`;

export const fetchBooks = async (): Promise<book[]> => {
  try {
    const response = await fetch(`${API_URL}/AllBooks`);

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const addBook = async (newBook: Omit<book, 'bookID'>): Promise<book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookID: 0, ...newBook }),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Omit<book, 'bookID'>
): Promise<book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookID: bookId, ...updatedBook }),
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
