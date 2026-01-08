import React, { createContext, useReducer } from 'react';

const initalState = {
  switchTab: '',
  closeStripeModal: "none",
  paymentStatus: "",
  updateTable: "false",
  hideDiv: "false",
  cardLength: 0
};
const StoreContext = createContext(initalState);

const { Provider } = StoreContext;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SWITCH_TAB":
        return { ...state, switchTab: action.payload };
      case "CLOSE_STRIPE_MODAL":
        return { closeStripeModal: action.payload };
      case "PAYMENT_STATUS":
        return { paymentStatus: action.payload };
      case "HIDE_DIV":
        return { hideDiv: action.payload }
      case "CARD_LENGTH":
        return { cardLength: action.payload }
      default:
        return state;
    }
  }, initalState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { StoreProvider, StoreContext }