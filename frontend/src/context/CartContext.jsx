import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId &&
        item.shopId === action.payload.shopId
      )
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId &&
            item.shopId === action.payload.shopId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId &&
          item.shopId === action.payload.shopId)
        )
      }
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId &&
          item.shopId === action.payload.shopId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] }
    }

    default:
      return state
  }
}

const initialState = {
  items: JSON.parse(localStorage.getItem('croil-cart')) || []
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    localStorage.setItem('croil-cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item })
  const removeFromCart = (productId, shopId) => dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, shopId } })
  const updateQuantity = (productId, shopId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, shopId, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}