import { useState } from 'react'
import './App.css'
import BookstoreList from './BookstoreList'
import type { CartItem } from './types/CartItems'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CartPage from './CartPage'
import AdminBooks from './AdminBooks'
import type { book } from './types/Bookstore'


function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (book: book) => {
    const existing = cartItems.find(item => item.book.bookID === book.bookID);
    if (existing) {
        // book is already in cart → increment quantity
        setCartItems(cartItems.map(item => 
            item.book.bookID === book.bookID 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ))
    } else {
        // book is not in cart → add it
        setCartItems([...cartItems, { book: book, quantity: 1 }])
    }
}

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookstoreList cartItems={cartItems} setCartItems={setCartItems} addToCart={addToCart}/>} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems}/>} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
