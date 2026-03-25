import { useEffect, useState } from "react";
import type { book } from "./types/Bookstore";
import type { CartItem } from "./types/CartItems";
import { useLocation, useNavigate } from "react-router-dom";

interface BookstoreListProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (book: book) => void;
}

function BookstoreList({ cartItems, setCartItems, addToCart }: BookstoreListProps) {
    const [books, setBooks] = useState<book[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const filteredBooks = selectedCategories.length === 0 
        ? books 
        : books.filter(book => selectedCategories.includes(book.category ?? ""));

    const [isSorted, setIsSorted] = useState(false);
    const sortedBooks = isSorted 
        ? [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title)) 
        : filteredBooks;
    
    const [currentPage, setCurrentPage] = useState(0);
    const [booksPerPage, setBooksPerPage] = useState(5);

    const start = currentPage * booksPerPage;
    const end = start + booksPerPage;
    const currentBooks = sortedBooks.slice(start, end);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.page !== undefined) {
            setCurrentPage(location.state.page);
        }
        }, [location.state]);

    const categories = [...new Set(books.map(book => book.category ?? ""))];

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("https://localhost:5000/api/Bookstore/AllBooks");
            const data = await response.json();
            setBooks(data);
        }
        fetchBooks();
    }, []);

    return (
        <div className="container">
            <div className="row">
                
                {/* LEFT COLUMN: FILTERS */}
                <div className="col-md-3">
                    <br />

                    {/* CART SUMMARY -> Additional Bootstrap component with badges!*/}
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/cart', { state: { fromPage: currentPage } })}>
                        View Cart <span className="badge bg-secondary">
                            {cartItems.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    </button>
                    <p>Subtotal: ${cartItems.reduce((total, item) => total + ((item.book.price ?? 0) * item.quantity), 0).toFixed(2)}</p>
                    <br />

                    <h4>Filters:</h4>

                    <select 
                        className="form-select mb-2"
                        onChange={(e) => {
                            setBooksPerPage(parseInt(e.target.value));
                            setCurrentPage(0);
                        }} 
                        value={booksPerPage}
                    >
                        <option value={5}>5 books per page</option>
                        <option value={10}>10 books per page</option>
                        <option value={20}>20 books per page</option>
                    </select>

                    <button 
                        className="btn btn-secondary mb-3 w-100" 
                        onClick={() => setIsSorted(!isSorted)}
                    >
                        {isSorted ? "Unsort" : "Sort by Title"}
                    </button>

                    <h5>Categories</h5>

                    <button
                    className="btn btn-secondary w-100 mb-1"
                    data-bs-toggle="collapse"
                    data-bs-target="#categoryCollapse">
                    Filter by Category ▼
                    </button>

                    <div className="collapse" id="categoryCollapse">
                                            <button 
                        className={`btn w-100 mb-1 ${selectedCategories.length === 0 ? "btn-primary" : "btn-outline-primary"}`} 
                        onClick={() => setSelectedCategories([])}
                    >
                        All Categories
                    </button>

                    {categories.map(category => (
                        <button 
                            className={`btn w-100 mb-1 ${selectedCategories.includes(category) ? "btn-primary" : "btn-outline-primary"}`} 
                            key={category}
                            onClick={() => {
                                setSelectedCategories(
                                    selectedCategories.includes(category)
                                        ? selectedCategories.filter(c => c !== category)
                                        : [...selectedCategories, category]
                                );
                                setCurrentPage(0);
                            }}
                        >
                            {category}
                        </button>
                    ))}
                    </div>


                </div>

                {/* RIGHT COLUMN: BOOKS */}
                <div className="col-md-9">
                    <br />
                    <h1>Bookstore List</h1>
                    <h5>
                        Page {currentPage + 1} / {Math.ceil(filteredBooks.length / booksPerPage)}
                    </h5>
                    <br />

                    <div className="row">
                        {currentBooks.map((book) => (
                            <div className="col-md-4 mb-3" key={book.bookID}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p>Author: {book.author}</p>
                                        <p>ISBN: {book.ISBN}</p>
                                        <p>Category: {book.category}</p>
                                        <p>Price: ${book.price}</p>

                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => addToCart(book)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="d-flex justify-content-between">
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage <= 0}
                        >
                            Previous
                        </button>

                        <button 
                            className="btn btn-secondary"
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={currentPage >= (Math.ceil(books.length / booksPerPage)) - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BookstoreList;