import React, { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { CartReducer, sumItems, CartItemsDTO } from '../reducers/CartReducer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface CartContextDTO {
  decrement(product: Product): void;
  increment(product: Product): void;
  addItem(product: Product): void;
  removeItem(product: Product): void;
  clear(): void;
  checkout(): void;
}

interface InitialState {
  checkout: boolean;
  storage: CartItemsDTO[];
}

const CartContext = createContext<CartContextDTO | null>(null);
const initialState = async (): Promise<InitialState> => {
  try {
    const jsonValue = await AsyncStorage.getItem('cart');
    const storage: CartItemsDTO[] = jsonValue ? JSON.parse(jsonValue) : [];

    return { cartItems: storage, ...sumItems(storage), checkout: false };
  } catch (e) {
    throw new Error('Algo deu errado, tente novamente');
  }
};

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState(initialState);

  const [state, dispatch] = useReducer(CartReducer, initialState);

  const increment = (product: CartItemsDTO): void => {
    dispatch({ type: 'increment', product });
  };

  const decrement = (product: CartItemsDTO): void => {
    dispatch({ type: 'decrement', product });
  };

  const addItem = (product: CartItemsDTO): void => {
    dispatch({ type: 'addItem', product });
  };

  const removeItem = (product: CartItemsDTO): void => {
    dispatch({ type: 'removeItem', product });
  };

  const clear = (): void => {
    dispatch({ type: 'clear' });
  };

  const checkout = (): void => {
    dispatch({ type: 'checkout' });
  };

  const contextValues = useMemo(
    () => ({
      decrement,
      increment,
      addItem,
      removeItem,
      clear,
      checkout,
    }),
    [],
  );

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;