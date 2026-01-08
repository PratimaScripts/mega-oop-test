import React, { createContext, useCallback, useReducer } from "react";

const initalState = {
  loading: true,
  transactions: { success: false },
  openTransactionModal: false,
  openEditPaymentModal: false,
  transactionDetail: null,
  openCreateTransactionDrawer: false,
  transactionType: "businessIncome",
  editTransaction: false,
};

const TransactionContext = createContext(initalState);

const { Provider } = TransactionContext;
let type = "";

const TransactionProvider = ({ children }) => {
  const memoizedReducer = useCallback(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return {
            ...state,
            loading: action.payload,
          };

        case "GET_TRANSACTIONS":
          return {
            ...state,
            loading: false,
            transactions: action.payload,
          };
        case "CREATE_TRANSACTION":
          type =
            action.payload.data.transactionType === "Business Income"
              ? "businessIncome"
              : "businessExpenses";
          return {
            ...state,
            loading: false,
            transactions: {
              ...state.transactions,
              data: {
                ...state.transactions.data,
                [type]: [action.payload.data, ...state.transactions.data[type]],
              },
            },
          };
        case "UPDATE_TRANSACTION":
          type =
            action.payload.data.transactionType === "Business Income"
              ? "businessIncome"
              : "businessExpenses";

          return {
            ...state,
            loading: false,
            transactions: {
              ...state.transactions,
              data: {
                ...state.transactions.data,
                [type]: state.transactions.data[type].map((item) =>
                  item._id === action.payload.data._id
                    ? { ...item, ...action.payload.data }
                    : item
                ),
              },
            },
          };

        case "DELETE_TRANSACTION":
          type =
            action.payload.data.transactionType === "Business Income"
              ? "businessIncome"
              : "businessExpenses";

          return {
            ...state,
            loading: false,
            transactions: {
              ...state.transactions,
              data: {
                ...state.transactions.data,
                [type]: state.transactions.data[type].filter(
                  (item) => item._id !== action.payload.data._id
                ),
              },
            },
          };
        case "DELETE_INVOICE":
          type =
            action.payload.transactionType === "Business Income"
              ? "businessIncome"
              : "businessExpenses";

          return {
            ...state,
            loading: false,
            transactions: {
              ...state.transactions,
              data: {
                ...state.transactions.data,
                [type]: state.transactions.data[type].filter(
                  (item) => item._id !== action.payload.id
                ),
              },
            },
          };
        case "OPEN_EDIT_PAYMENT_MODAL":
          return {
            ...state,
            openEditPaymentModal: true,
            transactionDetail: action.payload,
          };
        case "CLOSE_EDIT_PAYMENT_MODAL":
          return {
            ...state,
            openEditPaymentModal: false,
          };
        case "OPEN_TRANSACTION_MODAL":
          return {
            ...state,
            openTransactionModal: true,
            transactionDetail: action.payload,
          };
        case "CLOSE_TRANSACTION_MODAL":
          return {
            ...state,
            openTransactionModal: false,
          };
        case "OPEN_CREATE_TRANSACTION_DRAWER":
          return {
            ...state,
            editTransaction: false,
            transactionType: action.payload,
            openCreateTransactionDrawer: true,
          };
        case "OPEN_CREATE_TRANSACTION_DRAWER_IN_EDIT_MODE":
          type =
            action.payload.transactionType === "Business Income"
              ? "businessIncome"
              : "businessExpenses";
          return {
            ...state,
            editTransaction: true,
            transactionType: type,
            transactionDetail: action.payload,
            openCreateTransactionDrawer: true,
          };
        case "CLOSE_CREATE_TRANSACTION_DRAWER":
          return {
            ...state,
            editTransaction: false,
            transactionDetail: null,
            openCreateTransactionDrawer: false,
          };
        default:
          return state;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initalState]
  );

  const [state, dispatch] = useReducer(memoizedReducer, initalState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { TransactionProvider, TransactionContext };
