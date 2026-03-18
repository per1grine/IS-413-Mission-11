import { useEffect, useState } from "react";
import type { book } from "./types/Bookstore";



function BookstoreList() {

    const [books, setBooks] = useState<book[]>([]);

    const [isSorted, setIsSorted] = useState(false);
    const sortedBooks = isSorted ? [...books].sort((a, b) => a.title.localeCompare(b.title)) : books;
    
    const [currentPage, setCurrentPage] = useState(0);
    const [booksPerPage, setBooksPerPage] = useState(5);

    const start = currentPage * booksPerPage;
    const end = start + booksPerPage;
    const currentBooks = sortedBooks.slice(start, end);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("https://localhost:5000/api/Bookstore/AllBooks");
            const data = await response.json();
            setBooks(data);
        }
        fetchBooks();
    }, []);

    return (
        <>
            <div>
                <h1>Bookstore List</h1>
                <h3>Current Page: {currentPage + 1} / {Math.ceil(books.length / booksPerPage)}</h3>
            </div>
            <br />
            <select className="form-select" onChange={(e) => {
                setBooksPerPage(parseInt(e.target.value));
                setCurrentPage(0);
            }} value={booksPerPage} >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
            </select>

            <button className="btn btn-secondary" onClick={() => setIsSorted(!isSorted)}>
                {isSorted ? "Unsort" : "Sort by Title"}
            </button>
            <br />

            <div className="row">
                {currentBooks.map((book) => (
                    <div className="col-md-4" key={book.bookID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text">Author: {book.author}</p>
                                <p className="card-text">ISBN: {book.ISBN}</p>
                                <p className="card-text">Classification: {book.classification}</p>
                                <p className="card-text">Category: {book.category}</p>
                                <p className="card-text">Page Count: {book.pageCount}</p>
                                <p className="card-text">Price: ${book.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= (Math.ceil(books.length / booksPerPage)) - 1}>Next</button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 0}>Previous</button>
        </>
    );
}

export default BookstoreList;