import { createContext,useContext, useReducer } from 'react';


const CartContext = createContext();



function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_CART':
            return [...state, action.payload];
        case 'REMOVE_FROM_CART':
            return state.filter(item => item._id !== action.payload);
        case 'CLEAR_CART':
        return [];
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, []);

    function addToCart(product) {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    }

    function removeFromCart(productId) {
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
    function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
}

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {
    return useContext(CartContext)
}
