import type { book } from "./Bookstore";

export interface CartItem {
    book: book;
    quantity: number;
}