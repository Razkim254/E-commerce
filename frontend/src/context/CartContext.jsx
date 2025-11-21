import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.name === product.name);
            if (exists) {
                return prev.map((item) =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const removeFromCart = (name) => {
        setCart((prev) => prev.filter((item) => item.name !== name));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// ✅ export hook properly
export const useCart = () => useContext(CartContext);
