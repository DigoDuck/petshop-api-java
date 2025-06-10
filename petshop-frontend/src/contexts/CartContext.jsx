import { createContext, useState, useContext, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Erro ao carregar o carrinho do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (produto) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.produto.id === produto.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            } else {
                return [...prevItems, { produto, quantidade: 1 }]; 
            }
        });
    };

    const removeFromCart = (produtoId) => {
        setCartItems(prevItems => prevItems.filter(item => item.produto.id !== produtoId));
    };
    
    const updateQuantity = (produtoId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(produtoId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.produto.id === produtoId
                    ? { ...item, quantidade: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };
    
    const itemCount = useMemo(() => {
        // Soma as quantidades de todos os itens
        return cartItems.reduce((sum, item) => sum + item.quantidade, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + (item.produto.preco * item.quantidade);
        }, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};