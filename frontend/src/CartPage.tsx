import type { CartItem } from "./types/CartItems";
import { useNavigate, useLocation } from 'react-router-dom';

interface CartPageProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

function CartPage({ cartItems, setCartItems }: CartPageProps) {

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.fromPage ?? 0;

    return (
        <>
            <h1>Your Cart</h1>
            <div className="row">   
                {cartItems.map((item) => (
                    <div className="col-md-4" key={item.book.bookID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{item.book.title}</h5>
                                <p className="card-text">Quantity: {item.quantity}</p>
                                <p className="card-text">Price: ${item.book.price ?? 0}</p>
                                <p className="card-text">Subtotal: ${(item.book.price ?? 0 * item.quantity).toFixed(2)}</p>
                                <button className="btn btn-danger" onClick={() => {
                                    setCartItems(cartItems.filter(cartItem => cartItem.book.bookID !== item.book.bookID));
                                }}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h3>Cart Total: ${cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0).toFixed(2)}</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/', { state: { page: fromPage } })}>Continue Shopping</button>
                </div>
            </div>
        </>
    )
}

export default CartPage;